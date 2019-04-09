import pdfjsLib from 'pdfjs-dist/webpack.js';
import themeMixin from './mixins/theme.mixin';
import slideContainer from '../components/SlideContainer';
import slideModule from './store/slides.js';
import themeCss from './slide-theme.css'

export function install(Vue, { store }) {
    if (install.installed) return;

    if (!store) {
        throw new Error('Vue-pdf-viewer requires a Vuex store to function.')
    }

    // Register our theme mixin
    Vue.mixin(themeMixin);
    // Register our component
    Vue.component('slide-viewer', slideContainer)
    // Register the PDF JS Library
    Vue.prototype.$pdfjsLib = pdfjsLib;
    // Register the PDF js library off the store
    store.prototype.$pdfjsLib = pdfjsLib;
    // Add our modules
    store.registerModule(slideModule);

    install.installed = true;
}

const PDFPlugin = { 
    install
}

let GlobalVue = null;
if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
}

if (GlobalVue) {
    GlobalVue.use(PDFPlugin)
}


export default PDFPlugin;
export { slideContainer, themeMixin }