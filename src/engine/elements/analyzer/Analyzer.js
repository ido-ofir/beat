

export default class Analyzer {
    constructor(audioContext, node, data){
        this.audioContext = audioContext;
        this.node = node;
        this.connections = {};
        this.element = audioContext.createAnalyser();
        this.element.fftSize = 2048;
        this.bufferLength = this.element.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
    }
    update = (node) => {

        // update
        if(this.element){

        }
        
        
        this.node = node;
    };
    getByteTimeDomainData = () => {
        this.element.getByteTimeDomainData(this.dataArray);
        return this.dataArray;
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