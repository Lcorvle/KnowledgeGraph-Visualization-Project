import './Filter.css'
import {Component} from "react";
import React from "react";
import {BuildBezierCurve} from "../scripts/BuildCurve";
import * as dagre from "dagre";
import * as d3 from "d3";

export default class Filter extends Component {
  settings = null;
  new_edge = null;
  constructor(props) {
    super(props);

    this.state = {
      rule_map: {
        nodes: [{
          nid: 1,
          name: "COUNTRIES",
          type: "Item"
        }, {
          nid: 2,
          name: "CONTINENTS",
          type: "Item"
        }, {
          nid: 3,
          name: "POPULATION",
          type: "Attribute"
        }, {
          nid: 4,
          name: "CAPITALS",
          type: "Item"
        }],
        edges: [{
          start: 1,
          end: 2,
          relation: "n:n"
        }, {
          start: 1,
          end: 3,
          relation: "1:1"
        }, {
          start: 1,
          end: 4,
          relation: "1:1"
        }]
      },
      menu_types: ["Add", "Clear", "Apply"],
      menu_names: ["Item", "Attribute", "Relation"],
      menu_contents: [["COUNTRIES", "CONTINENTS", "CAPITALS", "CURRENCIES"],
        ["POPULATION", "HASCODE"], ["1:1", "1:n", "n:1", "n:n"]],
      menu_type_id: 0,
      menu_name_id: -1,
      menu_content_id: -1
    };
    this.settings = {
      menu_height: 22,
      menu_width_per_char: 10,
      menu_boundary: 3,
      min_rule_map_height: 400,
      botton_click: false
    };
    this.new_edge = [];
  }

  componentWillMount() {
    console.log("Enter function componentWillMount");
    let that = this;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/process', true);

    xhr.onload = function (e) {
      if (xhr.status === 200) {

      }
      else {
        alert('XML error occurred!')
      }
    };

    xhr.send();
  }

  componentDidMount() {
    console.log("Enter function componentDidMount");
  }

