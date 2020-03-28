
import React from 'react';
import { Port } from '../../../react-diagram';
import Knob from '../../../audio-controls/Knob';

let types = [
    {
        "label": "Square",
        "value": "square"
    },
    {
        "label": "Sine",
        "value": "sine"
    },
    {
        "label": "Sawtooth",
        "value": "sawtooth"
    },
    {
        "label": "Triangle",
        "value": "triangle"
    }
]

export default class OscillatorWidget extends React.Component{

    render(){
        let { diagram, node, setData, element } = this.props;
        let { id, data, title, ports = [] } = node;

        return (
            <div className='module osc'>
                <div className='title'>Oscillator</div>
                <div className='knob_wrapper'>
                    <Knob
                        src="/images/LittlePhatty.png" 
                        sprites="100"
                        min={1} 
                        max={700}
                        step={1}
                        value={data.frequency || 440}
                        callback={setData} 
                    />
                    <span className='sub_title'>Frequency</span>
                </div>
                <div className='controls_section'>
                    <div data-ignore className='controls_wrapper'>
                        <select value={data.type} onChange={e => setData({type: e.target.value})}>
                            { types.map(type => <option key={type.value} value={type.value}>{type.label}</option> ) }
                        </select>
                    </div>
                    <div data-ignore className='controls_wrapper'>
                        <button onClick={element.start} className='play_btn'>&#9658;</button>
                        <button onClick={element.stop}  className='stop_btn'>&#9724;</button>
                    </div>
                </div>
                <div className='ports_container'>
                    {ports.map((port, idx) => 
                        <div key={port.id} className='port_container'>
                            <span className='port_name'>{idx === 0 ? 'in' : 'out'}</span>
                            <Port port={port} diagram={diagram}/>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}