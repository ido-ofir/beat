
import React from 'react';
import { Port } from '../../../react-diagram';
// import Knob from '../../../audio-controls/Knob';
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
        this.oct = 0;
        this.note = 0;
    }

    handleOctave = (e) => {
        let { setData } = this.props;
        let oct = e.target.value;
        let freq = oct < 0 && this.oct < 0 ? (oct > this.oct ? this.baseFreq / 2 : this.baseFreq  * 2) : (oct > this.oct ? this.baseFreq * 2 : this.baseFreq  / 2);
        this.baseFreq = freq;
        this.oct = oct;

        this.setState({ octave: oct});
        setData({frequency: freq});
    }

    handleNote = (e) => {
        let { setData } = this.props;
        let note = e.target.value;
       
        
        // this.baseFreq = freq;
        // this.note = note;

        this.setState({ note });
        // setData({frequency: freq});
    }

    render(){
        let { diagram, node, setData, element } = this.props;
        let { octave, note } = this.state;
        let { id, data, title, ports = [] } = node;
        console.log(this.baseFreq)

        return (
            <div className='module osc'>
                <div className='title'>Oscillator</div>
                <div className='knob_wrapper'>
                    <NumberSelector label="Octave" onChange={this.handleOctave} value={octave} min={-3} max={3} step={1} />
                    <NumberSelector label="Note" onChange={this.handleNote} value={note} min={0} max={11} step={1} />
                    {/* <Knob
                        src="/images/LittlePhatty.png" 
                        sprites="100"
                        min={0} 
                        max={11}
                        step={1}
                        value={note}
                        callback={this.handleNote} 
                    /> */}
                    {/* <span className='sub_title'>Frequency</span> */}
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