/**
 *
 * GermiculeGraph
 *
 */
import React from 'react';
// import { useTranslation } from 'react-i18next';
import ReactEcharts from 'echarts-for-react';
import {
  GermiculeItem,
  GermiculeMeta,
  GraphInfo,
  GermiculeNode,
  GraphNode,
  GraphEdge,
  GraphCluster,
} from '../../types';

export type Props = {
  data: GermiculeMeta;
  style?: object;
};

let UNKNOWN_COUNT: number = 0;
function getNextUnknown() {
  return UNKNOWN_COUNT++;
}

const BACKGROUND_COLOR = '#fdf6e3'; /* base3 */

const SYMBOL_SIZE = 30;
const CATEGORY_INFO = [
  { name: '0', itemStyle: { color: '#859900' /* green */ } },
  { name: '1', itemStyle: { color: '#2aa198' /* cyan */ } },
  { name: '2', itemStyle: { color: '#268bd2' /* blue */ } },
  { name: '3', itemStyle: { color: '#6c71c4' /* violet */ } },
  { name: '4', itemStyle: { color: '#d33682' /* magenta */ } },
  { name: '5', itemStyle: { color: '#dc322f' /* red */ } },
  { name: 'unknown', itemStyle: { color: BACKGROUND_COLOR } },
];

const UNKNOWN_LABEL: string = '❓';

const DEFAULT_NODE: Partial<GraphNode> = {
  name: UNKNOWN_LABEL,
  _label: UNKNOWN_LABEL,
  symbolSize: SYMBOL_SIZE,
  category: CATEGORY_INFO.length - 1,
};

function toNode(item: GermiculeItem): GraphNode {
  let partial: Partial<GraphNode> = {
    ...DEFAULT_NODE,
    // _tooltip: JSON.stringify(item),
  };
  if (item === null) {
    return {
      ...partial,
      name: `unknown ${getNextUnknown()}`,
    };
  }
  item = item as GermiculeNode;
  const result: GraphNode = {
    ...partial,
    name: item.name,
    _label: item.name,
  };
  if (item.risk) {
    result.value = item.risk;
    result._tooltip = String(item.risk);
    result.category = Math.ceil(item.risk);
    result.symbolSize = SYMBOL_SIZE * (1 + (5 - item.risk) / 5);
  }
  return result;
}

const DEFAULT_EDGE: Partial<GraphEdge> = {
  lineStyle: {
    type: 'solid',
  },
};
const DEFAULT_CLUSTER_EDGE: Partial<GraphEdge> = {
  lineStyle: {
    type: 'none',
  },
  label: {
    show: false,
  },
};

function toPartialEdge(
  item: GermiculeItem,
  target: string,
): Partial<GraphEdge> {
  let result: Partial<GraphEdge> = { ...DEFAULT_EDGE, target };
  if (item && 'description' in item) {
    result._label = item.description;
    result._tooltip = item.description;
  } else {
    result.label = { show: false };
  }
  if (item && 'contact' in item) {
    result.value = item.contact;
  }
  return result;
}

export function buildGraph(members: Array<GermiculeItem>): GraphInfo {
  const result: GraphInfo = {
    nodes: [],
    edges: [],
    partialEdges: [],
    clusters: new Map<string, GraphCluster>(),
  };
  members.forEach((member: GermiculeItem) => {
    if (member && 'link' in member) {
      result.partialEdges!.push(
        toPartialEdge(member, member.link) as GraphEdge,
      );
      return;
    }
    const node: GraphNode = toNode(member);
    result.nodes.push(node);
    result.partialEdges!.push(toPartialEdge(member, node.name) as GraphEdge);
    if (member && 'germicule' in member) {
      const childGraph = buildGraph(member!.germicule);
      // console.log(`childGraph: ${JSON.stringify(childGraph)}`);
      result.nodes.push(...childGraph.nodes);
      result.edges!.push(...childGraph.edges!);
      if ('partialEdges' in childGraph) {
        childGraph.partialEdges!.forEach(partialChildEdge => {
          result.edges!.push({
            ...partialChildEdge,
            source: node.name,
          } as GraphEdge);
        });
      }
      childGraph.clusters?.forEach((childCluster, childClusterName) => {
        if (result.clusters!.has(childClusterName)) {
          const cluster = result.clusters!.get(childClusterName)!;
          cluster.members!.push(...childCluster.members!);
        } else {
          result.clusters!.set(childClusterName, childCluster);
        }
      });
    }
    if (member && 'clusters' in member) {
      member.clusters?.forEach(clusterName => {
        if (result.clusters!.has(clusterName)) {
          const cluster: GraphCluster = result.clusters!.get(clusterName)!;
          if ('members' in cluster) {
            cluster.members!.forEach(clusterMember => {
              result.edges!.push({
                ...DEFAULT_CLUSTER_EDGE,
                source: node.name,
                target: clusterMember,
              });
            });
            cluster.members!.push(node.name);
          }
        } else {
          result.clusters!.set(clusterName, {
            name: clusterName,
            members: [node.name],
          } as GraphCluster);
        }
      });
    }
  });
  return result;
}

const DEFAULT_GRAPH_INFO: GraphInfo = {
  nodes: [{ ...DEFAULT_NODE, _tooltip: 'your germicule is empty' }],
} as GraphInfo;

export class GermiculeGraph extends React.Component<Props> {
  // const { t, i18n } = useTranslation();
  // {t('')}

  getOption() {
    const graphInfo: GraphInfo =
      this.props.data && 'germicules' in this.props.data
        ? buildGraph(this.props.data.germicules)
        : DEFAULT_GRAPH_INFO;
    // console.log('graphInfo', graphInfo);
    // const categoryNames =
    //   'categories' in graphInfo
    //     ? graphInfo.categories!.map((category: GraphCategory) => category.name)
    //     : [];
    return {
      legend: {
        // data: categoryNames,
      },
      tooltip: {
        show: true,
        formatter: params => params.data._tooltip,
        position: 'bottom',
      },
      backgroundColor: BACKGROUND_COLOR,
      series: [
        {
          type: 'graph',
          layout: 'force',
          animation: true,
          categories: CATEGORY_INFO,
          label: {
            show: true,
            position: 'inside',
            formatter: params => params.data._label,
          },
          edgeLabel: {
            show: true,
            position: 'middle',
            formatter: params => params.data._label,
          },
          nodeScaleRatio: 0,
          roam: true,
          draggable: true,
          nodes: graphInfo.nodes,
          // categories: graphInfo.categories,
          force: {
            edgeLength: 150,
            repulsion: 500,
            gravity: 0.2,
          },
          edges: graphInfo.edges,
        },
      ],
    };
  }

  onChartReadyCallback() {
    console.log('onChartReadyCallback');
  }

  render() {
    return (
      <div id="germicule-graph" style={this.props.style}>
        <ReactEcharts
          option={this.getOption()}
          notMerge={true}
          lazyUpdate={true}
          theme={'theme_name'}
          onChartReady={this.onChartReadyCallback}
          // onEvents={EventsDict}
          style={{ height: '100vh', width: '100%' }}
        />
      </div>
    );
  }
}
