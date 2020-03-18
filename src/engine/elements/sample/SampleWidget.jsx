
import React from 'react';
import { Port } from '../../../react-diagram';

let samples = [
    {
        "label": "Kick 1",
        "src": "http://localhost:8080/samples/kick-1.mp3"
    },
    {
        "label": "Snare 1",
        "src": "http://localhost:8080/samples/snare-1.mp3"
    }
]

export default class SampleWidget extends React.Component{
    play = () => {
        let { element } = this.props;
        if(element){
            element.play();
        }
    };
    stop = () => {
        let { element } = this.props;
        if(element){
            element.stop();
        }
    };
    render(){
        let { diagram, node, setData } = this.props;
        let { id, data, title, ports = [] } = node;
        return (
            <div style={{ display: 'flex' }}>
                
                <div>
                    <div style={{ padding: 10 }}>Sample</div>
                    <div data-ignore>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <select value={data.url} onChange={e => setData({url: e.target.value})}>
                                {
                                    samples.map(sample => 
                                        <option key={sample.src} value={sample.src}>{sample.label}</option>    
                                    )
                                }
                            </select>
                        </div>
                        <div data-ignore style={{ display: 'flex', justifyContent: 'center' }}>
                            <button onClick={this.play}>Play</button>
                            <button onClick={this.stop}>Stop</button>
                        </div>
                        <div data-ignore style={{ display: 'flex', justifyContent: 'center' }}>
                            Loop <input type="checkbox" checked={data.loop} onChange={e => setData({ loop: e.target.checked })}/>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', fontSize: '28px'}}>
                        🎼
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {ports.map(port => 
                            <Port key={port.id} port={port} diagram={diagram}/>
                    )}
                </div>
            </div>
        );
    }
}