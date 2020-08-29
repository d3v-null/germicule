export type GraphCluster = {
  id: number;
  name: string;
  members: string[];
  location?: string;
};

export type GraphInfo<GraphNode, GraphEdge> = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  partialEdges: Partial<GraphEdge[]>;
  clusters: Map<string, GraphCluster>;
};