
import React from 'react';
import { Port } from '../../../react-diagram';

export default class KeyboardWidget extends React.Component{

    render(){
        let { diagram, node, setData, element } = this.props;
        let { id, data, title, ports = [] } = node;

        return (
            <div className='module keyboard'>
                <div className='keyboard_controller'>
                    <webaudio-keyboard keys="25" ></webaudio-keyboard>
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