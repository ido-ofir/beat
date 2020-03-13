
import React from 'react';
import { Port } from '../../react-diagram';

export default class SpeakerWidget extends React.Component{
    render(){
        let { diagram, node } = this.props;
        window.top.Sample = this;
        let { id, x, y, title, ports = [] } = node;
        return (
            <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {ports.map(port => 
                            <Port key={port.id} port={port} diagram={diagram}/>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '32px', padding: '4px 4px 4px 10px' }}>
                    🔈
                </div>
            </div>
        );
    }
}