
import React from 'react';
import { Port } from '../../../react-diagram';

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
            <div style={{  }}>
                
                <div>
                    <div style={{ padding: 10 }}>Oscillator</div>
                    <div data-ignore style={{ display: 'flex', justifyContent: 'center' }}>
                        <button onClick={element.start}>Start</button>
                        <button onClick={element.stop}>Stop</button>
                    </div>
                    <div data-ignore>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <select value={data.type} onChange={e => setData({type: e.target.value})}>
                                {
                                    types.map(type => 
                                        <option key={type.value} value={type.value}>{type.label}</option>    
                                    )
                                }
                            </select>
                        </div>
                    </div>
                    <div>
                    Frequency
                        <input 
                            type="range" 
                            data-ignore 
                            min={1} 
                            max={1000}
                            step={1}
                            value={data.frequency || 440} 
                            onChange={e => setData({ frequency: parseInt(e.target.value)})}/>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', fontSize: '28px'}}>
                        ∿
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {ports.map(port => 
                            <Port key={port.id} port={port} diagram={diagram}/>
                    )}
                </div>
            </div>
        );
    }
}