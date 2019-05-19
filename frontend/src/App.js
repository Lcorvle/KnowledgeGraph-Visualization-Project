import React, { Component } from 'react';
import './App.css';
import PanelContainer from './components/PanelContainer'
import Graph from './components/Graph'
import Filter from './components/Filter'
import Compare from './components/Compare'
import HeatMap from './components/HeatMap'

function HeadingItem(_heading, _information) {
  this.heading = _heading;
  this.information = _information;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.reRenderCompare = this.reRenderCompare.bind(this);
    this.state = {compareState: null};
  }

  componentWillMount() {
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
  }

  reRenderCompare(compareState) {
    this.setState({compareState: compareState});
  }

  render() {
    let windowWidth = document.documentElement.clientWidth;
    let windowHeight = document.documentElement.clientHeight;

    let leftHeadings = [];
    leftHeadings.push(new HeadingItem('Graph', 'This view shows Graph'));
    leftHeadings.push(new HeadingItem('Heat Map', 'This view shows Map'));
    let rightTopHeadings = [];
    rightTopHeadings.push(new HeadingItem('Result', 'This view shows Result'));
    let rightDownHeadings = [];
    rightDownHeadings.push(new HeadingItem('Rules', 'This view shows Rules'));

    return (
      <div className="App">
        <div id="measureText"/>
        <div id='self-column-1' className="self-column">
          <PanelContainer headings={leftHeadings}>
            <Graph/>
            <HeatMap/>
          </PanelContainer>
        </div>

        <div id='self-column-2' className="self-column">
          <div id='block-2-1'>
            <PanelContainer headings={rightTopHeadings} style={{height: windowHeight*0.42}}>
              <Compare state={this.state.compareState}/>
            </PanelContainer>
          </div>
          <div id='block-2-2'>
            <PanelContainer headings={rightDownHeadings} style={{height: windowHeight*0.43}}>
              <Filter reRenderCompare={this.reRenderCompare}/>
            </PanelContainer>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
