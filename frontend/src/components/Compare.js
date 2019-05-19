import './Compare.css'
import {Component} from "react";
import React from "react";
import * as dagre from "dagre"
import { BuildQuadraticCurve, BuildCubicBezierCurve, BuildBezierCurve } from '../scripts/BuildCurve';
import * as d3 from 'd3';
import {deep_copy} from "../scripts/helper";

export default class Compare extends Component {
  graph_items = null;
  settings = null;

  constructor(props) {
    super(props);
    this.settings = {
      min_overview_item_area: 360
    };
    this.state = {
      overview_items: [],
      detail_items: [],
      overview_nid_to_index: {},
      overview_index_to_nid: [],
      detail_nid_to_index: {},
      detail_index_to_nid: []
    };
  }

  componentWillMount() {
    // console.log("Enter function componentWillMount");

  }

  componentDidMount() {
    // console.log("Enter function componentDidMount");
  }

  componentWillReceiveProps() {
    if(this.props.state !== null){
      this.reRender(this.props.state);
    }
  }

  componentDidUpdate() {
    let that = this;
    let svg = d3.select("#compare-svg");
    svg.on('click', function () {

    });
    d3.selectAll(".item-background").attr("stroke", "transparent").attr("stroke-width", "1px");
    d3.selectAll(".item-btn-rect").attr("stroke", "transparent").attr("stroke-width", "1px");
    d3.selectAll(".item-btn-mask").attr("stroke", "transparent").attr("stroke-width", "1px");
    for (let i = 0;i < that.graph_items["detail_items"].length;i++) {
      let item_background = d3.select("#item-background-detail-item" + i);
      item_background.on('mousemove', function () {
        d3.select("#item-btn-rect-detail-item" + i).attr("stroke", "black").attr("stroke-width", "3px");
        d3.select("#item-btn-mask-detail-item" + i).attr("stroke", "black").attr("stroke-width", "3px");
      }).on('mouseleave', function () {
        d3.select("#item-btn-rect-detail-item" + i).attr("stroke", "transparent").attr("stroke-width", "1px");
        d3.select("#item-btn-mask-detail-item" + i).attr("stroke", "transparent").attr("stroke-width", "1px");
      });
      let item_btn_rect = d3.select("#item-btn-rect-detail-item" + i);
      item_btn_rect.on('mousemove', function () {
        d3.select("#item-background-detail-item" + i).attr("stroke", "black").attr("stroke-width", "3px");
        d3.select("#item-btn-mask-detail-item" + i).attr("stroke", "black").attr("stroke-width", "3px");
      }).on('mouseleave', function () {
        d3.select("#item-background-detail-item" + i).attr("stroke", "transparent").attr("stroke-width", "1px");
        d3.select("#item-btn-mask-detail-item" + i).attr("stroke", "transparent").attr("stroke-width", "1px");
      }).on('click', function () {
        let state = that.state;
        state["overview_items"].push(state["detail_items"][i]);
        state["overview_nid_to_index"][state["detail_index_to_nid"][i]] = state["overview_index_to_nid"].length;
        state["overview_index_to_nid"].push(state["detail_index_to_nid"][i]);
        state["detail_nid_to_index"][state["detail_index_to_nid"][i]] = undefined;
        state["detail_index_to_nid"].splice(i, 1);
        state["detail_items"].splice(i, 1);
        that.setState(state);
      });
    }
    for (let i = 0;i < that.graph_items["overview_items"].length;i++) {
      let item_background = d3.select("#item-background-overview-item" + i);
      item_background.on('mousemove', function (d) {
        d3.select("#item-btn-rect-overview-item" + i).attr("stroke", "black").attr("stroke-width", "3px");
        d3.select("#item-btn-mask-overview-item" + i).attr("stroke", "black").attr("stroke-width", "3px");
      }).on('mouseleave', function (d) {
        d3.select("#item-btn-rect-overview-item" + i).attr("stroke", "transparent").attr("stroke-width", "1px");
        d3.select("#item-btn-mask-overview-item" + i).attr("stroke", "transparent").attr("stroke-width", "1px");
      });
      let item_btn_rect = d3.select("#item-btn-rect-overview-item" + i);
      item_btn_rect.on('mousemove', function () {
        d3.select("#item-background-overview-item" + i).attr("stroke", "black").attr("stroke-width", "3px");
        d3.select("#item-btn-mask-overview-item" + i).attr("stroke", "black").attr("stroke-width", "3px");
      }).on('mouseleave', function () {
        d3.select("#item-background-overview-item" + i).attr("stroke", "transparent").attr("stroke-width", "1px");
        d3.select("#item-btn-mask-overview-item" + i).attr("stroke", "transparent").attr("stroke-width", "1px");
      }).on('click', function () {
        let state = that.state;
        state["detail_items"].push(state["overview_items"][i]);
        state["detail_nid_to_index"][state["overview_index_to_nid"][i]] = state["detail_index_to_nid"].length;
        state["detail_index_to_nid"].push(state["overview_index_to_nid"][i]);
        state["overview_nid_to_index"][state["overview_index_to_nid"][i]] = undefined;
        state["overview_index_to_nid"].splice(i, 1);
        state["overview_items"].splice(i, 1);
        that.setState(state);
      });
    }
  }

