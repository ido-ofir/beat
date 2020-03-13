
import React from 'react';

export default class Port extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            hovered: false
        };
    }
    shouldComponentUpdate(props, state){
        return (props.port !== this.props.port || state !== this.state);
    }
    onMouseEnter = () => {
        this.setState({ hovered: true });
    };
    onMouseLeave = () => {
        this.setState({ hovered: false });
    };
    render(){
        let {diagram, port} = this.props;
        let {hovered} = this.state;
        return (
            <div 
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                data-port-id={port.id}
                style={{width: 20, height: 20, background: hovered ? 'green' : 'blue'}}>

            </div>
        );
    }
}