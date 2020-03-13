
import React from 'react';
import { Port } from '../../react-diagram';
import BeatContext from '../../BeatContext';

export default class FilterWidget extends React.Component{
    static contextType = BeatContext;
    render(){
        let { diagram, node, setData } = this.props;
        let { id, x, y, title, ports = [], data } = node;
        return (
            <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Port key={ports[0].id} port={ports[0]} diagram={diagram}/>
                </div>
                <div>
                    Filter
                    <input 
                        type="range" 
                        data-ignore 
                        min={40} 
                        max={22500}
                        value={data.frequency || 440} 
                        onChange={e => setData({ frequency: parseInt(e.target.value)})}/>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Port key={ports[1].id} port={ports[1]} diagram={diagram}/>
                </div>
            </div>
        );
    }
}