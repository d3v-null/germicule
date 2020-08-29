import { GermiculeItem } from '../../types/Germicule';
import { GraphInfo as EChartGraphInfo } from '../../types/EChartGraph';
import {
  GraphInfo as D3GraphInfo,
  GraphEdge as D3GraphEdge,
} from '../../types/D3Graph';

export const emptyGermicule: GermiculeItem[] = [];
export const emptyEChartGraphInfo: Partial<EChartGraphInfo> = {
  nodes: [{ name: '❓', _label: '❓', category: 0 }],
};
export const emptyD3GraphInfo: Partial<D3GraphInfo> = {
  nodes: [{ id: '❓', group: 0 }],
};

export const unknownGermicule: GermiculeItem[] = [null];
export const unknownEChartGraphInfo: Partial<EChartGraphInfo> = {
  nodes: [],
};
export const unknownD3GraphInfo: Partial<D3GraphInfo> = {
  nodes: [],
};

export const lonelyGermicule: GermiculeItem[] = [
  { name: '🦄', risk: 5 } as GermiculeItem,
];
export const lonelyEChartGraphInfo: Partial<EChartGraphInfo> = {
  nodes: [{ name: '🦄', _label: '🦄', value: 5 }],
};
export const lonelyD3GraphInfo: Partial<D3GraphInfo> = {
  nodes: [{ id: '🦄', group: 0, value: 5 }],
};

export const twinGermicule: GermiculeItem[] = [
  {
    name: '🌞',
    risk: 3,
    germicule: [
      {
        name: '🌏',
        risk: 2,
        contact: 5,
        description: 'planet',
      },
    ],
  },
] as GermiculeItem[];
export const twinEChartGraphInfo: Partial<EChartGraphInfo> = {
  nodes: [
    { name: '🌏', _label: '🌏', value: 2 },
    { name: '🌞', _label: '🌞', value: 3 },
  ],
  edges: [
    {
      source: '🌞',
      target: '🌏',
      value: 5,
      _label: 'planet',
    },
  ],
};
export const twinD3GraphInfo: Partial<D3GraphInfo> = {
  nodes: [
    { id: '🌏', group: 0, value: 2 },
    { id: '🌞', group: 0, value: 3 },
  ],
  links: [{ source: '🌞', target: '🌏', value: 5 }],
} as Partial<D3GraphInfo>;

export const linkGermicule: GermiculeItem[] = [
  {
    name: '🌞',
    germicule: [
      {
        name: '🌏',
        description: 'planet',
        germicule: [
          {
            name: '🌚',
            description: 'sattelite',
            germicule: [
              {
                link: '🌞',
                description: 'best buds',
              },
            ],
          },
        ],
      },
    ],
  },
];
export const linkEChartGraphInfo: Partial<EChartGraphInfo> = {
  nodes: [
    { name: '🌚', _label: '🌚' },
    { name: '🌏', _label: '🌏' },
    { name: '🌞', _label: '🌞' },
  ],
  edges: [
    { source: '🌚', target: '🌞' },
    { source: '🌏', target: '🌚' },
    { source: '🌞', target: '🌏' },
  ],
};

export const clusterGermicule: GermiculeItem[] = [
  {
    name: '🏳️‍🌈',
    cluster: 'flags',
    germicule: [
      { name: '🔴', cluster: 'colors' },
      { name: '🔵', cluster: 'colors' },
      { name: '⛳', cluster: 'flags' },
      { name: '🎌', cluster: 'flags' },
    ],
  },
] as GermiculeItem[];

export const clusterEChartGraphInfo: Partial<EChartGraphInfo> = {
  nodes: [
    { name: '🔴', category: 1 },
    { name: '🔵', category: 1 },
    { name: '⛳', category: 2 },
    { name: '🎌', category: 2 },
    { name: '🏳️‍🌈', category: 2 },
  ],
  edges: [
    { source: '🔵', target: '🔴' },
    { source: '🎌', target: '⛳' },
    { target: '🎌', source: '🏳️‍🌈' },
    { target: '⛳', source: '🏳️‍🌈' },
    { target: '🔵', source: '🏳️‍🌈' },
    { target: '🔴', source: '🏳️‍🌈' },
    { source: '🏳️‍🌈', target: '⛳' },
    { source: '🏳️‍🌈', target: '🎌' },
  ],
  clusters: new Map([
    ['unknown', { id: 0, name: 'unknown', members: [] }],
    ['colors', { id: 1, name: 'colors', members: ['🔴', '🔵'] }],
    ['flags', { id: 2, name: 'flags', members: ['⛳', '🎌', '🏳️‍🌈'] }],
  ]),
} as EChartGraphInfo;
