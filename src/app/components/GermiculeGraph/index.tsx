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
export const DEFAULT_CATEGORY_INFO = {
  name: DEFAULT_CATEGORY,
  members: [],
  id: getClusterId(DEFAULT_CATEGORY),
} as GraphCluster;

const UNKNOWN_LABEL: string = '❓';

const DEFAULT_NODE: Partial<GraphNode> = {
  name: UNKNOWN_LABEL,
  _label: UNKNOWN_LABEL,
  symbolSize: SYMBOL_SIZE,
  category: DEFAULT_CATEGORY_INFO.id,
  itemStyle: {
    color: COLORS.background,
  },
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

export function buildGraph(
  members: Array<GermiculeItem>,
  accumulator: GraphInfo,
): void {
  const parentPartialEdges: Partial<GraphEdge[]> = [];
  members.forEach((member: GermiculeItem) => {
    if (!member) return;
    if ('link' in member) {
      parentPartialEdges.push(toPartialEdge(member, member.link) as GraphEdge);
      return;
    }
    if ('germicule' in member) {
      buildGraph(member.germicule, accumulator);
    }
    const node: GraphNode = toNode(member);
    while (accumulator.partialEdges.length) {
      const partialEdge = accumulator.partialEdges.pop();
      accumulator.edges.push({
        ...partialEdge,
        source: node.name,
      } as GraphEdge);
    }
    if ('cluster' in member) {
      if (!accumulator.clusters.has(member.cluster!)) {
        accumulator.clusters.set(member.cluster!, {
          name: member.cluster,
          members: [],
          id: getClusterId(member.cluster!),
        } as GraphCluster);
      }
      const cluster: GraphCluster = accumulator.clusters.get(member.cluster!)!;
      if (cluster.members === undefined) {
        cluster.members = [];
      }
      cluster.members!.forEach(clusterMember => {
        accumulator.edges.push({
          ...DEFAULT_CLUSTER_EDGE,
          source: node.name,
          target: clusterMember,
        });
      });
      cluster.members!.push(node.name);
      node.category = cluster.id;
    }
    parentPartialEdges.push(toPartialEdge(member, node.name) as GraphEdge);
    accumulator.nodes.push(node);
  });
  accumulator.partialEdges.push(...parentPartialEdges);
}

export function getAccumulator(data?: GermiculeMeta): GraphInfo {
  const result: GraphInfo = {
    nodes: [],
    edges: [],
    partialEdges: [],
    clusters: new Map<string, GraphCluster>([
      [DEFAULT_CATEGORY_INFO.name, DEFAULT_CATEGORY_INFO],
    ]),
  };
  if (!data || data.germicules.length === 0) {
    result.nodes.push({
      ...DEFAULT_NODE,
      _tooltip: 'your germicule is empty',
    } as GraphNode);
    return result;
  }
  if ('clusters' in data) {
    data.clusters?.forEach((cluster: GermiculeCluster) => {
      result.clusters!.set(cluster.name, {
        ...cluster,
        id: getClusterId(cluster.name),
      } as GraphCluster);
    });
  }
  return result;
}

export function toGraphInfo(data: GermiculeMeta): GraphInfo {
  const accumulator = getAccumulator(data);
  if (data && 'germicules' in data) {
    buildGraph(data.germicules, accumulator);
  }
  // console.log('accumulator', accumulator);
  return accumulator;
}

export class GermiculeGraph extends React.Component<Props> {
  // const { t, i18n } = useTranslation();
  // {t('')}

  getOption() {
    const graphInfo = toGraphInfo(this.props.data);
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
