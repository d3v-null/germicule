import React from 'react';
import { render } from '@testing-library/react';

import { GermiculeGraph, deconstructGermicule } from '..';

import {
  GermiculeItem,
  // GermiculeCluster,
  // GermiculeMeta,
  // GraphNode,
  // GraphEdge,
  // GraphCategory,
  GraphInfo,
} from '../../../types';

const emptyGermicule: Array<GermiculeItem> = [];
const emptyGraphInfo: GraphInfo = {
  nodes: [],
};

const unknownGermicule: Array<GermiculeItem> = [null as GermiculeItem];
const unknownGraphInfo: GraphInfo = {
  nodes: [
    {
      name: 'unknown 0',
      _label: '❓',
    },
  ],
};

const lonelyGermicule: Array<GermiculeItem> = [
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
});
