import { GraphInfo as BaseGraphInfo } from './Graph';

export type GraphNode = {
  name: string;
  _label?: string;
  tooltip?: object;
  _tooltip?: string;
  value?: number;
  symbolSize?: number;
  category?: number;
  itemStyle?: object;
};

export type GraphEdge = {
  source: string;
  target: string;
  value?: number;
  label?: object;
  _label?: string;
  _tooltip?: string;
  lineStyle?: object;
};

export type GraphInfo = BaseGraphInfo<GraphNode, GraphEdge>;
