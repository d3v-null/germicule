/**
 *
 * GermiculeEnvironment
 *
 * Displays an interactive editor and graph side-by-side
 *
 */
import React from 'react';
import { GermiculeEditor } from '../GermiculeEditor';
import { GermiculeMeta, GermiculeGroup } from '../../../types/Germicule';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

import { EChartGermiculeGraph } from '../GermiculeGraph/EChartGermiculeGraph';
import { D3GermiculeGraph } from '../GermiculeGraph/D3GermiculeGraph';
import { BoxSize } from 'types';
import * as _ from 'lodash';

interface Props {
  src?: object;
  graphBackend?: string;
}

interface State {
  src: object;
  splitterVertical: boolean;
  splitterPrimaryMin: number;
  splitterSecondaryMin: number;
  splitterSize: number;
  graphBackend?: string;
  graphSize: BoxSize;
}

const SIZING = {
  graphMinWidth: 300,
  graphMinHeight: 300,
  editorMinWidth: 300,
  editorMinHeight: 300,
};

export const DEFAULT_SRC = {
  version: '0.2',
  groups: [{ name: 'group', members: [] } as GermiculeGroup],
  connections: [{ name: '❓', group: 'group' }],
} as GermiculeMeta;

export function DEFAULT_ON_UPDATE_SRC(params: { src: object }): void {}

const DEFAULT_STATE = {
  src: DEFAULT_SRC,
  splitterVertical: false,
  splitterSize: 4,
  splitterPrimaryMin: SIZING.graphMinWidth,
  splitterSecondaryMin: SIZING.editorMinWidth,
  // graphBackend: 'D3',
  graphBackend: 'eCharts',
  graphSize: {
    width: 800,
    height: 400,
  },
};

export class GermiculeEnvironment extends React.Component<Props, State> {
  splitterLayout: React.RefObject<SplitterLayout>;
  graph: React.RefObject<any>;

  constructor(props: Props) {
    super(props);
    this.state = { ...DEFAULT_STATE, ...props };
    this.onUpdateSrc = this.onUpdateSrc.bind(this);
    this.splitterLayout = React.createRef<SplitterLayout>();
    this.graph = React.createRef();
    this.onUpdateDimensions = this.onUpdateDimensions.bind(this);
    this.getComponents = this.getComponents.bind(this);
  }

  onUpdateSrc(params: { src: object }) {
    this.setState({ src: params.src });
  }

  onUpdateDimensions() {
    if (this.splitterLayout !== undefined) {
      const splitterLayout = this.splitterLayout.current;
      const splitterLayoutDimensions = splitterLayout.container.getBoundingClientRect();
      const splitterDividerDimensions = splitterLayout.splitter.getBoundingClientRect();
      const splitterChildren = splitterLayout.container.children;
      // console.log('splitterLayout', splitterLayout);

      const layoutWidth = splitterLayoutDimensions.width;
      const layoutHeight = splitterLayoutDimensions.height;

      const splitterSize = this.state.splitterVertical
        ? splitterDividerDimensions.height
        : splitterDividerDimensions.width;

      const newState: Partial<State> = {
        splitterSize,
      };

      let graphContainer;

      if (
        layoutWidth >
        SIZING.graphMinWidth + SIZING.editorMinWidth + splitterSize
      ) {
        // Horizontal layout
        newState.splitterVertical = false;
        newState.splitterPrimaryMin = SIZING.graphMinWidth;
        newState.splitterSecondaryMin = SIZING.editorMinWidth;
        if (splitterChildren) graphContainer = splitterChildren[2];
      } else if (
        layoutHeight >
        SIZING.graphMinHeight + SIZING.editorMinHeight + splitterSize
      ) {
        // Vertical layout
        newState.splitterVertical = true;
        newState.splitterPrimaryMin = SIZING.graphMinHeight;
        newState.splitterSecondaryMin = SIZING.editorMinHeight;
        if (splitterChildren) graphContainer = splitterChildren[0];
      }

      // console.log('graphContainer', graphContainer);

      if (graphContainer) {
        const graphDimensions = graphContainer.getBoundingClientRect();
        newState.graphSize = {
          width: graphDimensions.width,
          height: graphDimensions.height,
        };
        // console.log('graphSize', newState.graphSize);
      }
      if (!_.isEmpty(newState)) {
        // console.log('newSate', newState);
        this.setState(newState as State);
      }
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
      this.state.graphBackend === 'eCharts' ? (
        <EChartGermiculeGraph
          ref={this.graph}
          data={this.state.src as GermiculeMeta}
        />
      ) : (
        <D3GermiculeGraph
          ref={this.graph}
          data={this.state.src as GermiculeMeta}
          size={this.state.graphSize}
        />
      ),
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
        onPrimaryPaneSizeChange={this.onUpdateDimensions}
        onSecondaryPaneSizeChange={this.onUpdateDimensions}
      >
        {this.getComponents().map((v, i) => (
          <div key={i}>{v}</div>
        ))}
      </SplitterLayout>
    );
  }
}
