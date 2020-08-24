import React from 'react';
import { render } from '@testing-library/react';

import { GermiculeEditor } from '..';

describe('<GermiculeEditor  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<GermiculeEditor />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
