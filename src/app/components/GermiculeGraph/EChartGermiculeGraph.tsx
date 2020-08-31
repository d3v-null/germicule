import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { GermiculeMeta } from '../../../types/Germicule';
import { GraphInfo } from '../../../types/EChartGraph';
import {
  GermiculeEChartTranslator as GermiculeTranslator,
  DEFAULT_THEME as THEME,
} from 'app/GermiculeTranslator';

interface Props {
  data: GermiculeMeta;
}

interface State {
  graphInfo: GraphInfo;
}

export class EChartGermiculeGraph extends React.Component<Props, State> {
  translator: GermiculeTranslator;
  graph: React.RefObject<ReactEcharts>;

  constructor(props: Props) {
    super(props);
    this.translator = new GermiculeTranslator();
    this.state = {
      graphInfo: this.translator.toGraphInfo(this.props.data),
    };
    this.graph = React.createRef<ReactEcharts>();
    this.getOptions = this.getOptions.bind(this);
  }

  getOptions() {
    const categories = Array.from(this.state.graphInfo.groups!.values());
    // console.log(categories);
    const result = {
      legend: {},
      tooltip: {
        show: true,
        formatter: params => params.data._tooltip,
        position: 'bottom',
      },
      backgroundColor: THEME.background,
      toolbox: { show: true },
      series: [
        {
          type: 'graph',
          layout: 'force',
          animation: true,
          categories,
          label: {
            show: true,
            position: 'inside',
            formatter: params => params.data._label,
            color: THEME.foreground,
          },
          edgeLabel: {
            show: true,
            position: 'middle',
            formatter: params => params.data._label,
          },
          nodeScaleRatio: 0,
          roam: true,
          draggable: true,
          nodes: Array.from(this.state.graphInfo.nodes.values()),
          force: {
            edgeLength: 150,
            repulsion: 500,
            gravity: 0.2,
          },
          edges: Array.from(this.state.graphInfo.edges.values()),
        },
      ],
    };
    // console.log('options', result);
    return result;
  }

  render() {
    return (
      <>
        <ReactEcharts
          option={this.getOptions()}
          ref={this.graph}
          notMerge={true}
          lazyUpdate={true}
          // theme={'theme_name'}
          // onChartReady={this.onChartReadyCallback}
          // onEvents={this.eventsDict}
          style={{ width: '100%', height: '100vh' }}
        />
      </>
    );
  }
}
