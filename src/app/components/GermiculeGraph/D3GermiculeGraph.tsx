import React from 'react';
import { GermiculeMeta } from '../../../types/Germicule';
import { GraphInfo, GraphEdge, GraphNode } from '../../../types/D3Graph';
// import { Graph } from 'react-d3-graph';
import * as d3 from 'd3';
import { GermiculeD3Translator as GermiculeTranslator } from 'app/GermiculeTranslator';
import { BoxSize } from 'types';
import * as _ from 'lodash';

interface Props {
  data: GermiculeMeta;
  size: BoxSize;
}

interface ZoomTransform {
  x: number;
  y: number;
  k: number;
}

const INITIAL_ZOOM_TRANSFORM: ZoomTransform = {
  x: 0,
  y: 0,
  k: 1,
};

interface State {
  graphInfo: GraphInfo;
  zoomTransform: ZoomTransform;
}

export class D3GermiculeGraph extends React.Component<Props, State> {
  translator: GermiculeTranslator;
  mountPoint: Element | null;
  svg;
  node;
  circle;
  link;
  text;
  imgs;
  simulation;
  zoom;
  isDragging;
  nodeSize = 30;
  showCircles = true;
  highlightInfra = true;
  // simulation?: d3.Simulation<GraphNode, GraphEdge>;

  constructor(props: Props) {
    super(props);
    this.translator = new GermiculeTranslator();
    this.state = {
      graphInfo: this.translator.toGraphInfo(this.props.data),
      zoomTransform: INITIAL_ZOOM_TRANSFORM,
    };
    this.mountPoint = null;
    this.getData = this.getData.bind(this);
    this.getConfig = this.getConfig.bind(this);
    this.onSizeChange = this.onSizeChange.bind(this);
    this.onToggledElementsChange = this.onToggledElementsChange.bind(this);
  }

  getData() {
    return {
      nodes: Array.from(this.state.graphInfo.nodes.values()),
      links: Array.from(this.state.graphInfo.edges.values()),
    };
  }

