import React, {Component} from 'react'
import * as d3 from 'd3'

export default class NodeDetail extends Component {
  radius = 8;

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {

  }

  componentDidMount() {
    setTimeout(() => {
      let svg = d3.select('.force-graph');
      let g = svg.append('g');
      let width = this.props.width;
      let height = this.props.height;
      let radius = this.radius;

      let nodes = this.props.node.content;
      let forceSimulation = d3.forceSimulation()
        .force('link', d3.forceLink())
        .force('charge', d3.forceManyBody().strength(-5))
        .force('center', d3.forceCenter());

      forceSimulation.nodes(nodes)
        .on('tick',ticked)

      // Force Center
      forceSimulation.force('center')
        .x(width / 2)
        .y(height / 2)

      var gs = g.selectAll('.circleText')
        .data(this.props.node.content)
        .enter()
        .append('g')
        .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
        .style('cursor', 'pointer')
        .call(d3.drag()
          .on('start', started)
          .on('drag', dragged)
          .on('end', ended)
        )

      gs.append('circle')
        .attr('r', radius)
        // .attr('fill', (d, i) => colorScale(d.community))
        // .attr('fill', d => that.props.paramsOfInterest.indexOf(d.name) >= 0 ? ChartColorDict[d.name] : 'gray')
        .attr('fill', 'gray')
        .attr('id', d => 'corrgraph_node_' + d.name)
        .attr('class', 'corrgraph_node')

      // Label
      gs.append('text')
        .attr('x', -10)
        .attr('y', -20)
        .attr('dy', 10)
        .attr('font-size', 12)
        .text(d => d.name);

      // Tick Function
      function ticked(){
        gs.attr('transform', d => {
          d.x = Math.max(Math.min(d.x, width - radius * 2), radius * 2);
          d.y = Math.max(Math.min(d.y, height - radius * 2), radius * 2);
          return 'translate(' + d.x + ',' + d.y + ')'
        })
      }
      // Drag Functions
      function started(d) {
        if(!d3.event.active){
          forceSimulation.alphaTarget(0.8).restart()
        }
        d.fx = d.x;
        d.fy = d.y
      }
      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y
      }
      function ended(d) {
        if(!d3.event.active) {
          forceSimulation.alphaTarget(0.75)
        }
        d.fx = null;
        d.fy = null
      }
    }, 0)
  }

  render() {
    return(
      <svg className="force-graph" width={this.props.width} height={this.props.height}/>
    )
  }
}