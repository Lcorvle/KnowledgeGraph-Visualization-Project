import './PanelContainer.css'
import React, {Component} from 'react'
import {Popover, OverlayTrigger, Tabs, Tab} from 'react-bootstrap'

export default class Panel extends Component{
  constructor(props) {
    super(props);

    this.state = {selectedKey: 0};
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(eventKey) {
    this.setState({selectedKey: eventKey});
  }

  render(){
    let headings = this.props.headings;
    let popoverHoverFocuses = headings.map(headingItem =>
      <Popover classNmae={"panel-popover-trigger"} id={headingItem.heading + "-popover"}>{headingItem.information}</Popover>);
    // let popoverHoverFocus = (
    //   <Popover classNmae={"panel-popover-trigger"} id={headings + "-popover"}>
    //     {this.props.informations}
    //   </Popover>
    // );

    /*let handleSelect = (eventKey) => {
      //alert(`selected ${eventKey}`);
      this.setState({selectedKey: eventKey});
    };*/

    // return(z
    //   <div className="-my-panel">
    //     <span className="-my-panel-heading">
    //       {heading + " "}
    //       <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverHoverFocus}>
    //         <span className="glyphicon glyphicon-question-sign question-sign">
    //         </span>
    //       </OverlayTrigger>
    //     </span>
    //     <hr className="-my-panel-seg"/>
    //   </div>
    // )

    return (
      <Tabs bsStyle="pills" activeKey={this.state.selectedKey} onSelect={this.handleSelect} style={{height: 'inherit'}}>
        {headings.map((headingItem, index) =>
          <Tab eventKey={index} key={index}
               title={
                 <div>
                   {headingItem.heading + ' '}
                   <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverHoverFocuses[index]}>
                     <span className="glyphicon glyphicon-question-sign question-sign"/>
                   </OverlayTrigger>
                 </div>}>
            {headings.length === 1 ? this.props.children : this.props.children[index]}
          </Tab>)}
      </Tabs>
    );
  }
}