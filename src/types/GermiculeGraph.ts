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

export type GraphColorDef = {
  background: string;
  risks: Map<number, string>;
};
