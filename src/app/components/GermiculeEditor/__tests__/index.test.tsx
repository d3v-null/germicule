import React from 'react';
import { render } from '@testing-library/react';

import { GermiculeEditor } from '..';
import { DEFAULT_SRC, DEFAULT_ON_UPDATE_SRC } from '../../GermiculeEnvironment';

describe('<GermiculeEditor  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(
      <GermiculeEditor src={DEFAULT_SRC} onUpdateSrc={DEFAULT_ON_UPDATE_SRC} />,
    );
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
