import React from 'react';
import { render } from '@testing-library/react';
import echarts from 'echarts';
import { GermiculeGraph, deconstructGermicule } from '..';

import { GermiculeItem, GraphInfo, GermiculeLink } from '../../../types';

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
    risk: 1,
    germicule: [
      {
        name: '🌏',
        risk: 2,
        contact: 2,
        description: 'planet',
        germicule: [
          {
            name: '🌚',
            risk: 3,
            contact: 1,
            description: 'sattelite',
            germicule: [
              {
                link: '🌞',
                contact: 5,
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
    {
      name: '🌞',
      _label: '🌞',
      value: 1,
    },
    {
      name: '🌏',
      _label: '🌏',
      value: 2,
    },
    {
      name: '🌚',
      _label: '🌚',
      value: 3,
    },
  ],
  edges: [
    {
      source: '🌚',
      target: '🌞',
      value: 5,
      _label: 'best buds',
    },
    {
      source: '🌏',
      target: '🌚',
      value: 1,
      _label: 'sattelite',
    },
    {
      source: '🌞',
      target: '🌏',
      value: 2,
      _label: 'planet',
    },
  ],
};

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
    const result = deconstructGermicule(emptyGermicule);
    expect(result).toMatchObject(emptyGraphInfo);
  });
  it('should handle unknown germicule data', () => {
    const result = deconstructGermicule(unknownGermicule);
    expect(result).toMatchObject(unknownGraphInfo);
  });
  it('should handle lonely germicule data', () => {
    const result = deconstructGermicule(lonelyGermicule);
    expect(result).toMatchObject(lonelyGraphInfo);
  });
  it('should handle twin germicule data', () => {
    const result = deconstructGermicule(twinGermicule);
    expect(result).toMatchObject(twinGraphInfo);
  });
  it('should handle link germicule data', () => {
    const result = deconstructGermicule(linkGermicule);
    expect(result).toMatchObject(linkGraphInfo);
  });
});
