import pdfjsLib from 'pdfjs-dist/webpack.js';
import themeMixin from './theme.mixin';
import themeCss from  '../assets/slide-theme.css';
import slideContainer from '../components/SlideContainer';
import Vuex from 'vuex';

const optionDefaults = {
    
}

export default { 
    install(Vue, opts) {
        // Register our theme mixin
        Vue.mixin(themeMixin);
        Vue.component('slide-viewer', slideContainer)
        Vue.prototype.$pdfjsLib = pdfjsLib;
        Vuex.Store.prototype.$pdfjsLib = pdfjsLib;
    }
}

export { slideContainer, themeMixin }