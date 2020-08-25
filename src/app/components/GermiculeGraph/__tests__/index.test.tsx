import React from 'react';
import { render } from '@testing-library/react';
import echarts from 'echarts';
import { GermiculeGraph, toGraphInfo } from '..';

import { GermiculeItem, GraphInfo } from '../../../types';

const emptyGermicule: GermiculeItem[] = [];
const emptyGraphInfo: Partial<GraphInfo> = {
  nodes: [{ name: '❓', _label: '❓', category: 0 }],
};

const unknownGermicule: GermiculeItem[] = [null];
const unknownGraphInfo: Partial<GraphInfo> = {
  nodes: [],
};

const lonelyGermicule: GermiculeItem[] = [
  {
    name: '🦄',
    risk: 5,
  } as GermiculeItem,
];
const lonelyGraphInfo: Partial<GraphInfo> = {
  nodes: [
    {
      name: '🦄',
      _label: '🦄',
      value: 5,
    },
  ],
};

const twinGermicule: GermiculeItem[] = [
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
const twinGraphInfo: Partial<GraphInfo> = {
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

const linkGermicule: GermiculeItem[] = [
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
const linkGraphInfo: Partial<GraphInfo> = {
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

const clusterGermicule: GermiculeItem[] = [
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
const clusterGraphInfo: Partial<GraphInfo> = {
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

let spy: any;

beforeAll(() => {
  spy = jest.spyOn(echarts, 'getInstanceByDom').mockImplementation(() => {
    return {
      hideLoading: jest.fn(),
      setOption: jest.fn(),
      showLoading: jest.fn(),
    };
  });
});
afterAll(() => {
  spy.mockRestore();
});

describe('<GermiculeGraph  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(
      <GermiculeGraph data={{ germicules: lonelyGermicule }} />,
    );
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});

describe('deconstructGermicule', () => {
  it('should handle empty germicule data', () => {
    const result = toGraphInfo({ germicules: emptyGermicule });
    expect(result).toMatchObject(emptyGraphInfo);
  });
  it('should handle unknown germicule data', () => {
    const result = toGraphInfo({ germicules: unknownGermicule });
    expect(result).toMatchObject(unknownGraphInfo);
  });
  it('should handle lonely germicule data', () => {
    const result = toGraphInfo({ germicules: lonelyGermicule });
    expect(result).toMatchObject(lonelyGraphInfo);
  });
  it('should handle twin germicule data', () => {
    const result = toGraphInfo({ germicules: twinGermicule });
    expect(result).toMatchObject(twinGraphInfo);
  });
  it('should handle link germicule data', () => {
    const result = toGraphInfo({ germicules: linkGermicule });
    expect(result).toMatchObject(linkGraphInfo);
  });
  it('should handle cluster germicule data', () => {
    const result = toGraphInfo({ germicules: clusterGermicule });
    expect(result).toMatchObject(clusterGraphInfo);
  });
});
