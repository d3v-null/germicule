/**
 *
 * GermiculeEnvironment
 *
 * Displays an interactive editor and graph side-by-side
 *
 */
import React from 'react';
import { GermiculeGraph } from '../../components/GermiculeGraph';
import { GermiculeEditor } from '../../components/GermiculeEditor';
import { GermiculeMeta } from '../../types';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

interface Props {
  src?: object;
}

type BoxDimensions = { width: number; height: number };

interface State {
  src: object;
  dimensions?: BoxDimensions;
  splitterVertical: boolean;
  splitterPrimaryMin: number;
  splitterSecondaryMin: number;
  splitterSize: number;
}

const DEFAULT_SRC = {
  version: '0.2',
  clusters: [{ name: 'cluster' }],
  germicules: [{ name: '❓', clusters: ['cluster'] }],
} as GermiculeMeta;

const SIZING = {
  graphMinWidth: 300,
  graphMinHeight: 300,
  editorMinWidth: 300,
  editorMinHeight: 300,
};

const DEFAULT_STATE = {
  src: DEFAULT_SRC,
  splitterVertical: false,
  splitterSize: 4,
  splitterPrimaryMin: SIZING.graphMinWidth,
  splitterSecondaryMin: SIZING.editorMinWidth,
};

export class GermiculeEnvironment extends React.Component<Props, State> {
  splitterLayout: React.RefObject<SplitterLayout>;

  constructor(props: Props) {
    super(props);
    this.state = { ...DEFAULT_STATE, ...props };
    this.onUpdateSrc = this.onUpdateSrc.bind(this);
    this.splitterLayout = React.createRef();
    this.onUpdateDimensions = this.onUpdateDimensions.bind(this);
    this.getComponents = this.getComponents.bind(this);
  }

  onUpdateSrc(params: { src: object }) {
    this.setState({ src: params.src });
  }

  onUpdateDimensions() {
    console.log('onUpdateDimensions', this.splitterLayout);
    if (this.splitterLayout !== undefined) {
      const splitterLayout = this.splitterLayout.current;
      const splitterLayoutDimensions = splitterLayout.container.getBoundingClientRect();
      console.log('layout dimensions', splitterLayoutDimensions);
      const splitterDividerDimensions = splitterLayout.splitter.getBoundingClientRect();
      console.log('divider dimensions', splitterDividerDimensions);

      const layoutWidth = splitterLayoutDimensions.width;
      const layoutHeight = splitterLayoutDimensions.height;

      const splitterSize = this.state.splitterVertical
        ? splitterDividerDimensions.height
        : splitterDividerDimensions.width;

      const newState: Partial<State> = {
        splitterSize,
      };

      if (
        layoutWidth >
        SIZING.graphMinWidth + SIZING.editorMinWidth + splitterSize
      ) {
        newState.splitterVertical = false;
        newState.splitterPrimaryMin = SIZING.graphMinWidth;
        newState.splitterSecondaryMin = SIZING.editorMinWidth;
      } else if (
        layoutHeight >
        SIZING.graphMinHeight + SIZING.editorMinHeight + splitterSize
      ) {
        newState.splitterVertical = true;
        newState.splitterPrimaryMin = SIZING.graphMinHeight;
        newState.splitterSecondaryMin = SIZING.editorMinHeight;
      }

      console.log('newState', newState);
      this.setState(newState as State);
    }
  }

  componentDidMount() {
    this.onUpdateDimensions();
    window.addEventListener('resize', this.onUpdateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onUpdateDimensions);
  }

  getComponents() {
    const components = [
      <GermiculeEditor src={this.state.src} onUpdateSrc={this.onUpdateSrc} />,
      <GermiculeGraph data={this.state.src as GermiculeMeta} />,
    ];
    return this.state.splitterVertical ? components.reverse() : components;
  }

  render() {
    return (
      <SplitterLayout
        ref={this.splitterLayout}
        primaryIndex={this.state.splitterVertical ? 0 : 1}
        vertical={this.state.splitterVertical}
        primaryMinSize={this.state.splitterPrimaryMin}
        secondaryMinSize={this.state.splitterSecondaryMin}
        onDragEnd={this.onUpdateDimensions}
      >
        {this.getComponents().map((v, i) => (
          <div key={i}>{v}</div>
        ))}
      </SplitterLayout>
    );
  }
}
