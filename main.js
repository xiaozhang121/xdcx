import Vue from 'vue'
import App from './App'
import util from "./common/utils/utility";
import config from "./common/config/config.js";

Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.util = util;
Vue.prototype.config = config;

const app = new Vue({
    ...App
})
app.$mount()
