export type GraphNode = {
  index?: number;
  placeholder?: boolean;
  entityType?: string;
};

export type GraphEdge = {
  source: any;
  target: any;
  _label?: string;
};

export type GraphGroup = {
  id: number;
  name: string;
  members: string[];
  location?: string;
};

export type GraphInfo<GraphNode, GraphEdge> = {
  nodes: Map<string, GraphNode>;
  edges: Map<string, GraphEdge>;
  partialEdges: Partial<GraphEdge[]>;
  groups: Map<string, GraphGroup>;
  // meta: object;
};
