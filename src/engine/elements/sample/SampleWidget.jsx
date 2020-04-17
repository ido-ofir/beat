
import React from 'react';
import { Port } from '../../../react-diagram';

let samples = [
    {
        "label": "Trance",
        "src": "http://localhost:8080/samples/Trance-Demo.mp3"
    },
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

    constructor(props) {
        super(props);

        this.state = {
            currentTime: 0
        };
    }

    play = (e, time = 0) => {
        let { element } = this.props;
        if(element){
            element.play(time * 1);
            this.startClock(time * 1);
        }
    };
    stop = () => {
        let { element } = this.props;
        if(element){
            element.stop();
            this.resetClock();
        }
    };

    seek = (e) => {
        let skipToTime = e.target.value * 1;
        this.play(e, skipToTime);
        this.setState({ currentTime: skipToTime })
    };

    startClock = (from) => {
        let { element } = this.props;
        this.startTime = element.audioContext.currentTime - from;
        if(this.clock) return;
        this.clock = setInterval(this.updateTime, 100);
    };

    resetClock = () => {
        if(this.clock) {
            clearInterval(this.clock);
            this.clock = null;
        };
        this.setState({ currentTime: 0 });
    };

    updateTime = () => {
        let { element, node } = this.props;
        let duration = element.buffer.duration;
        let isLooping = node.data.loop;
        let currentTime = element.audioContext.currentTime - this.startTime;

        if (!isLooping && currentTime >= duration) {
            return this.resetClock();
        }
        this.setState({ currentTime: currentTime % duration });
    };

    changeSource = (e) => {
        let { setData } = this.props;

        this.stop();
        setData({ url: e.target.value });
    }

    render(){
        let { diagram, node, setData, element } = this.props;
        let { currentTime } = this.state;
        let { id, data, title, ports = [] } = node;
        console.log(element, currentTime);

        return (
            <div className='module sampler'>
                <div className='title'>Sampler</div>

                <div className='controls_section'>
                    <div data-ignore className='controls_wrapper'>
                        <select value={data.url} onChange={this.changeSource}>
                            { samples.map(sample => <option key={sample.src} value={sample.src}>{sample.label}</option>) }
                        </select>
                        <div className='loop_container'>
                            <input type="checkbox" checked={data.loop} onChange={e => setData({ loop: e.target.checked })}/>
                            Repeat
                        </div>
                    </div>
                    <div className="sampler_seek_slider_container">
                        <input className="slider" type="range" onChange={this.seek} min={0} max={element.buffer && element.buffer.duration || 0} value={currentTime} />
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