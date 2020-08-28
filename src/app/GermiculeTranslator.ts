/**
 *
 * GermiculeTranslator
 *
 */

import {
  GermiculeItem,
  GermiculeMeta,
  GraphInfo,
  GermiculeNode,
  GraphNode,
  GraphEdge,
  GraphCluster,
  GermiculeCluster,
  GraphColorDef,
} from './types';

const DEFAULT_CATEGORY = 'unknown';

export const DEFAULT_CATEGORY_INFO = {
  name: DEFAULT_CATEGORY,
  members: [],
  id: 0,
} as GraphCluster;

export class GermiculeTranslator {
  colors: GraphColorDef;
  symbolSize: number;

  constructor(colors: GraphColorDef, symbolSize?: number) {
    this.colors = colors;
    this.symbolSize = symbolSize ? symbolSize : 30;
  }

  unknownCount: number = 0;
  getNextUnknown() {
    return this.unknownCount++;
  }

  clusterCount: number = 0;
  clustersSeen = new Map<string, number>([
    [DEFAULT_CATEGORY_INFO.name, DEFAULT_CATEGORY_INFO.id],
  ]);
  getClusterId(name: string) {
    if (!this.clustersSeen.has(name)) {
      this.clustersSeen.set(name, this.clusterCount++);
      return this.clusterCount;
    }
    return this.clustersSeen.get(name);
  }

  unknownLabel: string = '❓';

  getDefaultNode(): Partial<GraphNode> {
    return {
      name: this.unknownLabel,
      _label: this.unknownLabel,
      symbolSize: this.symbolSize,
      category: DEFAULT_CATEGORY_INFO.id,
      itemStyle: {
        color: this.colors.background,
      },
    };
  }

  isValidRisk(risk: number): boolean {
    return Math.ceil(risk) < Array.from(this.colors.risks.keys()).length;
  }

  toNode(item: GermiculeItem): GraphNode {
    let partial: Partial<GraphNode> = {
      ...this.getDefaultNode(),
      // _tooltip: JSON.stringify(item),
    };
    if (item === null) {
      return {
        ...partial,
        name: `unknown ${this.getNextUnknown()}`,
      };
    }
    item = item as GermiculeNode;
    const result: GraphNode = {
      ...partial,
      name: item.name,
      _label: item.name,
    };
    if (item.risk && this.isValidRisk(item.risk)) {
      result.value = item.risk;
      result._tooltip = String(item.risk);
      result.symbolSize = this.symbolSize * (1 + (5 - item.risk) / 5);
      result.itemStyle = {
        color: this.colors.risks[Math.ceil(item.risk)],
      };
    }
    return result;
  }

  default_edge: Partial<GraphEdge> = {
    lineStyle: {
      type: 'solid',
    },
  };
  default_cluster_edge: Partial<GraphEdge> = {
    lineStyle: {
      type: 'none',
    },
    label: {
      show: false,
    },
  };

  toPartialEdge(item: GermiculeItem, target: string): Partial<GraphEdge> {
    let result: Partial<GraphEdge> = { ...this.default_edge, target };
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

  buildGraph(members: Array<GermiculeItem>, accumulator: GraphInfo): void {
    const parentPartialEdges: Partial<GraphEdge[]> = [];
    members.forEach((member: GermiculeItem) => {
      if (!member) return;
      if ('link' in member) {
        parentPartialEdges.push(
          this.toPartialEdge(member, member.link) as GraphEdge,
        );
        return;
      }
      if ('germicule' in member) {
        this.buildGraph(member.germicule, accumulator);
      }
      const node: GraphNode = this.toNode(member);
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
            id: this.getClusterId(member.cluster!),
          } as GraphCluster);
        }
        const cluster: GraphCluster = accumulator.clusters.get(
          member.cluster!,
        )!;
        if (cluster.members === undefined) {
          cluster.members = [];
        }
        cluster.members!.forEach(clusterMember => {
          accumulator.edges.push({
            ...this.default_cluster_edge,
            source: node.name,
            target: clusterMember,
          });
        });
        cluster.members!.push(node.name);
        node.category = cluster.id;
      }
      parentPartialEdges.push(
        this.toPartialEdge(member, node.name) as GraphEdge,
      );
      accumulator.nodes.push(node);
    });
    accumulator.partialEdges.push(...parentPartialEdges);
  }

  getAccumulator(data?: GermiculeMeta): GraphInfo {
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
        ...this.getDefaultNode(),
        _tooltip: 'your germicule is empty',
      } as GraphNode);
      return result;
    }
    if ('clusters' in data) {
      data.clusters?.forEach((cluster: GermiculeCluster) => {
        result.clusters!.set(cluster.name, {
          ...cluster,
          id: this.getClusterId(cluster.name),
        } as GraphCluster);
      });
    }
    return result;
  }

  toGraphInfo(data: GermiculeMeta): GraphInfo {
    const accumulator = this.getAccumulator(data);
    if (data && 'germicules' in data) {
      this.buildGraph(data.germicules, accumulator);
    }
    // console.log('accumulator', accumulator);
    return accumulator;
  }
}
