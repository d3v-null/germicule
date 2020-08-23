/**
 *
 * GermiculeGraph
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
// import { useTranslation } from 'react-i18next';
import ReactEcharts from 'echarts-for-react';
// import webkitDep from '../../data/webkitDep.json.js';
import {
  Germicule,
  GermiculeMeta,
  // GraphNode,
  // GraphEdge,
  // GraphCategory,
  GraphInfo,
} from '../../types';

export type Props = {
  data: GermiculeMeta;
};

export function deconstructGermicule(germicule: Array<Germicule>): GraphInfo {
  return {
    nodes: [],
  };
}

export class GermiculeGraph extends React.Component<Props> {
  // const { t, i18n } = useTranslation();
  // {t('')}

  getOption() {
    const graphInfo: GraphInfo = deconstructGermicule(
      this.props.data.germicules,
    );
    return {
      legend: {
        data: ['HTMLElement', 'WebGL', 'SVG', 'CSS', 'Other'],
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          animation: false,
          label: {
            position: 'right',
            formatter: '{b}',
          },
          draggable: true,
          nodes: graphInfo.nodes,
          categories: graphInfo.categories,
          force: {
            edgeLength: 5,
            repulsion: 20,
            gravity: 0.2,
          },
          edges: graphInfo.edges,
        },
      ],
    };
  }
  // getOption() {
  //   return {
  //     legend: {
  //       data: ['HTMLElement', 'WebGL', 'SVG', 'CSS', 'Other'],
  //     },
  //     series: [
  //       {
  //         type: 'graph',
  //         layout: 'force',
  //         animation: false,
  //         label: {
  //           position: 'right',
  //           formatter: '{b}',
  //         },
  //         draggable: true,
  //         data: webkitDep.nodes.map(function (node, idx) {
  //           node.id = idx;
  //           return node;
  //         }),
  //         categories: webkitDep.categories,
  //         force: {
  //           edgeLength: 5,
  //           repulsion: 20,
  //           gravity: 0.2,
  //         },
  //         edges: webkitDep.links,
  //       },
  //     ],
  //   };
  // }

  onChartReadyCallback() {
    console.log('onChartReadyCallback');
  }

  render() {
    return (
      <Div id="germicule-graph">
        <ReactEcharts
          option={this.getOption()}
          notMerge={true}
          lazyUpdate={true}
          theme={'theme_name'}
          onChartReady={this.onChartReadyCallback}
          // onEvents={EventsDict}
        />
      </Div>
    );
  }
}

const Div = styled.div`
  width: 'auto';
  height: '50vh';
  margin: 'auto';
`;
