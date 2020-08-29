export type GraphNode = {};

export type GraphEdge = {
  source: any;
  target: any;
};

export type GraphCluster = {
  id: number;
  name: string;
  members: string[];
  location?: string;
};

export type GraphInfo<GraphNode, GraphEdge> = {
  nodes: GraphNode[];
  edges: Map<string, GraphEdge>;
  partialEdges: Partial<GraphEdge[]>;
  clusters: Map<string, GraphCluster>;
};
