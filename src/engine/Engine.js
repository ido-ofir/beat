
import {Sample, SampleWidget} from './sample';
import {Speaker, SpeakerWidget} from './speaker';
import {Filter, FilterWidget} from './filter';

let types = {
    sample: Sample,
    speaker: Speaker,
    filter: Filter,
};
export default class Engine {
    constructor(diagramData){

        let AudioContext = window.AudioContext||window.webkitAudioContext;
        this.audioContext = new AudioContext();

        this.data = diagramData;
        this.elements = {};
        if(diagramData.nodes){
            this.addNodes(diagramData.nodes);
            if(diagramData.links){
                this.addLinks(diagramData.links)
            }
        }
    }
    getElement(id){
        return this.elements[id];
    }
    getWidgets(){
        return {
            nodes: {
                sample: SampleWidget,
                speaker: SpeakerWidget,
                filter: FilterWidget,
            }
        }
    }
    addNodes = (nodes = []) => {
        nodes.map(node => {
            let Type = types[node.type];
            if(Type){
                this.elements[node.id] = new Type(this.audioContext, node, this.data);
            }
        });
    };
    addLinks = (links = []) => {
        links.map(link => {
            if(link.toPort){
                this.connect(link.fromPort[0], link.toPort[0], link);
            }
        });
    };
    remove = (nodeId) => {
        delete this.elements[nodeId];
    };
    connect = (fromNodeId, toNodeId) => {
        let fromElement = this.elements[fromNodeId];
        let toElement = this.elements[toNodeId];
        fromElement.connect(toNodeId, toElement);
    };
    disconnect = (fromNodeId, toNodeId) => {
        let fromElement = this.elements[fromNodeId];
        if(fromElement){
            fromElement.disconnect(toNodeId);
        }
    };
    update = (node) => {
        let element = this.elements[node.id];
        if(element){
            element.update(node);
        }
    };
}