

export default class Speaker {
    constructor(audioContext, node, data){
        this.audioContext = audioContext;
        this.node = node;
        this.element = audioContext.destination;
    }
    update = (node) => {

        // update
        
        this.node = node;
    };
    connectIn = (node) => {

        // update
        
        this.node = node;
    };
    connectOut = (node) => {

        // update
        
        this.node = node;
    };
}