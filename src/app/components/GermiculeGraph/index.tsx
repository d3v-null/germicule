/**
 *
 * GermiculeGraph
 *
 */
import React from 'react';
// import { useTranslation } from 'react-i18next';
import ReactEcharts from 'echarts-for-react';
import { GermiculeMeta } from '../../types';
import { GermiculeTranslator } from 'app/GermiculeTranslator';

export type Props = {
  data: GermiculeMeta;
  style?: object;
};

export const COLORS = {
  background: '#fdf6e3',
  risks: new Map<number, string>([
    [0, '#859900'] /* green */,
    [1, '#2aa198'] /* cyan */,
    [2, '#268bd2'] /* blue */,
    [3, '#6c71c4'] /* violet */,
    [4, '#d33682'] /* magenta */,
    [5, '#dc322f'] /* red */,
  ]),
}; /* base3 */

export class GermiculeGraph extends React.Component<Props> {
  translator: GermiculeTranslator;

  constructor(props: Props) {
    super(props);
    this.translator = new GermiculeTranslator(COLORS);
  }

  getOption() {
    const graphInfo = this.translator.toGraphInfo(this.props.data);
    const categories = Array.from(graphInfo.clusters!.values());
    // console.log(categories);
    return {
      legend: {},
      tooltip: {
        show: true,
        formatter: params => params.data._tooltip,
        position: 'bottom',
      },
      backgroundColor: COLORS.background,
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
          },
          edgeLabel: {
            show: true,
            position: 'middle',
            formatter: params => params.data._label,
          },
          nodeScaleRatio: 0,
          roam: true,
          draggable: true,
          nodes: graphInfo.nodes,
          force: {
            edgeLength: 150,
            repulsion: 500,
            gravity: 0.2,
          },
          edges: graphInfo.edges,
        },
      ],
    };
  }

  onChartReadyCallback() {
    // console.log('onChartReadyCallback');
  }

  onChartLegendselectchanged(...args) {
    console.log('onChartLegendselectchanged', args);
  }

  eventsDict = {
    legendselectchanged: this.onChartLegendselectchanged,
  };

  render() {
    return (
      <div id="germicule-graph" style={this.props.style}>
        <ReactEcharts
          option={this.getOption()}
          notMerge={true}
          lazyUpdate={true}
          theme={'theme_name'}
          onChartReady={this.onChartReadyCallback}
          // onEvents={this.eventsDict}
          style={{ height: '100vh', width: '100%' }}
        />
      </div>
    );
  }
}
