
import React from 'react';
import { Port } from '../../react-diagram';
import BeatContext from '../../BeatContext';

export default class SampleWidget extends React.Component{
    static contextType = BeatContext;
    play = () => {
        let { node } = this.props;
        let sample = this.context.engine.getElement(node.id);
        if(sample){
            sample.play();
        }
    };
    render(){
        let { diagram, node } = this.props;
        window.top.Sample = this;
        let { id, x, y, title, ports = [] } = node;
        return (
            <div style={{ display: 'flex' }}>
                
                <div>
                    <div style={{ padding: 10 }}>Sample</div>
                    <div data-ignore style={{ display: 'flex', justifyContent: 'center' }}>
                        <button onClick={this.play}>Play</button>
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