import Vue from 'vue'
import App from './App.vue'
import store from './store';
import axios from 'axios';

axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'https://backend-server.com/' : 'http://localhost:3000';

new Vue({
    store,
    el: '#app',
    render: h => h(App)
})
