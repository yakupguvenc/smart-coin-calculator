import Vue from 'vue'
import App from './App.vue'
import CurrencyInput from 'vue-currency-input'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import '@/assets/custom.css';
import router from './router'

window.getCookie = function getCookie(name) {
    let cookieName = name + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return JSON.parse(c.substring(cookieName.length, c.length));
        }
    }
    return "";
}

Vue.use(CurrencyInput)
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
