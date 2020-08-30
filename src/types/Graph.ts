export type GraphNode = {
  index?: number;
};

export type GraphEdge = {
  source: any;
  target: any;
};

export type GraphGroup = {
  id: number;
  name: string;
  members: string[];
  location?: string;
};

export type GraphInfo<GraphNode, GraphEdge> = {
  nodes: GraphNode[];
  edges: Map<string, GraphEdge>;
  partialEdges: Partial<GraphEdge[]>;
  groups: Map<string, GraphGroup>;
};
