import './Graph.css'
import React, {Component} from 'react'
import * as dagre from 'dagre'
import * as d3 from 'd3'
import {DagNode} from './DAGNodes'
import {DagEdge} from './DAGEdges'
import DAGEdges from './DAGEdges'
import DAGNodes from './DAGNodes'
import { BuildQuadraticCurve, BuildCubicBezierCurve, BuildBezierCurve} from '../scripts/BuildCurve';
import NodeDetail from './NodeDetail'
import axios from 'axios'
import measureTextWidth from 'text-width'
import measureTextHeight from 'text-height'


const DAGFadeOutTime = 1000;

export default class Graph extends Component {
  nodeFontSize = 17;
  edgeFontSize = 14;
  clickedDAGNode = null;

  constructor(props) {
    super(props);

    this.state = {
      rawNodeList:[],
      rawEdgeList:[],
      dagNodeList:[],
      dagEdgeList:[],
      graphWidth: 0,
      graphHeight: 0,
      showStatus: 'DAG'
    };

    this.onNodeClick = this.onNodeClick.bind(this);
  }

  async readGraphData() {
    let graphData = (await axios.get('api/GetGraphStructure')).data;
    //console.log(' Graph Data');
    //console.log(graphData);
    //console.log(JSON.stringify(graphData));

    this.state.rawNodeList = graphData.Labels;
    this.state.rawEdgeList = graphData.Relationships;
    // let xhr = new XMLHttpRequest();
    // xhr.open('POST', '/api/GetGraphStructure', true);
    //
    // xhr.onload = function (e) {
    //   if (xhr.status === 200) {
    //     //console.log(xhr.response);
    //     console.log(JSON.parse(xhr.response))
    //   }
    //   else {
    //     alert('XML error occurred!')
    //   }
    // };
    //
    // xhr.send();
    this.processGraphData();
  }

