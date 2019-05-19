import React, { Component } from 'react'
import * as d3 from 'd3'

const edgeColor=d3.rgb(235, 235, 235);

export default class DAGEdge extends Component {
  edgeFontSize = 14;

  drawEdge(edge, index) {
    return (<path key={"show_edge_" + index}
                  d={this.props.curveFunction(edge.points)}
                  strokeWidth={edge.toNodeRadius * 2}
                  stroke={edgeColor}
                  opacity={0.75}
                  fill="none"
                  markerMid={this.props.marker ? "" : "url(#arrow)"}>
    </path>)
  }

  drawEdgeLabel(edge, index) {
    //let edgePointsLength = edge.points.length;

    return (<text key={"edge_text_" + index}
                  x={edge.labelPosition.x}
                  y={edge.labelPosition.y}
                  textAnchor="middle"
                  dy="-0.5em"
                  style={{fontSize: this.edgeFontSize + "px"}}>
      {edge.edgeLabel}
    </text>)
  }

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    let { edge, index } = this.props;
    return (
      <g className="edge" id={"dag_edge_" + index}>
        {this.drawEdge(edge, index)}
        {this.drawEdgeLabel(edge, index)}
      </g>
    )
  }
}