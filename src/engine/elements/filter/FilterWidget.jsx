
import React from 'react';
import { Port } from '../../../react-diagram';
import Knob from '../../../audio-controls/Knob';
import Switch from '../../../audio-controls/Switch';

let types = [
    {
        "label": "Lowpass",
        "value": "lowpass"
    },
    {
        "label": "Highpass",
        "value": "highpass"
    }
];

export default class FilterWidget extends React.Component{
    render(){
        let { diagram, node, setData } = this.props;
        let { id, x, y, title, ports = [], data } = node;

        if(!this.bypass) {
            if(!data.bypass) {
                this.currentValues = {
                    res: data.resonance,
                    freq: data.frequency
                }
            }
            this.bypassed = true;
        }
        let disabledClass = data.bypass ? "disabled" : "";

        return (
            <div className='module filter'>
            <div className='title'>Filter</div>
            <div className={disabledClass + ' contros_wrapper'}>
                <div className="osc_knob_wrapper">
                    <div className="knob_wrapper">
                        <span className='osc_knob_label'>Freq</span>
                        <span className="knob_label">{data.bypass ? this.currentValues.freq : data.frequency || 440}</span>
                    </div>
                    <Knob
                        src="/images/LittlePhatty.png" 
                        sprites="100"
                        min={27} 
                        max={20000}
                        sensitivity={.2}
                        step={1}
                        value={data.bypass ? this.currentValues.freq : data.frequency}
                        diameter={68}
                        callback={val => setData({ frequency: val.value })} 
                    />
                </div>
                <div className="osc_knob_wrapper">
                    <div className="knob_wrapper">
                        <span className='osc_knob_label'>Res</span>
                        <span className="knob_label">{data.bypass ? this.currentValues.res * 4 : data.resonance * 4}%</span>
                    </div>
                    <div className="filter_res_knob">
                        <Knob
                            src="/images/MiniMoog_Main.png" 
                            sprites="100"
                            min={0} 
                            max={25}
                            sensitivity={.5}
                            step={1}
                            value={data.bypass ? this.currentValues.res : data.resonance}
                            diameter={48}
                            callback={val => setData({ resonance: val.value })} 
                        />
                    </div>
                </div>
            </div>
            <div className='controls_section'>
                <div data-ignore className='controls_wrapper'>
                    <div className="flex_column_center">
                        <select className={disabledClass} value={data.filterType} onChange={e => setData({filterType: e.target.value})}>
                            { types.map(type => <option key={type.value} value={type.value}>{type.label}</option> ) }
  >                      </select>
                        <div className="switch_container">
                            <span className='osc_knob_label'>Active</span>
                            <span className={data.bypass ? "bypass_light bypass_on" : "bypass_light bypass_off"}></span>
                            <Switch 
                                value={data.bypass} 
                                callback={e => setData({bypass: !data.bypass, resonance: data.bypass ? this.currentValues.res : 0, frequency: data.bypass ? this.currentValues.freq : data.filterType === 'lowpass' ? 20000 : 27})} 
                            />
                        </div>
                    </div>
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