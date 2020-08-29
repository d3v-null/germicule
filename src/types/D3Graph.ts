import { GraphInfo as BaseGraphInfo } from './Graph';

export type GraphNode = {
  id: string;
  _label?: string;
  _tooltip?: string;
  value?: number;
  group?: number;
};

export type GraphEdge = {
  source: string;
  target: string;
  _label?: string;
  _tooltip?: string;
  value?: number;
};

export type GraphInfo = BaseGraphInfo<GraphNode, GraphEdge>;