  reRender(state) {
    // console.log("Enter function reRender");
    let that = this;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/get_k_hop_neighbours', true);
    var formData = new FormData();
    let nids = {
      overview: [],
      detail:[]
    }, types = {
      overview: [],
      detail:[]
    };
    let overview_item_number = state.overview_items.length;
    for (let i = 0;i < overview_item_number; i++) {
      nids["overview"].push(state.overview_items[i]["nid"]);
      types["overview"].push(state.overview_items[i]["type"]);
    }
    let detail_item_number = state.detail_items.length;
    for (let i = 0;i < detail_item_number; i++) {
      nids["detail"].push(state.detail_items[i]["nid"]);
      types["detail"].push(state.detail_items[i]["type"]);
    }

    formData.append("nids", JSON.stringify(nids));
    formData.append("types", JSON.stringify(types));

    xhr.onload = function (e) {
      if (xhr.status === 200) {
        let items = JSON.parse(xhr.response);
        let state = that.state;

        // detail items
        state["detail_items"] = items["detail_items"];
        state["detail_nid_to_index"] = {};
        state["detail_index_to_nid"] = [];
        for (let i = 0;i < state["detail_items"].length;i++) {
          let nid = state["detail_items"][i]["start_nid"];
          state["detail_nid_to_index"][nid] = i;
          state["detail_index_to_nid"][i] = nid;
        }

        // overview items
        state["overview_items"] = items["overview_items"];
        state["overview_nid_to_index"] = {};
        state["overview_index_to_nid"] = [];
        for (let i = 0;i < state["overview_items"].length;i++) {
          let nid = state["overview_items"][i]["start_nid"];
          state["overview_nid_to_index"][nid] = i;
          state["overview_index_to_nid"][i] = nid;
        }

        that.state = state;
      }
      else {
        alert('XML error occurred!')
      }
    };

    xhr.send(formData);
  }

  componentWillUpdate() {
  }

