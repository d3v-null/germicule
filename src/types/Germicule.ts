export type GermiculeLink = {
  link: string;
  connectionValue?: number;
  connectionType?: string;
  connectionDescription?: string;
};

export type ReservedGroupNames = '❓';

export type GroupName = Exclude<string, ReservedGroupNames>;

export type GermiculeNode = {
  name: string;
  label?: string;
  entityType?: string;
  entityValue?: number;
  entityDescription?: string;
  connectionValue?: number;
  connectionType?: string;
  connectionDescription?: string;
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
  foreground: string;
  backgroundHighlight: string;
  palette: string[];
};