  getConfig() {
    const {
      size: { width, height },
    } = this.props;
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
      height,
      width,
    };
    // console.log('getConfig', result);
    return result;
  }

  updatePositions() {
    const { zoomTransform } = this.state;
    this.link
      .attr('x1', (d: any) => zoomTransform.x + zoomTransform.k * d.source.x)
      .attr('y1', (d: any) => zoomTransform.y + zoomTransform.k * d.source.y)
      .attr('x2', (d: any) => zoomTransform.x + zoomTransform.k * d.target.x)
      .attr('y2', (d: any) => zoomTransform.y + zoomTransform.k * d.target.y);

    if (this.showCircles) {
      this.circle
        .attr('cx', (d: any) => zoomTransform.x + zoomTransform.k * d.x)
        .attr('cy', (d: any) => zoomTransform.y + zoomTransform.k * d.y);
    }
    if (this.text) {
      this.text
        .attr('x', (d: any) => zoomTransform.x + zoomTransform.k * d.x)
        .attr('y', (d: any) => zoomTransform.y + zoomTransform.k * d.y);
    }
    if (this.imgs) {
      this.imgs.attr('transform', (d: any) => {
        const x = zoomTransform.x + zoomTransform.k * d.x - this.nodeSize;
        const y = zoomTransform.y + zoomTransform.k * d.y - this.nodeSize;
        return `translate(${x}, ${y})`;
      });
    }
  }

  componentDidMount() {
    const { nodes, links } = this.getData();

    this.svg = d3.select(this.mountPoint).append('svg');

    this.link = this.svg
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .style('stroke', '#999999')
      .style('stroke-opacity', 0.6)
      .attr(
        'stroke-width',
        (d: GraphEdge) =>
          5 * (typeof d.value !== 'undefined' ? Math.sqrt(d.value!) : 1),
      );
    // .style('stroke-width', (d: any) => Math.sqrt(d.value));

    this.simulation = d3
      .forceSimulation<GraphNode, GraphEdge>(nodes)
      .force('charge', d3.forceManyBody().strength(-300).distanceMax(1000))
      .force('link', d3.forceLink<GraphNode, GraphEdge>(links).strength(0.1));

    this.simulation.on('tick', () => {
      this.updatePositions();
    });

    const dragStarted = (d: GraphNode) => {
      this.isDragging = true;
      if (!d3.event.active) this.simulation.alphaTarget(0.7).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (d: GraphNode) => {
      this.isDragging = false;
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    const dragEnded = (d: GraphNode) => {
      this.isDragging = false;
      if (!d3.event.active) this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    this.node = this.svg
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

    if (this.showCircles) {
      this.circle = this.node
        .append('circle')
        .attr('r', this.nodeSize)
        .style('stroke', '#FFFFFFFF')
        .style('stroke-width', 1.5)
        .style('fill', '#FFFFFFFF');
    }

    /* This is the clip object for making icons circular */
    this.svg
      .append('clipPath')
      .attr('id', 'clipObj')
      .append('circle')
      .attr('cx', this.nodeSize)
      .attr('cy', this.nodeSize)
      .attr('r', this.nodeSize);

    const zoomed = (d: any) => {
      // if (this.isDragging) return;
      const newZoomTransform = d3.event.transform as ZoomTransform;
      if (!_.isEqual(newZoomTransform, this.state.zoomTransform)) {
        this.setState({ zoomTransform: newZoomTransform });
        this.updatePositions();
      }
      // this.state.zoomTransform = d3.event.transform as ZoomTransform;
      // console.log('zoomed transform', transform);
      // this.svg.attr('transform', `scale(${transform.k})`);
    };

    this.zoom = d3.zoom().scaleExtent([0.001, 1]).on('zoom', zoomed);
    this.svg.call(this.zoom);

    this.onSizeChange();
    this.onToggledElementsChange();
  }

  onSizeChange() {
    const {
      size: { width, height },
    } = this.props;
    this.svg.attr('width', width * 2).attr('height', height * 2);
    this.simulation.force('center', d3.forceCenter(width / 2, height / 2));
    this.zoom.extent([
      [0, 0],
      [width, height],
    ]);
    this.simulation.restart();
  }

  onToggledElementsChange() {
    const toggledElements = this.props.data.toggledElements
      ? this.props.data.toggledElements
      : [];

    if (!toggledElements.includes('title')) {
      this.text = this.node
        .append('text')
        .text(node => node.id)
        .attr('font-size', this.nodeSize / 2)
        .attr('dx', this.nodeSize + 5)
        .attr('dy', 5);
    } else if (this.text) {
      this.text.remove();
    }

    if (!toggledElements.includes('icon')) {
      this.imgs = this.node
        .append('svg:image')
        .attr('xlink:href', (d: GraphNode) =>
          d.icon ? d.icon : 'graphIcons/defaultUnknown.png',
        )
        .attr('width', (d: GraphNode) =>
          this.highlightInfra && d.entityType === 'infrastructure'
            ? '200'
            : this.nodeSize * 2,
        )
        .attr('height', (d: GraphNode) =>
          this.highlightInfra && d.entityType === 'infrastructure'
            ? '200'
            : this.nodeSize * 2,
        )
        .attr('clip-path', (d: GraphNode) => {
          return d.clipIcon ? 'url(#clipObj)' : '';
        });
    } else if (this.imgs) {
      this.imgs.remove();
    }

    this.updatePositions();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      size,
      data: { toggledElements },
    } = this.props;
    if (
      toggledElements &&
      !_.isEqual(toggledElements, prevProps.data.toggledElements)
    ) {
      this.onToggledElementsChange();
    }
    if (!_.isEqual(size, prevProps.size)) {
      this.onSizeChange();
    }
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
      <div
        id="germicule-graph-d3"
        ref={mountPoint => (this.mountPoint = mountPoint)}
        style={sytle}
      />
    );
  }
}
