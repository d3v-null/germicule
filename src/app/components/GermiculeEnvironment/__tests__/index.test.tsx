import React from 'react';
import { render } from '@testing-library/react';
import echarts from 'echarts';

import { GermiculeEnvironment } from '..';

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

describe('<GermiculeEnvironment  />', () => {
  it('should match snapshot for eChart', () => {
    const loadingIndicator = render(
      <GermiculeEnvironment graphBackend="eCharts" />,
    );
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
  it('should match snapshot for D3', () => {
    const loadingIndicator = render(<GermiculeEnvironment graphBackend="D3" />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
