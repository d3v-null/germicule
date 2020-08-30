import {
  GraphInfo as BaseGraphInfo,
  GraphEdge as BaseGraphEdge,
  GraphNode as BaseGraphNode,
} from './Graph';

export interface GraphNode extends BaseGraphNode {
  name: string;
  _label?: string;
  tooltip?: object;
  _tooltip?: string;
  value?: number;
  symbolSize?: number;
  category?: number;
  itemStyle?: object;
}

export interface GraphEdge extends BaseGraphEdge {
  source: string;
  target: string;
  value?: number;
  label?: object;
  _label?: string;
  _tooltip?: string;
  lineStyle?: object;
}

export type GraphInfo = BaseGraphInfo<GraphNode, GraphEdge>;