  componentDidUpdate() {
    console.log("Enter function componentDidUpdate");
    let that = this;
    d3.selectAll(".menu-rect").attr("fill", "white");
    d3.select("#menu-rect-menu_type-" + that.state.menu_type_id).attr("fill", "gray");
    if (that.new_edge.length === 1) {
      d3.select("#node-rect-" + that.new_edge[0]).attr("fill", "yellow");
    }

    for (let i = 0;i < this.state.menu_types.length;i++) {
      let menu_rect = d3.select("#menu-rect-menu_type-" + i);
      let menu_text = d3.select("#menu-text-menu_type-" + i);
      if (i === 0) {
        menu_rect.on("click", function () {
          let state = that.state;
          that.settings.botton_click = true;
          state.menu_type_id = 0;
          that.new_edge = [];
          that.setState(state);
        });
        menu_text.on("click", function () {
          let state = that.state;
          that.settings.botton_click = true;
          state.menu_type_id = 0;
          that.new_edge = [];
          that.setState(state);
        });
      }
      else if (i === 1) {
        menu_rect.on("click", function () {
          let state = that.state;
          that.settings.botton_click = true;
          state["rule_map"] = {
            nodes: [],
            edges:[]
          };
          that.new_edge = [];
          that.setState(state);
        });
        menu_text.on("click", function () {
          let state = that.state;
          that.settings.botton_click = true;
          state["rule_map"] = {
            nodes: [],
            edges:[]
          };
          that.new_edge = [];
          that.setState(state);
        });
      }
      else {
        menu_rect.on("click", function () {
          that.settings.botton_click = true;
          that.new_edge = [];
          that.props.reRenderCompare({
            detail_items: [{
              nid: 468,
              type: "COUNTRIES"
            }, {
              nid: 412,
              type: "COUNTRIES"
            }, {
              nid: 197,
              type: "COUNTRIES"
            }],
            overview_items: [{
              nid: 272,
              type: "COUNTRIES"
            }, {
              nid: 241,
              type: "COUNTRIES"
            }, {
              nid: 301,
              type: "COUNTRIES"
            }, {
              nid: 235,
              type: "COUNTRIES"
            }, {
              nid: 294,
              type: "COUNTRIES"
            }, {
              nid: 298,
              type: "COUNTRIES"
            }, {
              nid: 450,
              type: "COUNTRIES"
            }, {
              nid: 419,
              type: "COUNTRIES"
            }, {
              nid: 174,
              type: "COUNTRIES"
            }, {
              nid: 263,
              type: "COUNTRIES"
            }, {
              nid: 350,
              type: "COUNTRIES"
            }, {
              nid: 180,
              type: "COUNTRIES"
            }, {
              nid: 340,
              type: "COUNTRIES"
            }, {
              nid: 297,
              type: "COUNTRIES"
            }, {
              nid: 236,
              type: "COUNTRIES"
            }, {
              nid: 426,
              type: "COUNTRIES"
            }, {
              nid: 485,
              type: "COUNTRIES"
            }]
          });
        });
        menu_text.on("click", function () {
          that.settings.botton_click = true;
          that.new_edge = [];
          that.props.reRenderCompare({
            detail_items: [{
              nid: 468,
              type: "COUNTRIES"
            }, {
              nid: 412,
              type: "COUNTRIES"
            }, {
              nid: 197,
              type: "COUNTRIES"
            }],
            overview_items: [{
              nid: 272,
              type: "COUNTRIES"
            }, {
              nid: 241,
              type: "COUNTRIES"
            }, {
              nid: 301,
              type: "COUNTRIES"
            }, {
              nid: 235,
              type: "COUNTRIES"
            }, {
              nid: 294,
              type: "COUNTRIES"
            }, {
              nid: 298,
              type: "COUNTRIES"
            }, {
              nid: 450,
              type: "COUNTRIES"
            }, {
              nid: 419,
              type: "COUNTRIES"
            }, {
              nid: 174,
              type: "COUNTRIES"
            }, {
              nid: 263,
              type: "COUNTRIES"
            }, {
              nid: 350,
              type: "COUNTRIES"
            }, {
              nid: 180,
              type: "COUNTRIES"
            }, {
              nid: 340,
              type: "COUNTRIES"
            }, {
              nid: 297,
              type: "COUNTRIES"
            }, {
              nid: 236,
              type: "COUNTRIES"
            }, {
              nid: 426,
              type: "COUNTRIES"
            }, {
              nid: 485,
              type: "COUNTRIES"
            }]
          });
        });
      }
    }
    if (that.state.menu_type_id === 0) {
      d3.select("#menu-rect-menu_name-" + that.state.menu_name_id).attr("fill", "gray");
      for (let i = 0;i < this.state.menu_names.length;i++) {
        let menu_rect = d3.select("#menu-rect-menu_name-" + i);
        let menu_text = d3.select("#menu-text-menu_name-" + i);
        menu_rect.on("click", function () {
          let state = that.state;
          that.settings.botton_click = true;
          state.menu_name_id = i;
          state.menu_content_id = -1;
          if (i !== 2) {
            that.new_edge = [];
          }
          that.setState(state);
        });
        menu_text.on("click", function () {
          let state = that.state;
          that.settings.botton_click = true;
          state.menu_name_id = i;
          state.menu_content_id = -1;
          if (i !== 2) {
            that.new_edge = [];
          }
          that.setState(state);
        });
      }
    }
    if (that.state.menu_name_id >= 0) {
      d3.select("#menu-rect-menu_content-" + that.state.menu_content_id).attr("fill", "gray");
      for (let i = 0;i < this.state.menu_contents[that.state.menu_name_id].length;i++) {
        let menu_rect = d3.select("#menu-rect-menu_content-" + i);
        let menu_text = d3.select("#menu-text-menu_content-" + i);
        menu_rect.on("click", function () {
          let state = that.state;
          that.settings.botton_click = true;
          state.menu_content_id = i;
          that.new_edge = [];
          that.setState(state);
        });
        menu_text.on("click", function () {
          let state = that.state;
          that.settings.botton_click = true;
          state.menu_content_id = i;
          that.new_edge = [];
          that.setState(state);
        });
      }
    }
    for (let i = 0;i < this.state.rule_map["nodes"].length;i++) {
      let node_rect = d3.select("#node-rect-" + i);
      let node_text = d3.select("#node-text-" + i);
      node_rect.on("click", function () {
        let state = that.state;
          that.settings.botton_click = true;
        if (state.menu_name_id === 2) {
          if (that.new_edge.length === 0) {
            that.new_edge.push(i);
          }
          else if (that.new_edge[1] !== i) {
            that.new_edge.push(i);
          }
          if (that.new_edge.length === 2) {
            state["rule_map"]["edges"].push({
              start: state["rule_map"]["nodes"][that.new_edge[0]]["nid"],
              end: state["rule_map"]["nodes"][that.new_edge[1]]["nid"],
              relation: state.menu_contents[state.menu_name_id][state.menu_content_id]
            });
            that.new_edge = [];
          }
          that.setState(state);
        }
      });
      node_text.on("click", function () {
        let state = that.state;
          that.settings.botton_click = true;
        if (state.menu_name_id === 2) {
          if (that.new_edge.length === 0) {
            that.new_edge.push(i);
          }
          else if (that.new_edge[1] !== i) {
            that.new_edge.push(i);
          }
          if (that.new_edge.length === 2) {
            state["rule_map"]["edges"].push({
              start: state["rule_map"]["nodes"][that.new_edge[0]]["nid"],
              end: state["rule_map"]["nodes"][that.new_edge[1]]["nid"],
              relation: state.menu_contents[state.menu_name_id][state.menu_content_id]
            });
            that.new_edge = [];
          }
          that.setState(state);
        }
      });
    }
    let svg = d3.select("#rule-svg");
    svg.on('click', function () {
      let state = that.state;
      if (state.menu_name_id < state.menu_names.length - 1 && state.menu_content_id >= 0 && !that.settings.botton_click) {

        state["rule_map"]["nodes"].push({
          nid: state["rule_map"]["nodes"].length + 1,
          name: state["menu_contents"][state.menu_name_id][state.menu_content_id],
          type: state["menu_names"][state.menu_name_id]
        });
        that.setState(state);
      }
      that.settings.botton_click = false;
    });
  }

