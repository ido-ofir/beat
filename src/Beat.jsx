import React from 'react';
import Diagram, { Port } from './react-diagram';
import dummyData from './dummtData.json';
import Engine from './engine';

export default class Beat extends React.Component{
    constructor(props){
        super(props);
        this.engine = new Engine(dummyData);
        this.audioContext = this.engine.audioContext;
        window.top.beat = this;
    }

    onEvent = (e, diagram) => {
        // console.log(e)
        if(e.type === 'addNodes'){
            this.engine.addNodes(e.nodes);
        }
        else if(e.type === 'nodeDidConnect'){
            let link = diagram.getLink(e.linkId)
            this.engine.connect(
                link.fromPort[0],
                e.nodeId
            );
        }
        else if(e.type === 'delete'){
            for(let l in e.links){
                let link = e.links[l];
                if(link.toPort && link.toPort[0]){
                    this.engine.disconnect(
                        link.fromPort[0], 
                        link.toPort[0]
                    );
                }
            }
            for(let n in e.nodes){
                this.engine.remove(n);
            }
        }
        else if(e.type === 'nodesUpdated'){
            for(let n in e.nodes){
                this.engine.update(e.nodes[n]);
            }
        }
    };

    getNodeProps = (node) => {
        return {
            element: this.engine.getElement(node.id)
        };
    };
    
    render(){
        return (
            <div style={{ height: '100%', width: '100%'}}>
                <Diagram
                    data={dummyData}
                    onEvent={this.onEvent}
                    widgets={this.engine.getWidgets()}
                    getNodeProps={this.getNodeProps} />
            </div>
        );
    }
}