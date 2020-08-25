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
  GermiculeCluster,
} from '../../types';

export type Props = {
  data: GermiculeMeta;
  style?: object;
};

let UNKNOWN_COUNT: number = 0;
function getNextUnknown() {
  return UNKNOWN_COUNT++;
}

let CLUSTER_COUNT: number = 0;
const CLUSTERS_SEEN = new Map<string, number>();
function getClusterId(name: string) {
  if (!CLUSTERS_SEEN.has(name)) {
    CLUSTERS_SEEN.set(name, CLUSTER_COUNT++);
  }
  return CLUSTERS_SEEN.get(name);
}

const COLORS = {
  background: '#fdf6e3',
  risks: {
    0: '#859900' /* green */,
    1: '#2aa198' /* cyan */,
    2: '#268bd2' /* blue */,
    3: '#6c71c4' /* violet */,
    4: '#d33682' /* magenta */,
    5: '#dc322f' /* red */,
  },
}; /* base3 */

const MAX_RISK: number = Object.keys(COLORS.risks).length;

const SYMBOL_SIZE = 30;
const DEFAULT_CATEGORY = 'unknown';
const DEFAULT_CATEGORY_INFO = {
  name: DEFAULT_CATEGORY,
  members: [],
  id: getClusterId(DEFAULT_CATEGORY),
} as GraphCluster;

const UNKNOWN_LABEL: string = '❓';

const DEFAULT_NODE: Partial<GraphNode> = {
  name: UNKNOWN_LABEL,
  _label: UNKNOWN_LABEL,
  symbolSize: SYMBOL_SIZE,
  category: 0,
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
  if (item.risk && Math.ceil(item.risk) < MAX_RISK) {
    result.value = item.risk;
    result._tooltip = String(item.risk);
    result.symbolSize = SYMBOL_SIZE * (1 + (5 - item.risk) / 5);
    result.itemStyle = {
      color: COLORS.risks[Math.ceil(item.risk)],
    };
  } else {
    result.itemStyle = {
      color: COLORS.background,
    };
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
  return members.reduce(
    (accumulator: GraphInfo, member: GermiculeItem): GraphInfo => {
      if (member && 'link' in member) {
        accumulator.partialEdges!.push(
          toPartialEdge(member, member.link) as GraphEdge,
        );
        return accumulator;
      }
      const node: GraphNode = toNode(member);
      accumulator.partialEdges!.push(
        toPartialEdge(member, node.name) as GraphEdge,
      );
      if (member && 'germicule' in member) {
        const childGraph = buildGraph(member!.germicule);
        // console.log(`childGraph: ${JSON.stringify(childGraph)}`);
        accumulator.nodes.push(...childGraph.nodes);
        accumulator.edges!.push(...childGraph.edges!);
        if ('partialEdges' in childGraph) {
          childGraph.partialEdges!.forEach(partialChildEdge => {
            accumulator.edges!.push({
              ...partialChildEdge,
              source: node.name,
            } as GraphEdge);
          });
        }
        childGraph.clusters?.forEach((childCluster, childClusterName) => {
          if (accumulator.clusters!.has(childClusterName)) {
            const cluster = accumulator.clusters!.get(childClusterName)!;
            cluster.members!.push(...childCluster.members!);
          } else {
            accumulator.clusters!.set(childClusterName, childCluster);
          }
        });
      }
      if (member && 'cluster' in member) {
        if (!accumulator.clusters!.has(member.cluster!)) {
          accumulator.clusters!.set(member.cluster!, {
            name: member.cluster,
            members: [],
            id: getClusterId(member.cluster!),
          } as GraphCluster);
        }
        const cluster: GraphCluster = accumulator.clusters!.get(
          member.cluster!,
        )!;
        if ('members' in cluster) {
          cluster.members!.forEach(clusterMember => {
            accumulator.edges!.push({
              ...DEFAULT_CLUSTER_EDGE,
              source: node.name,
              target: clusterMember,
            });
          });
          cluster.members!.push(node.name);
        }
        node.category = cluster.id;
      }
      accumulator.nodes.push(node);
      return accumulator;
    },
    {
      nodes: [],
      edges: [],
      partialEdges: [],
      clusters: new Map<string, GraphCluster>([
        [DEFAULT_CATEGORY_INFO.name, DEFAULT_CATEGORY_INFO],
      ]),
    } as GraphInfo,
  );
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

    if (this.props.data && 'clusters' in this.props.data) {
      this.props.data.clusters?.forEach((cluster: GermiculeCluster) => {
        if (!graphInfo.clusters) {
          graphInfo.clusters = new Map<string, GraphCluster>([
            [DEFAULT_CATEGORY_INFO.name, DEFAULT_CATEGORY_INFO],
          ]);
        }
        if (!graphInfo.clusters.has(cluster.name)) {
          graphInfo.clusters.set(cluster.name, {
            ...cluster,
            id: getClusterId(cluster.name),
          } as GraphCluster);
        } else {
          graphInfo.clusters.set(cluster.name, {
            ...cluster,
            ...graphInfo.clusters.get(cluster.name),
          } as GraphCluster);
        }
      });
    }
    const categories = Array.from(graphInfo.clusters!.values());
    // console.log(categories);
    return {
      legend: {},
      tooltip: {
        show: true,
        formatter: params => params.data._tooltip,
        position: 'bottom',
      },
      backgroundColor: COLORS.background,
      series: [
        {
          type: 'graph',
          layout: 'force',
          animation: true,
          categories,
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
    // console.log('onChartReadyCallback');
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
