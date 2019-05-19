import React, { Component } from 'react'
import DAGNode from './DAGNode'
import Point from '../scripts/Point'
import * as d3 from "d3";

function DagNode(_node, _index) {
  this.index = _index;

  this.label = _node.label;
  this.width = _node.width;
  this.height = _node.height;
  this.labelPosition = new Point(_node.x, _node.y);
  this.content = _node.content;
  this.fontSize = _node.fontSize
}

export {DagNode}

export default class DAGNodes extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    let windowWidth = document.documentElement.clientWidth;
    let windowHeight = document.documentElement.clientHeight;
    let color = d3.scaleOrdinal(d3.schemeAccent);

    return(
      <g id={'nodes'} transform="translate(0,50)">
        {
          this.props.nodes.map((node, index) =>
            <DAGNode key={'dag_node_' + index}
                     index={index}
                     node={node}
                     onNodeClick={this.props.onNodeClick}
                     color = {node.label === 'COUNTRIES(246)' ? d3.rgb(226, 160, 155) : d3.rgb(194, 218, 238)}/>
          )
        }
      </g>
    )
  }
}