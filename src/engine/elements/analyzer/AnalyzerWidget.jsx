
import React from 'react';
import { Port } from '../../../react-diagram';
const WIDTH = 100;
const HEIGHT = 40;
export default class AnalyzerWidget extends React.Component{
    componentDidMount(){
        this.ctx = this.canvas.getContext('2d');
        requestAnimationFrame(this.draw);
    }
    componentWillUnmount(){
        this.isUnmounted = true;
    }
    draw = () => {
        if(this.isUnmounted || !this.canvas){ return console.log(123); }
        let { element } = this.props;
        let dataArray = element.getByteTimeDomainData();
        
        this.ctx.fillStyle = '#f5f5f5';
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#2ead8a';
  
        this.ctx.beginPath();
  
        var sliceWidth = WIDTH * 1.0 / element.bufferLength;
        var x = 0;
  
        for(var i = 0; i < element.bufferLength; i++) {
     
          var v = dataArray[i] / 128.0;
          var y = v * HEIGHT/2;
  
          if(i === 0) {
            this.ctx.moveTo(x, y);
          } else {
            this.ctx.lineTo(x, y);
          }
  
          x += sliceWidth;
        }
  
        this.ctx.lineTo(WIDTH, HEIGHT/2);
        this.ctx.stroke();
        requestAnimationFrame(this.draw);
    };
    render(){
        let { diagram, node, setData, element } = this.props;
        let { id, data, title, ports = [] } = node;
        return (
            <div className='module analyzer'>
                <div>
                    <div className='title'>Analyzer</div>
                    <div className='controls_section'>
                        <canvas ref={el => this.canvas = el} className='analyzer_canvas' width={WIDTH} height={HEIGHT}></canvas>
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