  render() {
    // console.log("Enter function render");
    let overview_numbers = [], detail_numbers = [];
    let graph_items = {
      "overview_items": [],
      "detail_items": []
    };
    let overview_item_number = this.state.overview_items.length;
    let overview_item_width = 0, overview_item_height = 0;
    // console.log("Enter function render 1");
    for (let i = 0;i < overview_item_number;i++) {
      overview_numbers[i] = i;

      let item = this.state.overview_items[i];

      // Create a new directed graph
      let g = new dagre.graphlib.Graph({multigraph: true});

      // Set an object for the graph label
      g.setGraph({});
      g.graph().marginx = 5;
      g.graph().marginy = 5;

      // Default to assigning a new object as a label for each new edge.
      g.setDefaultEdgeLabel(function() { return {}; });

      // Add nodes to the graph. The first argument is the node id. The second is
      // metadata about the node. In this case we're going to add labels to each of
      // our nodes.
      for (let j = 0;j < item.nodes.length;j++) {
        let node = item.nodes[j];
        g.setNode(node.nid, { index: j, label: node.name[0], width: node.name[0].length * 10, height: 22 });
      }

      // Add edges to the graph.
      let edge_dic = {};
      for (let j = 0;j < item.edges.length;j++) {
        let edge = item.edges[j];
        edge_dic[edge.start + "-" + edge.end] = j;
        g.setEdge({ v: edge.start,
          w: edge.end,
          name: edge.relation,
          labelpos: "c"});
      }
      dagre.layout(g);
      graph_items["overview_items"][i] = {
        nodes: [],
        edges: [],
        width: g.graph().width,
        height: g.graph().height};

      if (g.graph().width > overview_item_width) {
        overview_item_width = g.graph().width;
      }
      if (g.graph().height > overview_item_height) {
        overview_item_height = g.graph().height;
      }

      g.nodes().forEach(function(v) {
        let graph_node = g.node(v);
        let item_nodes = item.nodes;
        graph_items["overview_items"][i]["nodes"].push({
          type: item_nodes[graph_node.index].type,
          name: item_nodes[graph_node.index].name[0],
          id: item_nodes[graph_node.index].nid,
          index: graph_node.index,
          width: graph_node.width,
          height: graph_node.height,
          x: graph_node.x - graph_node.width / 2,
          y: graph_node.y - graph_node.height / 2
        });
        // console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
      });

      g.edges().forEach(function(e) {
        let graph_edge = g.edge(e);

        graph_items["overview_items"][i]["edges"].push({
          relation: e.name,
          start: e.v,
          end: e.w,
          points: graph_edge.points
        });
        // console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
      });
    }
    for (let i = 0;i < overview_item_number;i++) {
      graph_items["overview_items"][i]["x"] = (overview_item_width - graph_items["overview_items"][i]["width"]) / 2;
      graph_items["overview_items"][i]["y"] = (overview_item_height - graph_items["overview_items"][i]["height"]) / 2;
    }
    let detail_item_number = this.state.detail_items.length;
    let detail_item_width = 0, detail_item_height = 0;
    // console.log("Enter function render 2");

    for (let i = 0;i < detail_item_number;i++) {
      detail_numbers[i] = i;

      let item = this.state.detail_items[i];

      // Create a new directed graph
      let g = new dagre.graphlib.Graph({multigraph: true});

      // Set an object for the graph label
      g.setGraph({});
      g.graph().marginx = 5;
      g.graph().marginy = 5;

      // Default to assigning a new object as a label for each new edge.
      g.setDefaultEdgeLabel(function() { return {}; });

      // Add nodes to the graph. The first argument is the node id. The second is
      // metadata about the node. In this case we're going to add labels to each of
      // our nodes.
      for (let j = 0;j < item.nodes.length;j++) {
        let node = item.nodes[j];
        g.setNode(node.nid, { index: j, label: node.name[0], width: node.name[0].length * 10, height: 22 });
      }

      // Add edges to the graph.
      let edge_dic = {};
      for (let j = 0;j < item.edges.length;j++) {
        let edge = item.edges[j];
        edge_dic[edge.start + "-" + edge.end] = j;
        g.setEdge({ v: edge.start,
          w: edge.end,
          name: edge.relation,
          labelpos: "c"});
      }
      dagre.layout(g);
      graph_items["detail_items"][i] = {
        nodes: [],
        edges: [],
        width: g.graph().width,
        height: g.graph().height};

      if (g.graph().width > detail_item_width) {
        detail_item_width = g.graph().width;
      }
      if (g.graph().height > detail_item_height) {
        detail_item_height = g.graph().height;
      }

      g.nodes().forEach(function(v) {
        let graph_node = g.node(v);
        let item_nodes = item.nodes;
        graph_items["detail_items"][i]["nodes"].push({
          type: item_nodes[graph_node.index].type,
          name: item_nodes[graph_node.index].name[0],
          id: item_nodes[graph_node.index].nid,
          index: graph_node.index,
          width: graph_node.width,
          height: graph_node.height,
          x: graph_node.x - graph_node.width / 2,
          y: graph_node.y - graph_node.height / 2
        });
        // console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
      });

      g.edges().forEach(function(e) {
        let graph_edge = g.edge(e);

        graph_items["detail_items"][i]["edges"].push({
          relation: e.name,
          start: e.v,
          end: e.w,
          points: graph_edge.points
        });
        // console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
      });
    }
    for (let i = 0;i < detail_item_number;i++) {
      graph_items["detail_items"][i]["x"] = (detail_item_width - graph_items["detail_items"][i]["width"]) / 2;
      graph_items["detail_items"][i]["y"] = (detail_item_height - graph_items["detail_items"][i]["height"]) / 2;
    }

    // init detail item scale and overview item scale
    let overview_item_scale = 1.0, detail_item_scale = 1.0;
    // console.log("Enter function render 3");

    // get svg width and height
    let window_width = document.documentElement.clientWidth;
    let window_height = document.documentElement.clientHeight;
    let svg_width = window_width * 0.33;
    let svg_height = window_height * 0.7 - 40;

    // get the max height of detail item panel
    let max_detail_panel_height = svg_height - 10;
    let max_overview_col_num = 1;
    if (overview_item_number > 0) {
      // scale to min_overview_item_area
      let scale = Math.sqrt(this.settings.min_overview_item_area / (overview_item_width * overview_item_height));
      let min_overview_item_width = overview_item_width * scale;

      // scale to svg width
      max_overview_col_num = Math.floor(svg_width / min_overview_item_width);
      min_overview_item_width = svg_width / max_overview_col_num;
      let min_overview_item_height = overview_item_height * min_overview_item_width / overview_item_width;

      // get min overview row num
      let min_overview_row_num = Math.ceil(overview_item_number / max_overview_col_num);
      max_detail_panel_height = svg_height - min_overview_row_num * min_overview_item_height - 10;
    }
    // console.log("Enter function render 4");

    let split_line_y = -100;
    let normal_detail_col_num = 1;
    if (detail_item_number > 0) {
      // get the scale of detail item
      normal_detail_col_num = Math.floor(svg_width / detail_item_width);
      for (let col_num = 2; ; col_num++) {
        let normal_detail_item_width = svg_width / col_num;
        let normal_detail_item_height = detail_item_height * normal_detail_item_width / detail_item_width;
        if (Math.floor(max_detail_panel_height / normal_detail_item_height) * col_num >= detail_item_number) {
          normal_detail_col_num = col_num;
          break;
        }
      }
      let normal_detail_item_width = svg_width / normal_detail_col_num;
      let normal_detail_item_height = detail_item_height * normal_detail_item_width / detail_item_width;
      detail_item_scale = normal_detail_item_width / detail_item_width;

      // get the y of split line
      let normal_detail_row_num = Math.ceil(detail_item_number / normal_detail_col_num);
      if (overview_item_number > 0) {
        split_line_y = normal_detail_row_num * normal_detail_item_height + 5;
      }
    }

    let normal_overview_col_num = 1;
    if (overview_item_number > 0) {
      // get the scale of overview item
      let max_overview_panel_height = svg_height - split_line_y - 5;
      normal_overview_col_num = Math.floor(svg_width / overview_item_width);
      for (let col_num = 2; col_num <= max_overview_col_num; col_num++) {
        let normal_overview_item_width = svg_width / col_num;
        let normal_overview_item_height = overview_item_height * normal_overview_item_width / overview_item_width;
        if (Math.floor(max_overview_panel_height / normal_overview_item_height) * col_num >= overview_item_number) {
          normal_overview_col_num = col_num;
          break;
        }
      }
      let normal_overview_item_width = svg_width / normal_overview_col_num;
      let normal_overview_item_height = overview_item_height * normal_overview_item_width / overview_item_width;
      overview_item_scale = normal_overview_item_width / overview_item_width;
    }

    // console.log("Enter function render 5");

    this.graph_items = graph_items;

    const detailListItems = detail_numbers.map((number) =>
      <Item key={"item-" + number.toString()} x={number % normal_detail_col_num * detail_item_width}
            y={Math.floor(number / normal_detail_col_num) * detail_item_height}
            width={detail_item_width} height={detail_item_height}
            id={"detail-item" + number} direction={1}
            item={this.graph_items["detail_items"][number]} />
    );
    // console.log("Enter function render 6");

    const overviewListItems = overview_numbers.map((number) =>
      <Item key={"item-" + number.toString()} x={number % normal_overview_col_num * overview_item_width}
            y={Math.floor(number / normal_overview_col_num) * overview_item_height}
            width={overview_item_width} height={overview_item_height}
            id={"overview-item" + number} direction={-1}
            item={this.graph_items["overview_items"][number]} />
    );
    // console.log("Enter function render 7");

    return(
      <svg height={svg_height} id={"compare-svg"}>
        <g className={"items"} transform={"translate(0,0) scale(" + detail_item_scale + ")"}>{detailListItems}</g>
        <rect className={"items-split-line"} x={0} y={split_line_y - 5} width={svg_width} height={10}/>
        <g className={"items"} transform={"translate(0," + (split_line_y + 5) + ") scale(" + overview_item_scale + ")"}>{overviewListItems}</g>
      </svg>
    )
  }
}

