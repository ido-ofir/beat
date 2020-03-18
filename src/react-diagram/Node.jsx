
import React from 'react';
import Port from './Port';

export default class Node extends React.Component{
    shouldComponentUpdate(props, state){
        return (props.node !== this.props.node) || (props.selected !== this.props.selected);
    }
    getBoundingRect = () => {
        return this.refs.node.getBoundingClientRect();
    };
    setData = (data, updateLinks) => {
        let { diagram, node } = this.props;
        diagram.setNode({
            id: node.id,
            data: { ...node.data, ...data }
        }, updateLinks);
    };
    renderDefault = () => {
        let { diagram, node } = this.props;
        return (
            <>
                <div style={{ whiteSpace: 'nowrap', padding: 10 }}>{node.title}</div>
                <div>
                    {node.ports.map(port => 
                        <Port key={port.id} port={port} diagram={diagram}/>
                    )}
                </div>
            </>
        )
    };
    render(){
        let { diagram, node, selected, widgets, getNodeProps } = this.props;
        let { id, x, y, title, ports = [], type } = node;
        let NodeWidget;
        if(type){
            NodeWidget = widgets && widgets[type];
        }
        let props = getNodeProps ? getNodeProps(node) : {};
        return (
            <div 
                style={{ 
                    cursor: 'move',
                    position: 'absolute',
                    top: y,
                    left: x,
                    userSelect: 'none',
                    // border: `2px solid ${selected ? 'rgba(100,100,255)' : 'transparent'}`,
                    background: '#fff',
                    boxShadow: selected ? "rgba(0,0,255,0.9) 0px 0px 6px 6px" : 'none'
                }}
                ref="node"
                unselectable="on"
                data-node-id={id}>
                {
                    NodeWidget ? 
                        <NodeWidget 
                            diagram={diagram} 
                            node={node} 
                            setData={this.setData}
                            {...props}
                        /> 
                        : 
                        this.renderDefault()
                }
            </div>
        );
    }
};