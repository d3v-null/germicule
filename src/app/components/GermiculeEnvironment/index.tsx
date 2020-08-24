/**
 *
 * GermiculeEnvironment
 *
 * Displays an interactive editor and graph side-by-side
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
// import { useTranslation } from 'react-i18next';
import { GermiculeGraph } from '../../components/GermiculeGraph';
import { GermiculeEditor } from '../../components/GermiculeEditor';
import { GermiculeMeta } from '../../types';

interface Props {
  src?: object;
}

interface State {
  src: object;
}

const DEFAULT_SRC = {
  version: '0.2',
  clusters: [{ name: 'cluster' }],
  germicules: [{ name: '❓', clusters: ['cluster'] }],
} as GermiculeMeta;

export class GermiculeEnvironment extends React.Component<Props, State> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const { t, i18n } = useTranslation();
  // {t('')}
  constructor(props: Props) {
    super(props);
    this.state = { src: DEFAULT_SRC, ...props };
    this.onUpdateSrc = this.onUpdateSrc.bind(this);
  }

  onUpdateSrc(params: { src: object }) {
    // console.log('onUpdateSrc', params);
    this.setState({ src: params.src });
  }

  render() {
    return (
      <Wrapper>
        <GermiculeEditor
          src={this.state.src}
          style={{ flex: '0 0 33%', overflow: 'scroll' }}
          onUpdateSrc={this.onUpdateSrc}
        />
        <GermiculeGraph
          data={this.state.src as GermiculeMeta}
          style={{ flex: '1' }}
        />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
`;
