import Vue from 'vue'
import Vuex from 'vuex'
import SlideModule from './store/slides';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    SlideModule
  }
})
