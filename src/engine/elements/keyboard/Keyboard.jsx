export default class Keyboard {
    constructor(audioContext, node, data){
        this.audioContext = audioContext;
        this.node = node;
        this.connections = {};
        this.element = audioContext.createOscillator();
        this.element.frequency.setValueAtTime(node.data.frequency, audioContext.currentTime);
        this.element.type = node.data.type;
    }
    update = (node) => {

        // update
        if(this.element){
            if(node.data.frequency !== this.node.data.frequency){
                this.element.frequency.setValueAtTime(node.data.frequency, this.audioContext.currentTime);
            }
            if(node.data.type !== this.node.data.type){
                this.element.type = node.data.type;
            }
        }
        
        
        this.node = node;
    };
    start = () => {
        if(!this.element){
            this.element = this.audioContext.createOscillator();
            this.element.frequency.setValueAtTime(this.node.data.frequency, this.audioContext.currentTime);
            this.element.type = this.node.data.type;
            for(let m in this.connections){
                this.element.connect(this.connections[m]);
            }
            this.element.start();
            this.isStarted = true;
        }
        else if(!this.isStarted){
            this.element.start();
            this.isStarted = true;
        }
    };
    stop = () => {
        if(this.isStarted){
            this.element.stop();
        }
        for(let m in this.connections){
            this.element.disconnect(this.connections[m]);
        }
        this.element = null;
    };
    connect = (id, element) => {
        this.connections[id] = element.element;
        if(this.element){
            this.element.connect(element.element);
        }
    };
    disconnect = (id) => {
        if(this.element){
            this.element.disconnect(this.connections[id]);
        }
        delete this.connections[id];
    };
}