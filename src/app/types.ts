export type GermiculeItem = {
  name: string;
  label?: string;
  risk?: number;
  contact?: number;
  description?: string;
  cluster?: string;
  germicule: GermiculeItem[];
} | null;

export type GermiculeCluster = {
  name: string;
  location?: string;
  members?: string[];
};

export type GermiculeMeta = {
  version?: string;
  clusters?: GermiculeCluster[];
  germicules: GermiculeItem[];
};

export type GraphNode = {
  name: string;
  _label?: string;
  tooltip?: object;
  _tooltip?: string;
  value?: number;
  symbolSize?: number;
  category?: number;
};

export type GraphEdge = {
  source: string;
  target: string;
  value?: number;
  label?: object;
  _label?: string;
  _tooltip?: string;
};

export type GraphCategory = {
  name: string;
};

export type GraphInfo = {
  nodes: GraphNode[];
  edges?: GraphEdge[];
  partialEdges?: Partial<GraphEdge[]>;
  categories?: GraphCategory[];
};
