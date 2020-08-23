export type GermiculeItem = {
  name: string;
  label?: string;
  risk?: number;
  contact?: number;
  description?: string;
  cluster?: string;
  germicule: Array<GermiculeItem>;
} | null;

export type GermiculeCluster = {
  name: string;
  location?: string;
};

export type GermiculeMeta = {
  version?: string;
  clusters?: Array<GermiculeCluster>;
  germicules: Array<GermiculeItem>;
};

export type GraphNode = {
  name: string;
  _label?: string;
  value?: number;
  symbolSize?: number;
  tooltip?: string;
  category?: string;
};

export type GraphEdge = {
  source: string;
  target: string;
};

export type GraphCategory = {
  name: string;
};

export type GraphInfo = {
  nodes: Array<GraphNode>;
  edges?: Array<GraphEdge>;
  categories?: Array<GraphCategory>;
};
