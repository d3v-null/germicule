export type GermiculeLink = {
  link: string;
  contact?: number;
  description?: string;
};

export type ReservedGroupNames = '❓';

export type GroupName = Exclude<string, ReservedGroupNames>;

export type GermiculeNode = {
  name: string;
  entityType?: string;
  label?: string;
  risk?: number;
  contact?: number;
  description?: string;
  group?: GroupName;
  icon?: string;
  connections?: GermiculeItem[];
};

export type GermiculeItem = GermiculeNode | GermiculeLink | null;

export type GermiculeGroup = {
  name: GroupName;
  type?: string;
  location?: string;
  members?: string[];
};

export type GermiculeMeta = {
  version?: string;
  nodes?: GermiculeNode[];
  groups?: GermiculeGroup[];
  connections: GermiculeItem[];
};

export type GraphThemeDef = {
  background: string;
  risks: Map<number, string>;
};
