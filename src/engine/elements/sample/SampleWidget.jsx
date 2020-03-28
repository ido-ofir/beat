
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
            <div className='module sampler'>
                <div className='title'>Sampler</div>

                <div className='controls_section'>
                    <div data-ignore className='controls_wrapper'>
                        <select value={data.url} onChange={e => setData({url: e.target.value})}>
                            { samples.map(sample => <option key={sample.src} value={sample.src}>{sample.label}</option>) }
                        </select>
                        <div className='loop_container'>
                            <input type="checkbox" checked={data.loop} onChange={e => setData({ loop: e.target.checked })}/>
                            Loop
                        </div>
                    </div>
                    <div data-ignore className='controls_wrapper'>
                        <button onClick={this.play} className='play_btn'>&#9658;</button>
                        <button onClick={this.stop}  className='stop_btn'>&#9724;</button>
                    </div>
                </div>
                <div className='ports_container'>
                    <div className='port_container'></div>
                    {ports.map((port, idx) => 
                        <div key={port.id} className='port_container'>
                            <span className='port_name'>out</span>
                            <Port port={port} diagram={diagram}/>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}