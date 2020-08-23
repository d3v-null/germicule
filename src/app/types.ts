export type Germicule = {
  name: string;
  risk?: number;
  contact?: number;
  description?: string;
  cluster?: string;
  germicule: Array<Germicule>;
};

export type GermiculeCluster = {
  name: string;
  location?: string;
};

export type GermiculeMeta = {
  version?: string;
  clusters?: Array<GermiculeCluster>;
  germicules: Array<Germicule>;
};

export type GraphNode = {
  name: string;
  label?: string;
  value?: number;
  tooltip?: string;
  category?: string;
};

export type GraphEdge = {
  source: string;
  target: string;
};

export type GraphCategory = {
  name: object;
};

export type GraphInfo = {
  nodes: Array<GraphNode>;
  edges?: Array<GraphEdge>;
  categories?: Array<GraphCategory>;
};
