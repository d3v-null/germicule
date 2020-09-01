import { GermiculeItem } from '../../types/Germicule';
import {
  GraphInfo as EChartGraphInfo,
  GraphEdge as EChartGraphEdge,
  GraphNode as EChartGraphNode,
} from '../../types/EChartGraph';
import {
  GraphInfo as D3GraphInfo,
  GraphNode as D3GraphNode,
} from '../../types/D3Graph';

export const emptyGermicule: GermiculeItem[] = [];
export const emptyEChartGraphInfo: Partial<EChartGraphInfo> = {
  nodes: new Map<string, EChartGraphNode>([
    ['❓', { name: '❓', _label: '❓', category: 0 }],
  ]),
};
export const emptyD3GraphInfo: Partial<D3GraphInfo> = {
  nodes: new Map<string, D3GraphNode>([['❓', { id: '❓', group: 0 }]]),
};

export const unknownGermicule: GermiculeItem[] = [null];
export const unknownEChartGraphInfo: Partial<EChartGraphInfo> = {
  nodes: new Map<string, EChartGraphNode>([
    ['❓', { _label: '❓', category: 0, name: 'unknown 0', symbolSize: 30 }],
  ]),
};
export const unknownD3GraphInfo: Partial<D3GraphInfo> = {
  nodes: new Map<string, D3GraphNode>([
    ['❓', { _label: 'unknown 0', group: 0, id: '❓', index: 0 }],
  ]),
};

export const lonelyGermicule: GermiculeItem[] = [
  { name: '🦄', entityValue: 5 } as GermiculeItem,
];
export const lonelyEChartGraphInfo: Partial<EChartGraphInfo> = {
  nodes: new Map<string, EChartGraphNode>([
    ['🦄', { name: '🦄', _label: '🦄', value: 5 }],
  ]),
};
export const lonelyD3GraphInfo: Partial<D3GraphInfo> = {
  nodes: new Map<string, D3GraphNode>([
    ['🦄', { id: '🦄', group: 0, value: 5 }],
  ]),
};

export const twinGermicule: GermiculeItem[] = [
  {
    name: '🌞',
    entityValue: 3,
    connections: [
      {
        name: '🌏',
        entityValue: 2,
        connectionValue: 5,
        connectionDescription: 'planet',
      },
    ],
  },
] as GermiculeItem[];
export const twinEChartGraphInfo: Partial<EChartGraphInfo> = {
  nodes: new Map<string, EChartGraphNode>([
    ['🌏', { name: '🌏', _label: '🌏', value: 2 }],
    ['🌞', { name: '🌞', _label: '🌞', value: 3 }],
  ]),
  edges: new Map<string, EChartGraphEdge>([
    ['🌞 > 🌏', { source: '🌞', target: '🌏', value: 5, _label: 'planet' }],
  ]),
};
export const twinD3GraphInfo: Partial<D3GraphInfo> = {
  nodes: new Map<string, D3GraphNode>([
    ['🌏', { id: '🌏', value: 2 }],
    ['🌞', { id: '🌞', value: 3 }],
  ]),
  links: [{ source: '🌞', target: '🌏', value: 5 }],
} as Partial<D3GraphInfo>;

export const linkGermicule: GermiculeItem[] = [
  {
    name: '🌞',
    connections: [
      {
        name: '🌏',
        connectionDescription: 'planet',
        connections: [
          {
            name: '🌚',
            connectionDescription: 'sattelite',
            connections: [
              {
                link: '🌞',
                connectionDescription: 'best buds',
              },
            ],
          },
        ],
      },
    ],
  },
];
export const linkEChartGraphInfo: Partial<EChartGraphInfo> = {
  nodes: new Map<string, EChartGraphNode>([
    ['🌞', { name: '🌞', _label: '🌞' }],
    ['🌚', { name: '🌚', _label: '🌚' }],
    ['🌏', { name: '🌏', _label: '🌏' }],
  ]),
  edges: new Map<string, EChartGraphEdge>([
    ['🌚 > 🌞', { source: '🌚', target: '🌞' }],
    ['🌏 > 🌚', { source: '🌏', target: '🌚' }],
    ['🌞 > 🌏', { source: '🌞', target: '🌏' }],
  ]),
};

export const groupGermicule: GermiculeItem[] = [
  {
    name: '🏳️‍🌈',
    group: 'flags',
    connections: [
      { name: '🔴', group: 'colors' },
      { name: '🔵', group: 'colors' },
      { name: '⛳', group: 'flags' },
      { name: '🎌', group: 'flags' },
    ],
  },
] as GermiculeItem[];

export const groupEChartGraphInfo: Partial<EChartGraphInfo> = {
  nodes: new Map<string, EChartGraphNode>([
    ['🔴', { name: '🔴', category: 1 }],
    ['🔵', { name: '🔵', category: 1 }],
    ['⛳', { name: '⛳', category: 2 }],
    ['🎌', { name: '🎌', category: 2 }],
    ['🏳️‍🌈', { name: '🏳️‍🌈', category: 2 }],
  ]),
  edges: new Map<string, EChartGraphEdge>([
    ['🔵 > 🔴', { source: '🔵', target: '🔴' }],
    ['🎌 > ⛳', { source: '🎌', target: '⛳' }],
    ['🏳️‍🌈 > 🎌', { source: '🏳️‍🌈', target: '🎌' }],
    ['🏳️‍🌈 > ⛳', { source: '🏳️‍🌈', target: '⛳' }],
    ['🏳️‍🌈 > 🔵', { source: '🏳️‍🌈', target: '🔵' }],
    ['🏳️‍🌈 > 🔴', { source: '🏳️‍🌈', target: '🔴' }],
  ]),
  groups: new Map([
    ['unknown', { id: 0, name: 'unknown', members: [] }],
    ['colors', { id: 1, name: 'colors', members: ['🔴', '🔵'] }],
    ['flags', { id: 2, name: 'flags', members: ['⛳', '🎌', '🏳️‍🌈'] }],
  ]),
} as EChartGraphInfo;
