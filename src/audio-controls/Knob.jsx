
import React from 'react';

export default class Knob extends React.Component {

    constructor(props) {
        super(props);

        this.knobRef = React.createRef();
    }
    
    componentDidMount = () => {
        this.knobRef['current'].addEventListener('input', this.onKnobChange);
    }
    componentWillUnmount = () => {
        this.knobRef['current'].removeEventListener('input', this.onKnobChange);
    }

    onKnobChange = (e) => {
        this.props.callback({ frequency: parseInt(e.target.value)});
    }
    
    render() {
        let { value, step, min, max, sprites, src, ...rest } = this.props;
        return (
            <webaudio-knob 
                ref={this.knobRef}
                data-ignore 
                src={src}
                sprites={sprites || 100}
                min={min || 1} 
                max={max}
                step={step || 1}
                value={value}
                { ...rest }
            />
        );
    }
};