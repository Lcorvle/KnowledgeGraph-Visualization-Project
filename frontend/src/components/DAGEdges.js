import React, { Component } from 'react'
import * as d3 from 'd3'
import Point from '../scripts/Point'
import DAGEdge from './DAGEdge'

function DagEdge(_edge) {
  this.points = _edge.points;
  this.fromPoint = _edge.v;
  this.toPoint = _edge.w;
  this.edgeLabel = _edge.label;
  this.labelPosition = new Point(_edge.x, _edge.y);
  this.toNodeRadius = _edge.toNodeRadius;
}

export {DagEdge}

export default class DAGEdges extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <g id={'edges'} transform="translate(0,50)">
        {this.props.edges.map((edge, index) =>
            <DAGEdge key={"dag_edge_" + index}
                     edge={edge}
                     index={index}
                     curveFunction={this.props.curveFunction}
            />)
        }
      </g>
    )
  }
}