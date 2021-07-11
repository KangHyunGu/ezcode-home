import Vue from "vue";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const options = {
    // You can set your default options here
    position: "bottom-center",
    timeout: 3000
};

Vue.config.errorHandler = (e) => {
    console.error(e);
    if(Vue.$toast) {
        Vue.$toast.error(e.message);
    }
}


Vue.use(Toast, options);