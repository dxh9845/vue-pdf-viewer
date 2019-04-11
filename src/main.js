import Vue from 'vue'
import App from './App.vue'
import store from './store'
import PdfPlugin from './index';

Vue.use(PdfPlugin, {store});

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
