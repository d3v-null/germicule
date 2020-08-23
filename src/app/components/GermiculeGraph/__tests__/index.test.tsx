import React from 'react';
import { render } from '@testing-library/react';
import echarts from 'echarts';
import { GermiculeGraph, buildGraph } from '..';

import { GermiculeItem, GraphInfo } from '../../../types';

const emptyGermicule: GermiculeItem[] = [];
const emptyGraphInfo: GraphInfo = {
  nodes: [],
};

const unknownGermicule: GermiculeItem[] = [null as GermiculeItem];
const unknownGraphInfo: GraphInfo = {
  nodes: [
    {
      name: 'unknown 0',
      _label: '❓',
    },
  ],
};

const lonelyGermicule: GermiculeItem[] = [
  {
    name: '🦄',
    risk: 5,
  } as GermiculeItem,
];
const lonelyGraphInfo: GraphInfo = {
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
const twinGraphInfo: GraphInfo = {
  nodes: [
    {
      name: '🌞',
      _label: '🌞',
      value: 3,
    },
    {
      name: '🌏',
      _label: '🌏',
      value: 2,
    },
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
const linkGraphInfo: GraphInfo = {
  nodes: [
    { name: '🌞', _label: '🌞' },
    { name: '🌏', _label: '🌏' },
    { name: '🌚', _label: '🌚' },
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
    clusters: ['colors', 'flags'],
    germicule: [
      { name: '🔴', clusters: ['colors'] },
      { name: '🔵', clusters: ['colors'] },
      { name: '🇦🇺', clusters: ['flags'] },
      { name: '🇪🇺', clusters: ['flags'] },
    ],
  },
] as GermiculeItem[];
const clusterGraphInfo: GraphInfo = {
  nodes: [
    { name: '🏳️‍🌈' },
    { name: '🔴' },
    { name: '🔵' },
    { name: '🇦🇺' },
    { name: '🇪🇺' },
  ],
  edges: [
    { source: '🏳️‍🌈', target: '🔴' },
    { source: '🏳️‍🌈', target: '🔵' },
    { source: '🔵', target: '🔴' },
    { source: '🏳️‍🌈', target: '🇦🇺' },
    { source: '🏳️‍🌈', target: '🇪🇺' },
    { source: '🇪🇺', target: '🇪🇺' },
  ],
  clusters: [
    { name: 'colors', members: ['🏳️‍🌈', '🔴', '🔵'] },
    { name: 'flags', members: ['🏳️‍🌈', '🇦🇺', '🇪🇺'] },
  ],
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
    const result = buildGraph(emptyGermicule);
    expect(result).toMatchObject(emptyGraphInfo);
  });
  it('should handle unknown germicule data', () => {
    const result = buildGraph(unknownGermicule);
    expect(result).toMatchObject(unknownGraphInfo);
  });
  it('should handle lonely germicule data', () => {
    const result = buildGraph(lonelyGermicule);
    expect(result).toMatchObject(lonelyGraphInfo);
  });
  it('should handle twin germicule data', () => {
    const result = buildGraph(twinGermicule);
    expect(result).toMatchObject(twinGraphInfo);
  });
  it('should handle link germicule data', () => {
    const result = buildGraph(linkGermicule);
    expect(result).toMatchObject(linkGraphInfo);
  });
  it('should handle cluster germicule data', () => {
    const result = buildGraph(clusterGermicule);
    expect(result).toMatchObject(clusterGraphInfo);
  });
});
