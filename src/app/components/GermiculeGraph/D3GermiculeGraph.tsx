import React from 'react';
import { GermiculeMeta } from '../../../types/Germicule';
import {
  GraphInfo,
  // GraphEdge,
  // GraphNode
} from '../../../types/D3Graph';
import { Graph } from 'react-d3-graph';
import { GermiculeD3Translator as GermiculeTranslator } from 'app/GermiculeTranslator';
import { BoxSize } from 'types';
import * as _ from 'lodash';

interface Props {
  data: GermiculeMeta;
  size: BoxSize;
}

interface State {
  data: GermiculeMeta;
  graphInfo: GraphInfo;
  size: BoxSize;
}

// export class D3GermiculeGraph extends React.Component<Props, State> {
//   translator: GermiculeTranslator;
//   mountPoint: Element | null;
//   // simulation?: d3.Simulation<GraphNode, GraphEdge>;

//   constructor(props: Props) {
//     super(props);
//     this.translator = new GermiculeTranslator();
//     this.state = {
//       ...props,
//       graphInfo: this.translator.toGraphInfo(this.props.data),
//     };
//     this.mountPoint = null;
//     this.getData = this.getData.bind(this);
//     this.getConfig = this.getConfig.bind(this);
//   }

//   getData() {
//     return {
//       nodes: this.state.graphInfo.nodes,
//       links: this.state.graphInfo.edges,
//     };
//   }

//   getConfig() {
//     const result = {
//       nodeHighlightBehavior: true,
//       node: {
//         color: 'lightgreen',
//         size: 120,
//         highlightStrokeColor: 'blue',
//       },
//       link: {
//         highlightColor: 'lightblue',
//       },
//       height: this.state.size ? this.state.size.height : undefined,
//       width: this.state.size ? this.state.size.width : undefined,
//     };
//     if (this.state.size) {
//       result.height = this.state.size.height;
//       result.width = this.state.size.width;
//     }
//     console.log('getConfig', result);
//     return result;
//   }

//   componentDidMount() {
//     const {
//       size: { width, height },
//       graphInfo,
//     } = this.state;

//     console.log('graphInfo', graphInfo);

//     const svg = d3
//       .select(this.mountPoint)
//       .append('svg')
//       .attr('width', width)
//       .attr('height', height);

//     const link = svg
//       .selectAll('line')
//       .data(graphInfo.edges)
//       .enter()
//       .append('line')
//       .attr('stroke-width', (d: GraphEdge) => Math.sqrt(d.value!));
//     // .style('stroke', '#999999')
//     // .style('stroke-opacity', 0.6)
//     // .style('stroke-width', (d: any) => Math.sqrt(d.value));

//     const forceLink = d3.forceLink<GraphNode, GraphEdge>(graphInfo.edges);
//     console.log('forceLink', forceLink);

//     const simulation = d3
//       .forceSimulation<GraphNode, GraphEdge>(graphInfo.nodes)
//       .force('charge', d3.forceManyBody())
//       .force('link', forceLink)
//       .force('center', d3.forceCenter());

//     simulation.on('tick', () => {
//       link
//         .attr('x1', (d: any) => d.source.x)
//         .attr('y1', (d: any) => d.source.y)
//         .attr('x2', (d: any) => d.target.x)
//         .attr('y2', (d: any) => d.target.y);

//       node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
//     });

//     const dragStarted = (event: any, d: any) => {
//       event.active && simulation.alphaTarget(0.3).restart();
//       d.fx = d.x;
//       d.fy = d.y;
//     };

//     const dragged = (event: any, d: any) => {
//       d.fx = event.x;
//       d.fy = event.y;
//     };

//     const dragEnded = (event: any, d: any) => {
//       event.active && simulation.alphaTarget(0);
//       d.fx = null;
//       d.fy = null;
//     };

//     const node = svg
//       .selectAll('circle')
//       .data(graphInfo.nodes)
//       .enter()
//       .append<SVGCircleElement>('circle')
//       .attr('r', 5)
//       .style('stroke', '#FFFFFF')
//       .style('stroke-width', 1.5)
//       .call(
//         d3.behavior.drag<SVGCircleElement, GraphNode>()
//           .on('start', dragStarted)
//           .on('drag', dragged)
//           .on('end', dragEnded),
//       );

//     // .style('fill', (d: any) => color(d.group))
//     // .call(
//     //   d3
//     //     .drag()
//     // );
//   }

//   render() {
//     const {
//       size: { width, height },
//     } = this.state;
//     const sytle = {
//       width,
//       height,
//     };
//     return (
//       <>
//         <div
//           id="germicule-graph-d3"
//           ref={mountPoint => (this.mountPoint = mountPoint)}
//           style={sytle}
//         />
//       </>
//     );
//   }
// }

export class D3GermiculeGraph extends React.Component<Props, State> {
  translator: GermiculeTranslator;
  graph: React.RefObject<Graph>;

  constructor(props: Props) {
    super(props);
    this.translator = new GermiculeTranslator();
    this.state = {
      ...props,
      graphInfo: this.translator.toGraphInfo(this.props.data),
    };
    this.graph = React.createRef<Graph>();
    this.getData = this.getData.bind(this);
    this.getConfig = this.getConfig.bind(this);
    this.onClickGraph = this.onClickGraph.bind(this);
    this.onClickNode = this.onClickNode.bind(this);
  }

  getData() {
    return {
      nodes: this.state.graphInfo.nodes,
      links: this.state.graphInfo.edges,
    };
  }

  getConfig() {
    const result = {
      nodeHighlightBehavior: true,
      node: {
        color: 'lightgreen',
        size: 120,
        highlightStrokeColor: 'blue',
      },
      link: {
        highlightColor: 'lightblue',
      },
      height: this.state.size ? this.state.size.height : undefined,
      width: this.state.size ? this.state.size.width : undefined,
    };
    if (this.state.size) {
      result.height = this.state.size.height;
      result.width = this.state.size.width;
    }
    // console.log('getConfig', result);
    return result;
  }

  onClickGraph() {
    if (this.graph && 'current' in this.graph) {
      this.graph.current.restartSimulation();
      // console.log('onClickGraph', this.graph.current);
    }
  }

  onClickNode() {
    if (this.graph && 'current' in this.graph) {
      this.graph.current.restartSimulation();
      // console.log('onClickNode', this.graph.current);
    }
  }

  componentDidMount() {
    if (this.graph && 'current' in this.graph) {
      this.graph.current.restartSimulation();
      // console.log('componentDidMount', this.graph.current);
    }
  }

  static getDerivedStateFromProps(
    props: Partial<Props>,
    state: State,
  ): Partial<State> | null {
    // console.log('getDerivedStateFromProps', props, state);
    let result: Partial<State> = {};
    if (props.size !== state.size) {
      result = { ...result, size: props.size };
    }
    if (props.data !== state.data) {
      result = {
        ...result,
        data: props.data,
        // graphInfo: this.translator.toGraphInfo(this.props.data),
      };
    }
    return _.isEmpty(result) ? null : result;
  }

  render() {
    return (
      <>
        <Graph
          id="germicule-graph-d3"
          ref={this.graph}
          data={this.getData()}
          config={this.getConfig()}
          onClickGraph={this.onClickGraph}
          onClickNode={this.onClickNode}
        />
      </>
    );
  }
}
