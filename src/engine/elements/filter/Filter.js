

export default class Filter {
    constructor(audioContext, node){
        this.audioContext = audioContext;
        this.node = node;
        this.connections = {};
        this.element = audioContext.createBiquadFilter();
        
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
        // console.log(data)
        this.element.type = data.filterType || 'lowpass';
        this.element.frequency.value = data.frequency || 440;
        this.element.Q.value = data.resonance;
        this.node = node;
    };
}