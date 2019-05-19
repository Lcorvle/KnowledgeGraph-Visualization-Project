import './Filter.css'
import {Component} from "react";
import React from "react";
import * as d3 from 'd3'
import worldJson from '.././data/world.json'
import './HeatMap.css'
import {Popover, OverlayTrigger} from 'react-bootstrap'

const white = d3.rgb(255, 255, 255);
const deepBlue = d3.rgb(0, 69, 104);

export default class HeatMap extends Component {
  width = 6500;
  height = 3100;
  svgID = 'WorldMap';
  strokeWidth = 1;

  constructor(props) {
    super(props);

    this.state = {};
  }

  addMouseEvent() {
    let that = this;

    let svg = d3.select('#' + this.svgID);
    svg.selectAll("path")
      .on("mouseover",function(d,i){
        d3.select(this)
          .attr("stroke-width", that.strokeWidth * 2)
      })
      .on("mouseout",function(d,i){
        d3.select(this)
          .attr("stroke-width", that.strokeWidth);
      });
  }
  //
  // drawHeatMapPath(_item, _key, _d, _fill) {
  //   let popoverHoverFocus = (
  //     <Popover key={_key}
  //              title={_item}
  //              id={"BarChart-popover-trigger" + _key}>
  //       <strong>{chartDataItem[0]}</strong>{this.corrMethod === 'Granger Causality' ?
  //       ': ' + chartDataItem[1].toExponential(2) :': ' + chartDataItem[1].toFixed(2)}
  //     </Popover>
  //   );
  // }

  drawHeatMap(root) {
    let that = this;

    let populations = [];
    root.features.map(item => {
      populations.push(item.properties.POP_EST >= 1 ? Math.log(item.properties.POP_EST) : 0);
    });

    let blueDegreeScale = d3.scaleLinear()
      .domain(d3.extent(populations))
      .range([0, 1]);
    let color = d3.interpolate(white, deepBlue);

    let projection = d3.geoEquirectangular()
      .center([0, 0])
      .scale(1000)
      .translate([this.width/2, this.height/2]);
    let path = d3.geoPath()
      .projection(projection);

    // let svg = d3.select('#' + this.svgID);
    // svg.selectAll("path")
    //   .data( root.features )
    //   .enter()
    //   .append("path")
    //   .attr("stroke","#000")
    //   .attr("stroke-width", that.strokeWidth)
    //   .attr('stroke-opacity', 0.6)
    //   .attr("fill", function(d,i){
    //     return color(blueDegreeScale(populations[i])).toString();
    //   })
    //   .attr("d", path )
    //   .on("mouseover",function(d,i){
    //     d3.select(this)
    //       .attr("stroke-width", that.strokeWidth * 2);
    //   })
    //   .on("mouseout",function(d,i){
    //     d3.select(this)
    //       .attr("stroke-width", that.strokeWidth);
    //   });

    return (
      <g id={'HeatMap'}>
        {root.features.map((item, index) =>
          <path key={index} d={path(item)} fill={color(blueDegreeScale(populations[index])).toString()} strokeWidth={this.strokeWidth} className={'map-path'}/>
        )}
      </g>
    )
  }

  componentWillMount() {
    let windowWidth = document.documentElement.clientWidth;
    let windowHeight = document.documentElement.clientHeight;
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.drawHeatMap(worldJson);
    // }, 0)
  }

  render() {
    let windowWidth = document.documentElement.clientWidth;
    let windowHeight = document.documentElement.clientHeight;

    return(
      <svg id={this.svgID}
           width={windowWidth * 0.66}
           height={windowHeight * 0.8}
           viewBox={"0 0 " + this.width + ' ' + this.height}
           preserveAspectRatio="none">
        {this.drawHeatMap(worldJson)}
      </svg>
    )
  }
}