

export default class Sample {
    constructor(audioContext, node, data){
        this.audioContext = audioContext;
        this.node = node;
        this.connections = {};
        if(node.data && node.data.url){
            this.loadSample(node.data.url);
        }
    }
    
    play = (time = 0) => {
        if(this.buffer){
            this.source = this.audioContext.createBufferSource();
            this.source.buffer = this.buffer;
            this.source.start(time);
            for(var key in this.connections){
                this.source.connect(this.connections[key]);
            }
        }
    };
    
    connect = (id, element) => {
        this.connections[id] = element.element;
    };
    disconnect = (id) => {
        delete this.connections[id];
    };
    update = (node) => {

        // update

        this.node = node;
    };
    loadSample = (url) => {
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        request.onload = () => {
            this.audioContext.decodeAudioData(
                request.response, 
                this.onLoaded, 
                this.onError
            );
        }
        request.send();
    };
    onLoaded = (buffer) => {
        this.buffer = buffer;
    };
    onError = (err) => {
        throw err;
    };
}