  applyRules() {
    let that = this;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/get_id_by_rules', true);
    var formData = new FormData();

    let rules = {
      "one_node_to_one_node": []
    };
    let rule_dic = {

    };
    formData.append("rules", JSON.stringify([]));
    formData.append("types", JSON.stringify([]));

    xhr.onload = function (e) {
      if (xhr.status === 200) {
        let items = JSON.parse(xhr.response);
        let state = that.state;

        that.setState(state);
      }
      else {
        alert('XML error occurred!')
      }
    };

    xhr.send(formData);
  }

  render() {
    // get svg width and height
    let window_width = document.documentElement.clientWidth;
    let window_height = document.documentElement.clientHeight;
    let svg_width = window_width * 0.33;
    let svg_height = window_height * 0.3 - 40;

    // get max menu height
    let menu_panel_height = 0;

    // get menu types position
    let menu_type_number = this.state.menu_types.length;
    let menu_type_width = 0;
    for (let i = 0;i < menu_type_number;i++) {
      if (this.state.menu_types[i].length * this.settings.menu_width_per_char > menu_type_width) {
        menu_type_width = this.state.menu_types[i].length * this.settings.menu_width_per_char;
      }
    }
    let menu_types = [];
    let menu_type_numbers = [];
    for (let i = 0;i < menu_type_number;i++) {
      menu_type_numbers[i] = i;
      menu_types[i] = {
        x: this.settings.menu_boundary,
        y: this.settings.menu_boundary + i * this.settings.menu_height,
        width: menu_type_width,
        height: this.settings.menu_height,
        name: this.state.menu_types[i]
      };
    }

    // get max height of menu type
    let menu_type_panel_height = this.settings.menu_height * menu_type_number;
    if (menu_panel_height < menu_type_panel_height + 2 * this.settings.menu_boundary) {
      menu_panel_height = menu_type_panel_height + 2 * this.settings.menu_boundary;
    }


    // get menu names position
    let menu_name_number = this.state.menu_names.length;
    let menu_name_width_scales = [];
    let menu_name_col_nums = [0];
    let menu_name_numbers = [];
    for (let i = 0, width = 0;i < menu_name_number;i++) {
      menu_name_numbers[i] = i;
      if (width + this.state.menu_names[i].length * this.settings.menu_width_per_char >= svg_width - this.settings.menu_boundary * 3 - menu_type_width) {
        menu_name_width_scales.push((svg_width - this.settings.menu_boundary * 3 - menu_type_width) / width);
        width = 0;
        menu_name_col_nums.push(i);
      }
      width += this.state.menu_names[i].length * this.settings.menu_width_per_char;
      if (i === menu_name_number - 1 && width > 0) {
        menu_name_width_scales.push(1.0);
        menu_name_col_nums.push(i + 1);
      }
    }
    let menu_names = [];
    for (let i = 0;i < menu_name_col_nums.length - 1;i++) {
      let x = 0, y = i * this.settings.menu_height;
      for (let j = menu_name_col_nums[i];j < menu_name_col_nums[i + 1];j++) {
        let width = this.state.menu_names[j].length * this.settings.menu_width_per_char;
        width *= menu_name_width_scales[i];
        menu_names[j] = {
          x: x,
          y: y,
          width: width,
          height: this.settings.menu_height,
          name: this.state.menu_names[j]
        };
        x += width;
      }
    }
    let menu_name_height = this.settings.menu_height * menu_name_width_scales.length + 2 * this.settings.menu_boundary;
    if (menu_panel_height < menu_name_height) {
      menu_panel_height = menu_name_height;
    }

    // get menu contents position
    let menu_contents = [];
    let menu_content_numbers = [];
    for (let k = 0;k < menu_name_number;k++) {
      let contents = this.state.menu_contents[k];
      let content_number = contents.length;
      let content_width_scales = [];
      let content_col_nums = [0];
      for (let i = 0, width = 0;i < content_number;i++) {
        if (this.state.menu_name_id === k) {
          menu_content_numbers[i] = i;
        }

        if (width + contents[i].length * this.settings.menu_width_per_char >= svg_width - this.settings.menu_boundary * 3 - menu_type_width) {
          content_width_scales.push((svg_width - this.settings.menu_boundary * 3 - menu_type_width) / width);
          width = 0;
          content_col_nums.push(i);
        }
        width += contents[i].length * this.settings.menu_width_per_char;
        if (i === content_number - 1 && width > 0) {
          content_width_scales.push(1.0);
          content_col_nums.push(i + 1);
        }
      }
      let content_height = menu_name_height + this.settings.menu_height * content_width_scales.length + this.settings.menu_boundary;
      if (menu_panel_height < content_height) {
        menu_panel_height = content_height;
      }
      if (this.state.menu_name_id === k) {
        for (let i = 0;i < content_col_nums.length - 1;i++) {
          let x = 0, y = i * this.settings.menu_height;
          for (let j = content_col_nums[i];j < content_col_nums[i + 1];j++) {
            let width = contents[j].length * this.settings.menu_width_per_char;
            width *= content_width_scales[i];
            menu_contents[j] = {
              x: x,
              y: y,
              width: width,
              height: this.settings.menu_height,
              name: contents[j]
            };
            x += width;
          }
        }
      }
    }



    // Create a new directed graph
    let g = new dagre.graphlib.Graph({multigraph: true});

    // Set an object for the graph label
    g.setGraph({});
    g.graph().marginx = 5;
    g.graph().marginy = 5;
    g.graph().rankdir = "LR";

    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(function() { return {}; });

    // Add nodes to the graph. The first argument is the node id. The second is
    // metadata about the node. In this case we're going to add labels to each of
    // our nodes.
    let item = this.state.rule_map;
    console.log(item.nodes);
    for (let j = 0;j < item.nodes.length;j++) {
      let node = item.nodes[j];
      g.setNode(node.nid, { index: j, label: node.name, width: node.name.length * 10, height: 22 });
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
    let graph_rule_map = {
      nodes: [],
      edges: [],
      width: g.graph().width,
      height: g.graph().height};
    let scale = (svg_width - 2 * this.settings.menu_boundary) / g.graph().width;
    if (scale > (svg_height - menu_panel_height - this.settings.menu_boundary) / g.graph().height) {
      scale = (svg_height - menu_panel_height - this.settings.menu_boundary) / g.graph().height;
    }

    g.nodes().forEach(function(v) {
      let graph_node = g.node(v);
      let item_nodes = item.nodes;
      graph_rule_map["nodes"].push({
        type: item_nodes[graph_node.index].type,
        name: item_nodes[graph_node.index].name,
        id: item_nodes[graph_node.index].nid,
        index: graph_node.index,
        width: graph_node.width,
        height: graph_node.height,
        x: graph_node.x - graph_node.width / 2,
        y: graph_node.y - graph_node.height / 2
      });
    });

    g.edges().forEach(function(e) {
      let graph_edge = g.edge(e);

      graph_rule_map["edges"].push({
        relation: e.name,
        start: e.v,
        end: e.w,
        points: graph_edge.points
      });
    });

    if (this.state.menu_type_id === 0 && this.state.menu_name_id !== -1) {
      const listMenuTypes = menu_type_numbers.map((number) =>
        <Menu key={"menu-type-" + number.toString()} class_name={"menu_type"} id={number}
              x={0} y={0} menu={menu_types[number]} />
      );

      const listMenuNames = menu_name_numbers.map((number) =>
        <Menu key={"menu-name-" + number.toString()} class_name={"menu_name"} id={number}
              x={this.settings.menu_boundary * 2 + menu_type_width} y={this.settings.menu_boundary} menu={menu_names[number]} />
      );

      const listMenuContents = menu_content_numbers.map((number) =>
        <Menu key={"menu-content-" + number.toString()} class_name={"menu_content"} id={number}
              x={this.settings.menu_boundary * 2 + menu_type_width} y={menu_name_height} menu={menu_contents[number]} />
      );
      return(
        <svg height={svg_height} id={"rule-svg"}>
          <g>{listMenuTypes}{listMenuNames}{listMenuContents}</g>
          <rect className={"split-line"} x={0} y={menu_panel_height - 5} width={svg_width} height={8}/>
          <Map id={"rule-map"} x={this.settings.menu_boundary}
              y={menu_panel_height} scale={scale}
              map={graph_rule_map} />
        </svg>
      )
    }
    else if (this.state.menu_type_id === 0) {
      const listMenuTypes = menu_type_numbers.map((number) =>
        <Menu key={"menu-type-" + number.toString()} class_name={"menu_type"} id={number}
              x={0} y={0} menu={menu_types[number]} />
      );

      const listMenuNames = menu_name_numbers.map((number) =>
        <Menu key={"menu-name-" + number.toString()} class_name={"menu_name"} id={number}
              x={this.settings.menu_boundary * 2 + menu_type_width} y={this.settings.menu_boundary} menu={menu_names[number]} />
      );
      return(
        <svg height={svg_height} id={"rule-svg"}>
          <g>{listMenuTypes}{listMenuNames}</g>
          <rect className={"split-line"} x={0} y={menu_panel_height - 5} width={svg_width} height={8}/>
          <Map id={"rule-map"} x={this.settings.menu_boundary}
              y={menu_panel_height} scale={scale}
              map={graph_rule_map} />
        </svg>
      )
    }
    else {
      const listMenuTypes = menu_type_numbers.map((number) =>
        <Menu key={"menu-type-" + number.toString()} class_name={"menu_type"} id={number}
              x={0} y={0} menu={menu_types[number]} />
      );
      return(
        <svg height={svg_height} id={"rule-svg"}>
          <g>{listMenuTypes}</g>
          <rect className={"split-line"} x={0} y={menu_panel_height - 5} width={svg_width} height={8}/>
          <Map id={"rule-map"} x={this.settings.menu_boundary}
              y={menu_panel_height} scale={scale}
              map={graph_rule_map} />
        </svg>
      )
    }
  }
}

class Menu extends Component {
  render() {
    console.log(this.props);
    return (
      <g>
        <rect className={"menu-rect " + this.props.class_name} id={"menu-rect-" + this.props.class_name + "-" + this.props.id} x={this.props.x + this.props.menu.x} y={this.props.y + this.props.menu.y} width={this.props.menu.width} height={this.props.menu.height}/>
        <text className={"menu-text " + this.props.class_name} id={"menu-text-" + this.props.class_name + "-"  + this.props.id} x={this.props.x + this.props.menu.x + this.props.menu.width / 2} y={this.props.y + this.props.menu.y + this.props.menu.height / 2}>{this.props.menu.name}</text>
      </g>
    );
  }
}

class Map extends Component {
  render() {
    let node_numbers = [];
    for (let i = 0;i < this.props.map.nodes.length;i++) {
      node_numbers[i] = i;
    }
    const listNodes = node_numbers.map((number) =>
      <Node key={"node-" + number.toString()} id={number} node={this.props.map.nodes[number]} />
    );
    let edge_numbers = [];
    for (let i = 0;i < this.props.map.edges.length;i++) {
      edge_numbers[i] = i;
    }
    const listEdges = edge_numbers.map((number) =>
      <Edge key={"edge-" + number.toString()} id={number} edge={this.props.map.edges[number]} edge_func={BuildBezierCurve} />
    );
    return (
      <g className={"map"} transform={"translate(" + this.props.x + "," + this.props.y + ") scale(" + this.props.scale + ")"}>
        {listEdges}{listNodes}
      </g>
    );
  }
}

class Node extends Component {
  render() {
    return (
      <g>
        <text className={"node-text " + this.props.node.type} id={"node-text-" + this.props.id} x={this.props.node.x + this.props.node.width / 2} y={this.props.node.y + this.props.node.height / 2}>{this.props.node.name}</text>
        <rect className={"node-rect " + this.props.node.type} id={"node-rect-" + this.props.id} x={this.props.node.x} y={this.props.node.y} width={this.props.node.width} height={this.props.node.height}/>
      </g>
    );
  }
}

class Edge extends Component {
  render() {
    return (
      <g>
        <path className={"edge-path " + this.props.edge.relation} id={"node-path-" + this.props.id} d={this.props.edge_func(this.props.edge.points)}/>
        <text className={"edge-text " + this.props.edge.relation} id={"node-text-" + this.props.id} x={this.props.edge.points[1].x} y={this.props.edge.points[1].y}>{this.props.edge.relation}</text>
      </g>
    );
  }
}