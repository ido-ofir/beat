
import React from 'react';
import { Port } from '../../../react-diagram';

export default class MicWidget extends React.Component{
    render(){
        let { diagram, node, setData } = this.props;
        let { id, x, y, title, ports = [], data } = node;
        return (
            <div style={{ display: 'flex' }}>
                
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '32px', padding: '4px 4px 4px 10px' }}>
                    🎤
                    </div>
                    <div data-ignore>
                        Active <input type="checkbox" checked={data.active} onChange={e => setData({active: e.target.checked})}/>
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