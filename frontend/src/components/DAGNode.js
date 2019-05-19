import React, { Component } from 'react'
import * as d3 from 'd3'

const nodeRectFillColor = d3.rgb(216, 228, 238),
  nodeRectStrokeColor = d3.rgb(44, 103, 69, 1),
  nodeRectTextColor = d3.rgb(43, 101, 67),
  nodeFontSize = 17,
  circleStrokeWidth = 1.5;

export default class DAGNode extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  addMouseEventToNode() {
    let { node, index } = this.props;
    let that = this;

    let dagNode = d3.select('#dag_node_' + index);

    dagNode.on('mouseover', function () {
        d3.select(this)
          .select('circle')
          .attr('stroke-width', circleStrokeWidth * 2 + 'px');
        d3.select(this)
          .select('text')
          .style('font-style', 'italic')
      })
      .on('mouseout', function () {
        d3.select(this)
          .select('circle')
          .attr('stroke-width', circleStrokeWidth + 'px');
        d3.select(this)
          .select('text')
          .style('font-style', 'normal')
      })
      .style('cursor', 'pointer');

    dagNode.on('click', function () {
      that.props.onNodeClick(node);
    })
  }

  componentDidMount() {
    setTimeout(() => {
      this.addMouseEventToNode()
    }, 0)
  }

  drawNode(node, index, color) {
    return(
      <g transform={"translate(" + (node.labelPosition.x) + "," + (node.labelPosition.y) + ")"}>
        <circle id={"node_" + index}
                fill={color}
                stroke={d3.rgb(color).darker(2)}
                // opacity="0.8"
                strokeWidth={circleStrokeWidth + 'px'}
                r={node.width / 2}
        />
        <text transform={"translate(" + (- 0.5 * node.width) + "," + (- 0.5 * node.height) + ")"}
              fontSize={node.fontSize - 1}
              textAnchor="middle"
              fill={nodeRectTextColor}
              dy="0.4em"
              x={node.width / 2}
              y={node.height / 2}>
          {node.label}
        </text>
      </g>
    )
  }

  render() {
    let { node, index, color } = this.props;
    return (
      <g className={'node'} id={'dag_node_' + index}>
        {this.drawNode(node, index, color)}
      </g>
    )
  }
}