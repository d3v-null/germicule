import {
  GraphInfo as BaseGraphInfo,
  GraphEdge as BaseGraphEdge,
  GraphNode as BaseGraphNode,
} from './Graph';

export interface GraphNode extends BaseGraphNode {
  id: string;
  _label?: string;
  _tooltip?: string;
  group?: number;
  index?: number;
  fx?: number | null;
  fy?: number | null;
  x?: number;
  y?: number;
  icon?: string;
}

export interface GraphEdge extends BaseGraphEdge {
  _label?: string;
  _tooltip?: string;
}

export type GraphInfo = BaseGraphInfo<GraphNode, GraphEdge>;
