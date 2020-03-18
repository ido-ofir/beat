

export default class Reverb {
    constructor(audioContext, node){
        this.audioContext = audioContext;
        audioContext.audioWorklet.addModule('http://localhost:8080/processors/reverb-processor.js').then((err) => {
            if(err){ throw err; }
            this.element = new AudioWorkletNode(audioContext, 'reverb-processor')
        })
        this.node = node;
        this.connections = {};
    }
    
    connect = (id, element) => {
        this.connections[id] = element.element;
        this.element.connect(this.connections[id]);
    };

    disconnect = (id) => {
        this.element.disconnect(this.connections[id]);
        delete this.connections[id];
    };

    update = (node) => {
        let data = node.data || {};
        this.node = node;
    };
}