
import React from 'react';
import { Port } from '../../../react-diagram';

export default class DelayWidget extends React.Component{
    render(){
        let { diagram, node, setData } = this.props;
        let { id, x, y, title, ports = [], data } = node;
        return (
            <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Port key={ports[0].id} port={ports[0]} diagram={diagram}/>
                </div>
                <div>
                    Delay
                    <input 
                        type="range" 
                        data-ignore 
                        min={0.01} 
                        max={5}
                        step={0.01}
                        value={data.time || 0.5} 
                        onChange={e => setData({ time: parseFloat(e.target.value)})}/>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Port key={ports[1].id} port={ports[1]} diagram={diagram}/>
                </div>
            </div>
        );
    }
}