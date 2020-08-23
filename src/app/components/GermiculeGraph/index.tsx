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
  GermiculeItem,
  GermiculeMeta,
  // GraphNode,
  // GraphEdge,
  // GraphCategory,
  GraphInfo,
  GraphNode,
  GraphCategory,
} from '../../types';

export type Props = {
  data: GermiculeMeta;
};

let UNKNOWN_COUNT: number = 0;
function getNextUnknown() {
  return UNKNOWN_COUNT++;
}

const DEFAULT_NODE: GraphNode = {
  name: '❓',
  _label: '❓',
  symbolSize: 30,
};

function toNode(item: GermiculeItem): GraphNode {
  if (item === null) {
    return {
      ...DEFAULT_NODE,
      name: `unknown ${getNextUnknown()}`,
    };
  }
  const result: GraphNode = {
    ...DEFAULT_NODE,
    name: item.name,
    _label: item.name,
  };
  if (item.risk) {
    result.value = item.risk;
  }
  return result;
}

// TODO(dev): Rename to buildGraph
// TODO(dev): Implement links
export function deconstructGermicule(
  germicules: Array<GermiculeItem>,
): GraphInfo {
  const result: GraphInfo = {
    nodes: [],
  };
  germicules.forEach((item: GermiculeItem) => {
    const node = toNode(item);
    result.nodes.push(node);
  });
  return result;
}

export class GermiculeGraph extends React.Component<Props> {
  // const { t, i18n } = useTranslation();
  // {t('')}

  getOption() {
    const graphInfo: GraphInfo = deconstructGermicule(
      this.props.data.germicules,
    );
    console.log(`graphInfo ${JSON.stringify(graphInfo)}`);
    const categoryNames =
      'categories' in graphInfo
        ? graphInfo.categories!.map((category: GraphCategory) => category.name)
        : [];
    return {
      legend: {
        data: categoryNames,
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          animation: false,
          label: {
            show: true,
            position: 'inside',
            formatter: params => params.data._label,
          },
          links: {
            label: {
              formatter: params => params.data._label,
            },
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
