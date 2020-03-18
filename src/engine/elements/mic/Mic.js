

export default class Mic {
    constructor(audioContext, node){
        this.audioContext = audioContext;
        this.node = node;
        this.connections = {};
        if(node.data.active){
            this.getLiveAudio().then(liveIn => {
                this.element = liveIn;
                for(var m in this.connections){
                    this.element.connect(this.connections[m]);
                }
            });
        }
    }
    update = (node) => {

        if(node.data.active !== this.node.data.active){
            if(node.data.active){
                if(!this.element){
                    this.getLiveAudio().then(liveIn => {
                        this.element = liveIn;
                        for(var m in this.connections){
                            this.element.connect(this.connections[m]);
                        }
                    });
                }
                else{
                    for(var m in this.connections){
                        this.element.connect(this.connections[m]);
                    }
                }
            }
            else{
                for(var m in this.connections){
                    this.element.disconnect(this.connections[m]);
                }
            }
        }
        
        this.node = node;
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
    getLiveAudio = () => {
        return navigator.mediaDevices.getUserMedia({audio: {
            latency: 0.0001,
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false
          }})
        .then(stream => {
            this.stream = stream;
            return this.audioContext.createMediaStreamSource(stream)
        });
    };
}