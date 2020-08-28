export type GermiculeLink = {
  link: string;
  contact?: number;
  description?: string;
};

export type ReservedClusterNames = '❓';

export type ClusterName = Exclude<string, ReservedClusterNames>;

export type GermiculeNode = {
  name: string;
  label?: string;
  risk?: number;
  contact?: number;
  description?: string;
  cluster?: ClusterName;
  germicule: GermiculeItem[];
};

export type GermiculeItem = GermiculeNode | GermiculeLink | null;

export type GermiculeCluster = {
  name: ClusterName;
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

export type GraphCluster = {
  id: number;
  name: string;
  members: string[];
  location?: string;
};

export type GraphInfo = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  partialEdges: Partial<GraphEdge[]>;
  clusters: Map<string, GraphCluster>;
};

export type GraphColorDef = {
  background: string;
  risks: Map<number, string>;
};
