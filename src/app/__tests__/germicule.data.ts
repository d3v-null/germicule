import { GermiculeItem, GraphInfo } from '../types';

export const emptyGermicule: GermiculeItem[] = [];
export const emptyGraphInfo: Partial<GraphInfo> = {
  nodes: [{ name: '❓', _label: '❓', category: 0 }],
};

export const unknownGermicule: GermiculeItem[] = [null];
export const unknownGraphInfo: Partial<GraphInfo> = {
  nodes: [],
};

export const lonelyGermicule: GermiculeItem[] = [
  {
    name: '🦄',
    risk: 5,
  } as GermiculeItem,
];
export const lonelyGraphInfo: Partial<GraphInfo> = {
  nodes: [
    {
      name: '🦄',
      _label: '🦄',
      value: 5,
    },
  ],
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
export const twinGraphInfo: Partial<GraphInfo> = {
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
export const linkGraphInfo: Partial<GraphInfo> = {
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

export const clusterGraphInfo: Partial<GraphInfo> = {
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
} as GraphInfo;
