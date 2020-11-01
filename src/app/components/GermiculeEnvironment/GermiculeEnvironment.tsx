/**
 *
 * GermiculeEnvironment
 *
 * Displays an interactive editor and graph side-by-side
 *
 */
import React, { Component } from 'react';
import { GermiculeEditor } from '../GermiculeEditor';
import { GermiculeMeta, GermiculeGroup } from '../../../types/Germicule';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

import { EChartGermiculeGraph } from '../GermiculeGraph/EChartGermiculeGraph';
import { D3GermiculeGraph } from '../GermiculeGraph/D3GermiculeGraph';
import { GermiculeSettings, Settings } from '../GermiculeSettings';
import { BoxSize } from 'types';
import * as _ from 'lodash';

interface Props {
  src?: GermiculeMeta;
  graphBackend?: string;
}

interface State {
  src: GermiculeMeta;
  splitterVertical: boolean;
  splitterPrimaryMin: number;
  splitterSecondaryMin: number;
  splitterSize: number;
  graphBackend: string;
  graphSize: BoxSize;
}

const SIZING = {
  graphMinWidth: 300,
  graphMinHeight: 300,
  editorMinWidth: 300,
  editorMinHeight: 300,
};

export function getDefaultSrc(): GermiculeMeta {
  return {
    version: '0.2',
    groups: [{ name: 'group', members: [] } as GermiculeGroup],
    connections: [{ name: '❓', group: 'group' }],
    toggledElements: ['title', 'icon'],
  } as GermiculeMeta;
}

export function DEFAULT_ON_UPDATE_SRC(params: { src: object }): void {}

export function getDefaultState() {
  return {
    src: { ...getDefaultSrc() },
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
}

export class GermiculeEnvironment extends Component<Props, State> {
  splitterLayout: React.RefObject<SplitterLayout>;
  graph: React.RefObject<any>;

  constructor(props: Props) {
    super(props);
    this.state = { ...getDefaultState(), ...props };
    this.onUpdateSrc = this.onUpdateSrc.bind(this);
    this.onUpdateSettings = this.onUpdateSettings.bind(this);
    this.splitterLayout = React.createRef<SplitterLayout>();
    this.graph = React.createRef();
    this.onUpdateDimensions = this.onUpdateDimensions.bind(this);
    this.getComponents = this.getComponents.bind(this);
  }

  onUpdateSrc({ src }) {
    this.setState({ src });
  }

  onUpdateSettings(settings: Partial<Settings>) {
    // console.log('GermiculeEnvironment.onUpdateSettings settings: ', settings);
    const newState = {};
    const newSettings = _.pickBy(settings, (_, key) => {
      return ['graphBackend'].includes(key);
    });
    if (newSettings) {
      Object.assign(newState, newSettings);
    }
    const newSrc = _.pickBy(settings, (_, key) => {
      return ['toggledElements'].includes(key);
    });
    if (newSrc) {
      newState['src'] = { ...this.state.src, ...newSrc };
    }
    if (newState) {
      console.log('GermiculeEnvironment.onUpdateSettings newSate:', newState);
      this.setState(newState);
    }
  }

  onUpdateDimensions() {
    if (this.splitterLayout !== undefined) {
      const splitterLayout = this.splitterLayout.current;
      const splitterLayoutDimensions = splitterLayout.container.getBoundingClientRect();
      const splitterDividerDimensions = splitterLayout.splitter.getBoundingClientRect();
      const splitterChildren = splitterLayout.container.children;

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

      if (graphContainer) {
        const graphDimensions = graphContainer.getBoundingClientRect();
        newState.graphSize = {
          width: graphDimensions.width,
          height: graphDimensions.height,
        };

        if (Object.keys(graphContainer).includes('onSizeChange')) {
          graphContainer.onSizeChange();
        }
      }
      if (!_.isEmpty(newState)) {
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

  getGraph() {
    switch (this.state.graphBackend) {
      case 'eCharts':
        return (
          <EChartGermiculeGraph
            ref={this.graph}
            data={this.state.src as GermiculeMeta}
          />
        );
      case 'D3':
      default:
        return (
          <D3GermiculeGraph
            ref={this.graph}
            data={this.state.src as GermiculeMeta}
            size={this.state.graphSize}
          />
        );
    }
  }

  getComponents() {
    const toggledElements = this.state.src.toggledElements
      ? this.state.src.toggledElements
      : [];
    const components = [
      <GermiculeEditor src={this.state.src} onUpdateSrc={this.onUpdateSrc} />,
      <>
        <GermiculeSettings
          onUpdateSettings={this.onUpdateSettings}
          settings={
            {
              graphBackend: this.state.graphBackend,
              toggledElements,
            } as Settings
          }
        />
        {this.getGraph()}
      </>,
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
        secondaryInitialSize={0}
      >
        {this.getComponents().map((v, i) => (
          <div key={i}>{v}</div>
        ))}
      </SplitterLayout>
    );
  }
}
