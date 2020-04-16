
import React from 'react';
import { Port } from '../../../react-diagram';
import Knob from '../../../audio-controls/Knob';
import NumberSelector from '../../../audio-controls/NumberSelector';

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

    constructor(props) {
        super(props);

        this.state = {
            octave: 0,
            note: 0
        }
        this.baseFreq = 440;
    }

    handleFreqChange = (octave, note) => {
        let { setData } = this.props;
        octave = parseInt(octave, 10);
        note = parseInt(note, 10);
        let octaveSemitones = octave * 12;
        let semitones = octaveSemitones + note;

        let freq = this.baseFreq * Math.pow(2, semitones/12);
        
        this.setState({ octave, note });
        setData({frequency: freq});
    }

    render(){
        let { diagram, node, setData, element } = this.props;
        let { octave, note } = this.state;
        let { id, data, title, ports = [] } = node;

        return (
            <div className='module osc'>
                <div className='title'>Oscillator</div>
                <div className='contros_wrapper'>
                    <NumberSelector label="Octave" onChange={e => this.handleFreqChange(e.target.value, note)} value={octave} min={-3} max={3} step={1} />
                    {/* <NumberSelector label="Note" onChange={e => this.handleFreqChange(octave, e.target.value)} value={note} min={-11} max={11} step={1} /> */}
                    <div className="osc_knob_wrapper">
                        <div className="knob_wrapper">
                            <span className='osc_knob_label'>Note</span>
                            <span className="knob_label">{note}</span>
                        </div>
                        <Knob
                            src="/images/JP8000.png" 
                            sprites="100"
                            min={-12} 
                            max={12}
                            step={1}
                            value={note}
                            callback={data => this.handleFreqChange(octave, data.value)} 
                        />
                    </div>
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