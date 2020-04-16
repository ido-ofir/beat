

export default class Sample {
    constructor(audioContext, node, data){
        this.audioContext = audioContext;
        this.node = node;
        this.connections = {};
        if(node.data && node.data.url){
            this.loadSample(node.data.url);
        }
    }
    
    play = (time) => {
        this.stop();
        if(this.buffer){
            // this.source = new AudioBufferSourceNode(this.audioContext, this.buffer);
            this.source = this.audioContext.createBufferSource();
            this.source.buffer = this.buffer;
            this.source.loop = this.node.data.loop || false;
            this.source.start(0, time);
            for(var key in this.connections){
                this.source.connect(this.connections[key]);
            }
        }
    };
    
    stop = () => {
        if(this.source) this.source.stop();
    };

    connect = (id, element) => {
        this.connections[id] = element.element;
    };
    disconnect = (id) => {
        if(this.source){
            this.source.disconnect(this.connections[id]);
        }
        delete this.connections[id];
    };
    update = (node) => {

        // update
        if(node.data.url !== this.node.data.url){
            this.loadSample(node.data.url);
        }
        if(this.source && (node.data.loop !== this.node.data.loop)){
            this.source.loop = node.data.loop;
        }
        this.node = node;
    };
    loadSample = (url) => {
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        if(this.source){
            this.source.stop();
        }
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