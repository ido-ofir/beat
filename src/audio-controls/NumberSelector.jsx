
import React, { createRef } from 'react';

export default class NumberSelector extends React.Component {

    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }
    
    componentDidMount() {
        this.inputRef['current'].addEventListener('keypress', (evt) => {
            evt.preventDefault();
        });
    }
    
    render() {
        let { min, max, step, label, ...rest } = this.props;
        return (
            <div className='number_selector'>
                <span className='number_selector_label'>{label}</span>
                <input 
                    ref={this.inputRef}
                    type="number" 
                    className='number_selector_input' 
                    min={min || 0} 
                    max={max || 10} 
                    step={step || 1} 
                    { ...rest }
                />
            </div>
        );
    }
};