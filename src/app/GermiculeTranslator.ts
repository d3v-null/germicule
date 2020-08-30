/**
 *
 * GermiculeTranslator
 *
 */

import {
  GermiculeItem,
  GermiculeMeta,
  GermiculeNode,
  GermiculeGroup,
  GraphThemeDef,
} from '../types/Germicule';
import {
  GraphInfo as EChartGraphInfo,
  GraphNode as EChartGraphNode,
  GraphEdge as EChartGraphEdge,
} from '../types/EChartGraph';
import {
  GraphInfo as D3GraphInfo,
  GraphNode as D3GraphNode,
  GraphEdge as D3GraphEdge,
} from '../types/D3Graph';
import {
  GraphGroup,
  GraphInfo,
  GraphEdge as BaseGraphEdge,
  GraphNode as BaseGraphNode,
} from '../types/Graph';

export const defaultCategory = 'unknown';

export const DEFAULT_THEME: GraphThemeDef = {
  background: '#fdf6e3',
  risks: new Map<number, string>([
    [0, '#859900'] /* green */,
    [1, '#2aa198'] /* cyan */,
    [2, '#268bd2'] /* blue */,
    [3, '#6c71c4'] /* violet */,
    [4, '#d33682'] /* magenta */,
    [5, '#dc322f'] /* red */,
  ]),
}; /* base3 */

export abstract class GermiculeTranslator<
  GraphNode extends BaseGraphNode,
  GraphEdge extends BaseGraphEdge
> {
  theme: GraphThemeDef = DEFAULT_THEME;

  constructor(theme?: GraphThemeDef) {
    if (theme) this.theme = theme;
  }

  unknownLabel: string = '❓';
  unknownCount: number = 0;
  getNextUnknown() {
    return this.unknownCount++;
  }

  groupCount: number = 0;
  groupsSeen = new Map<string, number>();

  getGroupId(name: string) {
    if (!this.groupsSeen.has(name)) {
      this.groupsSeen.set(name, this.groupCount++);
      return this.groupCount;
    }
    return this.groupsSeen.get(name);
  }

  nodeCount: number = 0;
  nodesSeen = new Map<string, number>();

  getNodeId(name: string) {
    if (!this.nodesSeen.has(name)) {
      this.nodesSeen.set(name, this.nodeCount++);
      return this.nodeCount;
    }
    return this.nodesSeen.get(name);
  }

  getDefaultNode(): Partial<GraphNode> {
    throw new Error(`getDefaultNode(): Partial<GraphNode> not implemented`);
  }

  defaultEdge: Partial<GraphEdge> = {};
  defaultGroupEdge: Partial<GraphEdge> = {};

  defaultCategoryInfo: Partial<GraphGroup> = {};

  toNode(item: GermiculeItem): GraphNode {
    throw new Error('toNode(item: GermiculeItem): GraphNode not implemented');
  }

  toPartialEdge(item: GermiculeItem, target: string): Partial<GraphEdge> {
    throw new Error(
      'toPartialEdge(item: GermiculeItem, target: string): Partial<GraphEdge> not implemented',
    );
  }

  getNodeIdentifier(node: GraphNode): string {
    throw new Error(
      'getNodeIdentifier(node: GraphNode): string not implemented',
    );
  }

  setNodeGroupIndex(node: GraphNode, groupIndex: number): void {
    throw new Error(
      'getNodeIdentifier(node: GraphNode): string not implemented',
    );
  }

  isValidRisk(risk: number): boolean {
    return Math.ceil(risk) < Array.from(this.theme.risks.keys()).length;
  }

  edgeName(source: string, target: string): string {
    return `${source} > ${target}`;
  }

  buildGraph(
    members: Array<GermiculeItem>,
    accumulator: GraphInfo<GraphNode, GraphEdge>,
  ): void {
    const parentPartialEdges: Partial<GraphEdge[]> = [];
    members.forEach((member: GermiculeItem) => {
      if (!member) return;
      if ('link' in member) {
        parentPartialEdges.push(
          this.toPartialEdge(member, member.link) as GraphEdge,
        );
        return;
      }
      if ('connections' in member) {
        this.buildGraph(member.connections, accumulator);
      }
      const node: GraphNode = this.toNode(member);
      const source = this.getNodeIdentifier(node);
      while (accumulator.partialEdges.length) {
        const partialEdge = accumulator.partialEdges.pop();
        if (!partialEdge) return;
        const edgeName = this.edgeName(source, partialEdge.target);
        if (accumulator.edges.has(edgeName)) {
          return;
        }
        accumulator.edges.set(edgeName, {
          ...partialEdge,
          source: this.getNodeIdentifier(node),
        } as GraphEdge);
      }
      if ('group' in member) {
        if (!accumulator.groups.has(member.group!)) {
          accumulator.groups.set(member.group!, {
            name: member.group,
            members: [],
            id: this.getGroupId(member.group!),
          } as GraphGroup);
        }
        const group: GraphGroup = accumulator.groups.get(member.group!)!;
        if (group.members === undefined) {
          group.members = [];
        }
        group.members!.forEach(groupMember => {
          const edgeName = this.edgeName(source, groupMember);
          if (accumulator.edges.has(edgeName)) return;
          accumulator.edges.set(edgeName, {
            ...this.defaultGroupEdge,
            source: this.getNodeIdentifier(node),
            target: groupMember,
          } as GraphEdge);
        });
        group.members!.push(this.getNodeIdentifier(node));
        this.setNodeGroupIndex(node, group.id);
      }
      parentPartialEdges.push(
        this.toPartialEdge(member, this.getNodeIdentifier(node)) as GraphEdge,
      );
      node.index = this.getNodeId(this.getNodeIdentifier(node));
      accumulator.nodes.push(node);
    });
    accumulator.partialEdges.push(...parentPartialEdges);
  }

  getAccumulator(data?: GermiculeMeta): GraphInfo<GraphNode, GraphEdge> {
    throw new Error(
      'getAccumulator(data?: GermiculeMeta): GraphInfo<GraphNode, GraphEdge> not implemented',
    );
  }

  toGraphInfo(data: GermiculeMeta): GraphInfo<GraphNode, GraphEdge> {
    const accumulator = this.getAccumulator(data);
    if (data && 'connections' in data) {
      this.buildGraph(data.connections, accumulator);
    }
    // console.log('accumulator', accumulator);
    return accumulator;
  }
}

