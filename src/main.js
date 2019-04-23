import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VuePDFSlides from './index';

Vue.use(VuePDFSlides, {store});

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
