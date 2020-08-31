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
  GraphNode,
} from '../types/Graph';
import * as _ from 'lodash';

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

  getGroupIndex(name: string) {
    if (!this.groupsSeen.has(name)) {
      this.groupsSeen.set(name, this.groupCount++);
      return this.groupCount;
    }
    return this.groupsSeen.get(name)!;
  }

  nodeCount: number = 0;
  nodesSeen = new Map<string, number>();

  getNodeIndex(name: string) {
    if (!this.nodesSeen.has(name)) {
      this.nodesSeen.set(name, this.nodeCount++);
      return this.nodeCount;
    }
    return this.nodesSeen.get(name)!;
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
    throw new Error('not implemented');
  }

  getEdgeIdentifier(source: any, target: any): string {
    return `${source} > ${target}`;
  }

  isPlaceHolder(node: GraphNode): boolean {
    return node.placeholder === true;
  }

  setNodeGroupIndex(node: GraphNode, groupIndex: number): void {
    throw new Error('not implemented');
  }

  isValidRisk(risk: number): boolean {
    return Math.ceil(risk) < Array.from(this.theme.risks.keys()).length;
  }

  accumulateGroup(
    accumulator: GraphInfo<GraphNode, GraphEdge>,
    group: GraphGroup,
  ) {
    const identifier: string = group.name;
    if (accumulator.groups.has(identifier)) {
      throw new Error(
        `group with identifier ${identifier} defined twice: ${JSON.stringify(
          group,
        )}`,
      );
    }
    // group.id = this.getGroupIndex(group.name);
    accumulator.groups.set(identifier, group);
  }

  accumulateNode(
    accumulator: GraphInfo<GraphNode, GraphEdge>,
    node: GraphNode,
  ) {
    const identifier: string = this.getNodeIdentifier(node);
    if (
      accumulator.nodes.has(identifier) &&
      !this.isPlaceHolder(accumulator.nodes.get(identifier)!)
    ) {
      throw new Error(
        `node with identifier ${identifier} defined twice: ${JSON.stringify(
          node,
        )}`,
      );
    }

    accumulator.nodes.set(identifier, node);
  }

  accumulatePlaceHolderNode(
    accumulator: GraphInfo<GraphNode, GraphEdge>,
    identifier: string,
  ) {
    if (!accumulator.nodes.has(identifier)) {
      this.accumulateNode(accumulator, {
        ...this.toNode({ name: identifier }),
        placeholder: true,
      } as GraphNode);
    }
  }

  accumulateEdge(
    accumulator: GraphInfo<GraphNode, GraphEdge>,
    edge: GraphEdge,
  ) {
    const identifier: string = this.getEdgeIdentifier(edge.source, edge.target);
    if (accumulator.edges.has(identifier)) {
      throw new Error(
        `edge with identifier ${identifier} defined twice: ${JSON.stringify(
          edge,
        )}`,
      );
    }
    this.accumulatePlaceHolderNode(accumulator, edge.source);
    // edge.source = this.getNodeIndex(edge.source);
    this.accumulatePlaceHolderNode(accumulator, edge.target);
    // edge.target = this.getNodeIndex(edge.target);
    // edge._label = identifier;
    accumulator.edges.set(identifier, edge);
  }

  getAccumulator(data?: GermiculeMeta): GraphInfo<GraphNode, GraphEdge> {
    const accumulator: GraphInfo<GraphNode, GraphEdge> = {
      // nodes: data && data.nodes ? data.nodes!.map(this.toNode.bind(this)) : [],
      nodes: new Map<string, GraphNode>(),
      edges: new Map<string, GraphEdge>(),
      partialEdges: [],
      groups: new Map<string, GraphGroup>(),
    };
    this.accumulateGroup(accumulator, this.defaultCategoryInfo as GraphGroup);
    if (
      !data ||
      _.isEmpty(data) ||
      (_.isEmpty(data.connections) && _.isEmpty(data.nodes))
    ) {
      this.accumulateNode(accumulator, ({
        ...this.getDefaultNode(),
        _tooltip: 'your germicule is empty',
      } as unknown) as GraphNode);
      return accumulator;
    }
    if (data.nodes && !_.isEmpty(data.nodes)) {
      data.nodes.forEach((node: GermiculeNode) => {
        this.accumulateNode(accumulator, this.toNode(node));
      });
    }
    if (data.groups && !_.isEmpty(data.groups)) {
      data.groups.forEach((group: GermiculeGroup) => {
        this.accumulateGroup(accumulator, {
          ...group,
          id: this.getGroupIndex(group.name),
        } as GraphGroup);
      });
    }
    return accumulator;
  }

  buildGraph(
    members: Array<GermiculeItem>,
    accumulator: GraphInfo<GraphNode, GraphEdge>,
  ): void {
    const parentPartialEdges: Partial<GraphEdge[]> = [];
    members.forEach((member: GermiculeItem) => {
      if (member && 'link' in member) {
        this.accumulatePlaceHolderNode(accumulator, member.link);
        parentPartialEdges.push(
          this.toPartialEdge(member, member.link) as GraphEdge,
        );
        return;
      }
      if (member && member.connections) {
        this.buildGraph(member.connections!, accumulator);
      }
      const node: GraphNode = this.toNode(member);
      this.accumulateNode(accumulator, node);
      if (!member) return;
      const source = this.getNodeIdentifier(node);
      while (accumulator.partialEdges.length) {
        const partialEdge = accumulator.partialEdges.pop();
        if (!partialEdge) return;
        const getEdgeIdentifier = this.getEdgeIdentifier(
          source,
          partialEdge.target,
        );
        if (!accumulator.edges.has(getEdgeIdentifier)) {
          this.accumulateEdge(accumulator, {
            ...partialEdge,
            source,
          } as GraphEdge);
        }
      }
      if ('group' in member) {
        if (!accumulator.groups.has(member.group!)) {
          this.accumulateGroup(accumulator, {
            name: member.group,
            members: [],
            id: this.getGroupIndex(member.group!),
          } as GraphGroup);
        }
        const group: GraphGroup = accumulator.groups.get(member.group!)!;
        if (group.members === undefined) {
          group.members = [];
        }
        group.members!.forEach(groupMember => {
          const getEdgeIdentifier = this.getEdgeIdentifier(source, groupMember);
          if (accumulator.edges.has(getEdgeIdentifier)) return;
          this.accumulateEdge(accumulator, {
            ...this.defaultGroupEdge,
            source,
            target: groupMember,
          } as GraphEdge);
        });
        group.members!.push(source);
        this.setNodeGroupIndex(node, group.id);
      }
      parentPartialEdges.push(
        this.toPartialEdge(member, this.getNodeIdentifier(node)) as GraphEdge,
      );
    });
    accumulator.partialEdges.push(...parentPartialEdges);
  }

  // getAccumulator(data?: GermiculeMeta): GraphInfo<GraphNode, GraphEdge> {
  //   throw new Error(
  //     'getAccumulator(data?: GermiculeMeta): GraphInfo<GraphNode, GraphEdge> not implemented',
  //   );
  // }

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

  entityIcons = new Map<string, string>([
    ['default', '/graphIcons/default.png'],
    ['firm', '/graphIcons/defaultFirm.png'],
    ['Bond', '/graphIcons/defaultBond.png'],
  ]);

  toNode(item: GermiculeItem): D3GraphNode {
    let partial: Partial<D3GraphNode> = {
      ...this.getDefaultNode(),
      // _tooltip: JSON.stringify(item),
    };
    let result: D3GraphNode;
    if (item === null) {
      result = {
        ...partial,
        _label: `unknown ${this.getNextUnknown()}`,
      } as D3GraphNode;
    } else {
      item = item as GermiculeNode;
      result = {
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
      if (item.icon) {
        result.icon = item.icon;
      } else if (item.entityType) {
        result.icon = this.entityIcons.get(item.entityType);
      }
      ['entityType'].forEach((key: string) => {
        if (item && key in item) {
          result[key] = item[key];
        }
      });
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

  toGraphInfo(data: GermiculeMeta): GraphInfo<D3GraphNode, D3GraphEdge> {
    const accumulator = super.toGraphInfo(data);
    let nodeCount: number = 0;
    const placeHolders: D3GraphNode[] = [];
    accumulator.nodes.forEach((node: D3GraphNode, key: string) => {
      if (this.isPlaceHolder(node)) {
        placeHolders.push(node);
      }
      node.index = nodeCount++;
    });
    const badEdges = new Map<string, string>();
    accumulator.edges.forEach((edge: D3GraphEdge, key: string) => {
      if (!accumulator.nodes.has(edge.source)) {
        badEdges.set(
          key,
          `edge with source ${edge.source} is not defined in nodes`,
        );
        return;
      }
      edge.source = accumulator.nodes.get(edge.source as string)!.index;
      if (!accumulator.nodes.has(edge.target)) {
        badEdges.set(
          key,
          `edge with target ${edge.target} is not defined in nodes`,
        );
      }
      edge.target = accumulator.nodes.get(edge.target as string)!.index;
    });
    const errors: string[] = [];
    if (!_.isEmpty(placeHolders)) {
      errors.push(
        `links pointing to ${JSON.stringify(
          placeHolders,
        )} with no node definition`,
      );
    }
    if (!_.isEmpty(badEdges)) {
      errors.push(`bad edges: ${JSON.stringify(badEdges)}`);
    }
    if (!_.isEmpty(errors)) {
      throw new Error(errors.join('\n'));
    }
    return accumulator;
  }
}