class Item extends Component {
  render() {
    let node_numbers = [];
    for (let i = 0;i < this.props.item.nodes.length;i++) {
      node_numbers[i] = i;
    }
    const listNodes = node_numbers.map((number) =>
      <Node key={"node-" + number.toString()} x={this.props.item.x} y={this.props.item.y} node={this.props.item.nodes[number]} />
    );
    let edge_numbers = [];
    for (let i = 0;i < this.props.item.edges.length;i++) {
      edge_numbers[i] = i;
    }
    const listEdges = edge_numbers.map((number) =>
      <Edge key={"edge-" + number.toString()} x={this.props.item.x} y={this.props.item.y} edge={this.props.item.edges[number]} edge_func={BuildBezierCurve} />
    );
    return (
      <g className={"item"} transform={"translate(" + this.props.x + "," + this.props.y + ")"}>
        <rect className={"item-background"} id={"item-background-" + this.props.id} x={0} y={0} width={this.props.width} height={this.props.height}/>
        <path className={"item-btn-mask"} id={"item-btn-mask-" + this.props.id}
              d={"M" + this.props.width + ",15L" + (this.props.width - 15) + "," + (15 + 14 * this.props.direction)
              + "L" + (this.props.width - 30) + ", 15M" + (this.props.width - 15) + "," + (15 + 14 * this.props.direction)
              + "L" + (this.props.width - 15) + "," + (15 - 14 * this.props.direction)}/>
        <rect className={"item-btn-rect"} id={"item-btn-rect-" + this.props.id} x={this.props.width - 30} y={0} width={30} height={30}/>
        {listEdges}{listNodes}
      </g>
    );
  }
}

class Node extends Component {
  render() {
    return (
      <g transform={"translate(" + this.props.x + "," + this.props.y + ")"}>
        <rect className={"node-rect " + this.props.node.type} x={this.props.node.x} y={this.props.node.y} width={this.props.node.width} height={this.props.node.height}/>
        <text className={"node-text " + this.props.node.type} x={this.props.node.x + this.props.node.width / 2} y={this.props.node.y + this.props.node.height / 2}>{this.props.node.name}</text>
      </g>
    );
  }
}

class Edge extends Component {
  render() {
    return (
      <g transform={"translate(" + this.props.x + "," + this.props.y + ")"}>
        <path className={"edge-path " + this.props.edge.relation} d={this.props.edge_func(this.props.edge.points)}/>
        <text className={"edge-text " + this.props.edge.relation} x={this.props.edge.points[1].x} y={this.props.edge.points[1].y}>{this.props.edge.relation}</text>
      </g>
    );
  }
}