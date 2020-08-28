import React from 'react';
import { render } from '@testing-library/react';
import echarts from 'echarts';
import { GermiculeGraph } from '..';
import { lonelyGermicule } from '../../../__tests__/germicule.data';

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
