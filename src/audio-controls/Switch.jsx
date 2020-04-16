
import React from 'react';

export default class Switch extends React.Component {

    constructor(props) {
        super(props);

        this.switchRef = React.createRef();
    }
    
    componentDidMount = () => {
        this.switchRef['current'].addEventListener('change', this.onSwitchToggle);
    }
    componentWillUnmount = () => {
        this.switchRef['current'].removeEventListener('change', this.onSwitchToggle);
    }

    onSwitchToggle = (e) => {
        this.props.callback({ value: parseInt(e.target.value)});
    }
    
    render() {
        let { value, step, min, max, diameter, sprites, src, ...rest } = this.props;
        return (
            <webaudio-switch 
                ref={this.switchRef}
                src="/images/switch_toggle.png" 
                width="54" 
                height="54"
            ></webaudio-switch>
        );
    }
};