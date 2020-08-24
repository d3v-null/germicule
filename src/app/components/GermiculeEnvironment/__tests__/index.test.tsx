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
  it('should match snapshot', () => {
    const loadingIndicator = render(<GermiculeEnvironment />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
