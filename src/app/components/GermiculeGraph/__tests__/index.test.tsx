import React from 'react';
import { render } from '@testing-library/react';
import echarts from 'echarts';
import { EChartGermiculeGraph, D3GermiculeGraph } from '..';
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

describe('<EChartGermiculeGraph  />', () => {
  it('should match snapshot', () => {
    const result = render(
      <EChartGermiculeGraph data={{ connections: lonelyGermicule }} />,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });
});
describe('<D3GermiculeGraph  />', () => {
  it('should match snapshot', () => {
    const result = render(
      <D3GermiculeGraph
        data={{ connections: lonelyGermicule }}
        size={{ width: 100, height: 100 }}
      />,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });
});
