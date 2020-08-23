import React from 'react';
import { render } from '@testing-library/react';

import { GermiculeGraph, deconstructGermicule } from '..';

import {
  Germicule,
  // GermiculeCluster,
  // GermiculeMeta,
  // GraphNode,
  // GraphEdge,
  // GraphCategory,
  GraphInfo,
} from '../../../types';

const emptyGermicule: Array<Germicule> = [];
const emptyGraphInfo: GraphInfo = {
  nodes: [],
};

const lonelyGermicule: Array<Germicule> = [
  {
    name: '🦄',
  } as Germicule,
];
const lonelyGraphInfo: GraphInfo = {
  nodes: [
    {
      name: '🦄',
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
  it('should handle lonely germicule data', () => {
    const result = deconstructGermicule(lonelyGermicule);
    expect(result).toMatchObject(lonelyGraphInfo);
  });
});