export class GermiculeEChartTranslator extends GermiculeTranslator<
  EChartGraphNode,
  EChartGraphEdge
> {
  symbolSize: number;

  constructor(theme?: GraphThemeDef, symbolSize?: number) {
    super(theme);
    this.symbolSize = symbolSize ? symbolSize : 30;
    this.groupsSeen.set(
      this.defaultCategoryInfo.name,
      this.defaultCategoryInfo.id,
    );
  }

  getNodeIdentifier(node: EChartGraphNode): string {
    return node.name;
  }

  setNodeGroupIndex(node: EChartGraphNode, groupIndex: number): void {
    node.category = groupIndex;
  }

  getDefaultNode(): Partial<EChartGraphNode> {
    return {
      name: this.unknownLabel,
      _label: this.unknownLabel,
      symbolSize: this.symbolSize,
      category: this.defaultCategoryInfo.id,
      itemStyle: {
        color: this.theme.background,
      },
    };
  }

  toNode(item: GermiculeItem): EChartGraphNode {
    let partial: Partial<EChartGraphNode> = {
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
    const result: EChartGraphNode = {
      ...partial,
      name: item.name,
      _label: item.name,
    };
    if (item.risk && this.isValidRisk(item.risk)) {
      result.value = item.risk;
      result._tooltip = String(item.risk);
      result.symbolSize = this.symbolSize * (1 + (5 - item.risk) / 5);
      result.itemStyle = {
        color: this.theme.risks.get(Math.ceil(item.risk)),
      };
    }
    return result;
  }

  defaultEdge: Partial<EChartGraphEdge> = {
    lineStyle: {
      type: 'solid',
    },
  };
  defaultGroupEdge: Partial<EChartGraphEdge> = {
    lineStyle: {
      type: 'none',
    },
    label: {
      show: false,
    },
  };

  defaultCategoryInfo: GraphGroup = {
    name: defaultCategory,
    members: [],
    id: 0,
  };

  toPartialEdge(item: GermiculeItem, target: string): Partial<EChartGraphEdge> {
    let result: Partial<EChartGraphEdge> = { ...this.defaultEdge, target };
    if (item && 'description' in item) {
      result._label = item.description;
      result._tooltip = item.description;
    } else {
      result.label = { show: false };
    }
    if (item && 'contact' in item && item.contact !== null) {
      result.value = item.contact;
    }
    return result;
  }

  getAccumulator(data?: GermiculeMeta): EChartGraphInfo {
    const result: EChartGraphInfo = {
      nodes: [],
      edges: new Map<string, EChartGraphEdge>(),
      partialEdges: [],
      groups: new Map<string, GraphGroup>([
        [this.defaultCategoryInfo.name, this.defaultCategoryInfo],
      ]),
    };
    if (!data || data.connections.length === 0) {
      result.nodes.push({
        ...this.getDefaultNode(),
        _tooltip: 'your germicule is empty',
      } as EChartGraphNode);
      return result;
    }
    if ('groups' in data) {
      data.groups?.forEach((group: GermiculeGroup) => {
        result.groups!.set(group.name, {
          ...group,
          id: this.getGroupId(group.name),
        } as GraphGroup);
      });
    }
    return result;
  }
}

export class GermiculeD3Translator extends GermiculeTranslator<
  D3GraphNode,
  D3GraphEdge
> {
  constructor(theme?: GraphThemeDef, symbolSize?: number) {
    super(theme);
  }

  defaultCategoryInfo: GraphGroup = {
    name: defaultCategory,
    members: [],
    id: 0,
  };

  getDefaultNode(): Partial<D3GraphNode> {
    return {
      id: this.unknownLabel,
      group: this.defaultCategoryInfo.id,
    };
  }

  getNodeIdentifier(node: D3GraphNode): string {
    return node.id;
  }

  setNodeGroupIndex(node: D3GraphNode, groupIndex: number): void {
    node.group = groupIndex;
  }

  toNode(item: GermiculeItem): D3GraphNode {
    let partial: Partial<D3GraphNode> = {
      ...this.getDefaultNode(),
      // _tooltip: JSON.stringify(item),
    };
    if (item === null) {
      return {
        ...partial,
        _label: `unknown ${this.getNextUnknown()}`,
      } as D3GraphNode;
    }
    item = item as GermiculeNode;
    const result: D3GraphNode = {
      ...partial,
      id: item.name,
      _label: item.name,
    };
    if (item.risk && this.isValidRisk(item.risk)) {
      result.value = item.risk;
      result._tooltip = String(item.risk);
      // result.symbolSize = this.symbolSize * (1 + (5 - item.risk) / 5);
      // result.itemStyle = {
      //   color: this.theme.risks[Math.ceil(item.risk)],
      // };
    }
    return result;
  }

  toPartialEdge(item: GermiculeItem, target: string): Partial<D3GraphEdge> {
    let result: Partial<D3GraphEdge> = { ...this.defaultEdge, target };
    if (item && 'description' in item) {
      result._label = item.description;
      result._tooltip = item.description;
    } else {
      // result.label = { show: false };
    }
    if (item && 'contact' in item && item.contact !== null) {
      result.value = item.contact;
    }
    return result;
  }

  getAccumulator(data?: GermiculeMeta): D3GraphInfo {
    const result: D3GraphInfo = {
      nodes: [],
      edges: new Map<string, D3GraphEdge>(),
      partialEdges: [],
      groups: new Map<string, GraphGroup>([
        [this.defaultCategoryInfo.name, this.defaultCategoryInfo],
      ]),
    };
    if (!data || data.connections.length === 0) {
      result.nodes.push({
        ...this.getDefaultNode(),
        _tooltip: 'your germicule is empty',
      } as D3GraphNode);
      return result;
    }
    if ('groups' in data) {
      data.groups?.forEach((group: GermiculeGroup) => {
        result.groups!.set(group.name, {
          ...group,
          id: this.getGroupId(group.name),
        } as GraphGroup);
      });
    }
    return result;
  }

  toGraphInfo(data: GermiculeMeta): GraphInfo<D3GraphNode, D3GraphEdge> {
    const accumulator = super.toGraphInfo(data);
    accumulator.edges.forEach((edge: D3GraphEdge, key: string) => {
      edge.source = this.getNodeId(edge.source);
      edge.target = this.getNodeId(edge.target);
    });
    return accumulator;
  }
}
