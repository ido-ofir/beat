

export default class Delay {
    constructor(audioContext, node){
        this.audioContext = audioContext;
        this.node = node;
        this.connections = {};
        this.element = audioContext.createDelay(node?.data?.time || 0.5);
        
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
        let oldData = this.node.data || {};
        if(data.time !== oldData.time){
            this.element.delayTime.setValueAtTime(data.time, this.audioContext.currentTime);
        }
        this.node = node;
    };
}