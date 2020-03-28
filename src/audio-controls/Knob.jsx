
import React from 'react';

export default class Knob extends React.Component {
    
    componentDidMount() {
        let { callback } = this.props;

        var knobs = document.getElementsByTagName('webaudio-knob');
        for (var i = 0; i < knobs.length; i++) {
        var knob = knobs[i];
        knob.addEventListener('input', function(e) {
            callback({ frequency: parseInt(e.target.value)})
        });
        }
    }
    
    render() {
        let { value, step, min, max, sprites, src, ...rest } = this.props;
        return (
            <webaudio-knob 
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