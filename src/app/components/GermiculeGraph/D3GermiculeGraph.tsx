import React from 'react';
import { GermiculeMeta } from '../../../types/Germicule';
import { GraphInfo, GraphEdge, GraphNode } from '../../../types/D3Graph';
// import { Graph } from 'react-d3-graph';
import * as d3 from 'd3';
import { GermiculeD3Translator as GermiculeTranslator } from 'app/GermiculeTranslator';
import { BoxSize } from 'types';
// import * as _ from 'lodash';

interface Props {
  data: GermiculeMeta;
  size: BoxSize;
}

interface State {
  data: GermiculeMeta;
  graphInfo: GraphInfo;
  size: BoxSize;
}

export class D3GermiculeGraph extends React.Component<Props, State> {
  translator: GermiculeTranslator;
  mountPoint: Element | null;
  svg: any;
  // simulation?: d3.Simulation<GraphNode, GraphEdge>;

  constructor(props: Props) {
    super(props);
    this.translator = new GermiculeTranslator();
    this.state = {
      ...props,
      graphInfo: this.translator.toGraphInfo(this.props.data),
    };
    this.mountPoint = null;
    this.getData = this.getData.bind(this);
    this.getConfig = this.getConfig.bind(this);
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
    console.log('getConfig', result);
    return result;
  }

  componentDidMount() {
    const {
      size: { width, height },
      graphInfo: { nodes, edges },
    } = this.state;
    const links = Array.from(edges.values());

    this.svg = d3.select(this.mountPoint).append('svg');

    const link = this.svg
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .style('stroke', '#999999')
      .style('stroke-opacity', 0.6)
      .attr('stroke-width', (d: GraphEdge) => Math.sqrt(d.value!));
    // .style('stroke-width', (d: any) => Math.sqrt(d.value));

    const simulation = d3
      .forceSimulation<GraphNode, GraphEdge>(nodes)
      .force('charge', d3.forceManyBody().strength(-300).distanceMax(200))
      .force('link', d3.forceLink<GraphNode, GraphEdge>(links).strength(0.1))
      .force('center', d3.forceCenter(width / 2, height / 2));

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      circle.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
      text.attr('x', (d: any) => d.x).attr('y', (d: any) => d.y);
    });

    const dragStarted = (d: GraphNode) => {
      if (!d3.event.active) simulation.alphaTarget(0.7).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (d: GraphNode) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    const dragEnded = (d: GraphNode) => {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    const node = this.svg
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(
        d3
          .drag()
          .on('start', dragStarted)
          .on('drag', dragged)
          .on('end', dragEnded),
      );

    const circle = node
      .append('circle')
      .attr('r', 30)
      .style('stroke', '#FFFFFF')
      .style('stroke-width', 1.5);

    const text = node
      .append('text')
      .text(node => node.id)
      .attr('font-size', 15)
      .attr('dx', -5)
      .attr('dy', 5);

    // .style('fill', (d: any) => color(d.group))
    // .call(
    //   d3
    //     .drag()
    // );
  }

  componentDidUpdate() {
    const {
      size: { width, height },
      // graphInfo: { nodes, edges },
    } = this.props;
    this.svg.attr('width', width).attr('height', height);
  }

  render() {
    const {
      size: { width, height },
    } = this.props;
    const sytle = {
      width,
      height,
    };
    return (
      <>
        <div
          id="germicule-graph-d3"
          ref={mountPoint => (this.mountPoint = mountPoint)}
          style={sytle}
        />
      </>
    );
  }
}