  processGraphData() {
    let { rawNodeList, rawEdgeList } = this.state;

    let nodeSizes = [];
    Object.keys(rawNodeList).map(node => {
      nodeSizes.push(rawNodeList[node].length);
    });

    let nodeWidthScale = d3.scaleLinear()
      .domain(d3.extent(nodeSizes))
      .range([90, 150]);

    //set graph
    // Create a new directed graph
    let g = new dagre.graphlib.Graph();

    // Set an object for the graph label
    g.setGraph({});
    g.graph().rankdir = 'LR';
    g.graph().ranksep = 150;
    g.graph().nodesep = 150;
    g.graph().edgesep = 100;
    g.setDefaultEdgeLabel(() => {});

    d3.select("#measureText")
      .style("font-size", this.nodeFontSize + "px");

    // console.log(Object.keys(rawNodeList));
    Object.keys(rawNodeList).map(node => {
      let fontSize = nodeWidthScale(rawNodeList[node].length) / (node.length);
      let label = node + '(' + rawNodeList[node].length + ')';
      // let width = measureText.offsetWidth - oldWidth,
      //   height = measureText.offsetHeight - oldHeight;
      let width = measureTextWidth(label, {
        family: 'normal',
        size: fontSize
      });
      let height = measureTextHeight(label, {
        family: 'normal',
        size: fontSize
      }).height;

      g.setNode(node,
        {
          label: label,
          width: width,
          height: height,
          content: rawNodeList[node],
          fontSize: fontSize
        }
      )
    });

    d3.select("#measureText")
      .style("font-size", this.edgeFontSize + "px");
    Object.keys(rawEdgeList).map(edge => {
      let width = measureTextWidth(edge, {
        family: 'normal',
        size: this.edgeFontSize
      });
      let height = measureTextHeight(edge, {
        family: 'normal',
        size: this.edgeFontSize
      }).height;

      let label = edge + '→';
      if (edge === 'CAPITALOF') {
        g.setEdge('CAPITALS', 'COUNTRIES', {
          label: label,
          width: width,
          height: height,
          toNodeRadius: 32
        })
      }
      else if (edge === 'CURRENCYOF') {
        g.setEdge('CURRENCIES', 'COUNTRIES', {
          label: label,
          width: width,
          height: height,
          toNodeRadius: 28
        })
      }
      else if (edge === 'ONCONTINENT') {
        g.setEdge('COUNTRIES', 'CONTINENTS', {
          label: label,
          width: width,
          height: height,
          toNodeRadius: 17
        })
      }
    });

    // Add nodes to the graph. The first argument is the node id. The second is
    // metadata about the node. In this case we're going to add labels to each of
    // our nodes.
    // g.setNode("kspacey",    { label: "Kevin Spacey",  width: 144, height: 100, content:['Beijing', 'Seoul', 'Tokyo'] });
    // g.setNode("swilliams",  { label: "Saul Williams", width: 160, height: 100, content:['Beijing', 'Seoul', 'Tokyo'] });
    // g.setNode("bpitt",      { label: "Brad Pitt",     width: 108, height: 100, content:['Beijing', 'Seoul', 'Tokyo'] });
    // g.setNode("hford",      { label: "Harrison Ford", width: 168, height: 100, content:['Beijing', 'Seoul', 'Tokyo'] });
    // g.setNode("lwilson",    { label: "Luke Wilson",   width: 144, height: 100, content:['Beijing', 'Seoul', 'Tokyo'] });
    // g.setNode("kbacon",     { label: "Kevin Bacon",   width: 121, height: 100, content:['Beijing', 'Seoul', 'Tokyo'] });
    //
    // // Add edges to the graph.
    // g.setEdge("kspacey",   "swilliams");
    // g.setEdge("swilliams", "kbacon");
    // g.setEdge("bpitt",     "kbacon");
    // g.setEdge("hford",     "lwilson");
    // g.setEdge("lwilson",   "kbacon");


    g.nodes().forEach(function(v) {
      // console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
    });
    g.edges().forEach(function(e) {
      // console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
    });
    // Layout
    dagre.layout(g);

    g.nodes().forEach(function(v) {
      // console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
    });
    g.edges().forEach(function(e) {
      // console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
    });

    let dagNodeList = [],
      dagEdgeList = [];

    g.nodes().forEach((node, index) => {
      let dagNode = new DagNode(g.node(node), index);
      dagNodeList.push(dagNode)
    });

    g.edges().forEach((item, index) => {
      let edge = g.edge(item);
      let points = edge.points;
      let len = points.length;
      let v = item.v;
      let w = item.w;

      points[0].x = g.node(v).x;
      points[0].y = g.node(v).y;
      points[len - 1].x = g.node(w).x;
      points[len - 1].y = g.node(w).y;

      dagEdgeList.push(new DagEdge(g.edge(item)))
      // if (rawEdgeList[index].reversed) {
      //   dagEdgeList.push(new DagEdge(points.reverse(), v, w, g.edge({v: v, w : w}).label, g.edge({v: v, w : w}).x, g.edge({v: v, w : w}).y, true, ''))
      // } else {
      //   dagEdgeList.push(new DagEdge(points, v, w, g.edge({v: v, w : w}).label, g.edge({v: v, w : w}).x, g.edge({v: v, w : w}).y, false, ''))
      // }
    });

    this.setState({
      graphWidth: g.graph().width + 135,
      graphHeight: g.graph().height + 110,
      dagNodeList: dagNodeList,
      dagEdgeList: dagEdgeList
    })
  }

  DAGFadeOutAndDisappear() {
    d3.select('#DAG')
      .transition()
      .duration(DAGFadeOutTime)
      .style('opacity', 0)
      .transition()
      .duration(0)
      .style('display', 'none')
  }

  onNodeClick(_clickedDAGNode) {
    this.DAGFadeOutAndDisappear();

    this.clickedDAGNode = _clickedDAGNode;
    setTimeout(() => {
      this.setState({showStatus: 'nodeDetail'})
    }, DAGFadeOutTime)
  }

  componentWillMount() {
    this.readGraphData();
    // setTimeout(() => {
    //   this.processGraphData();
    // }, 0)
  }

  componentDidMount() {

  }

  render() {
    let windowWidth = document.documentElement.clientWidth;
    let windowHeight = document.documentElement.clientHeight;

    if (this.state.showStatus === 'DAG') {
      return(
        <div id={'DAGGraph'}>
          <svg id width={windowWidth * 0.66} height={windowHeight * 0.85} viewBox={"0 0 " + this.state.graphWidth + ' ' + this.state.graphHeight} preserveAspectRatio="xMidYMid meet">
            <g id={'DAG'} transform={'translate(50, 0)'}>
              <DAGEdges edges={this.state.dagEdgeList} curveFunction={BuildQuadraticCurve}/>
              <DAGNodes nodes={this.state.dagNodeList} onNodeClick={this.onNodeClick}/>
            </g>
          </svg>
        </div>
      )
    }
    else if (this.state.showStatus === 'nodeDetail') {
      return(
        <div id={'ForceDirectedGraph'}>
          <NodeDetail width={windowWidth * 0.66} height={windowHeight * 0.85} node={this.clickedDAGNode}/>
        </div>
      )
    }
  }
}