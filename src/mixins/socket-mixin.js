function getMixin(vm){
    const {socket} = vm.$options;
    if(socket){
       return socket.call(vm);
    }
}

const clientMixin = {
    data() {
        return {
            socketEvents : [] 
        }
    },
    mounted() {
        const socket = getMixin(this);
        if(socket) {
            this.socketEvents = Object.keys(socket);
            for(const key of this.socketEvents){
                this.$socket.on(key, socket[key]);
            }
        }
    },

    destroyed() {
        for(const ev of this.socketEvents) {
            this.$socket.off(ev);
        }
    }
}

export default clientMixin