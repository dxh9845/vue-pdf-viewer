var pdfjsLib = require('pdfjs-dist/build/pdf.js');
// var pdfWorker =  require('worker-loader!pdfjs-dist/build/pdf.worker.js');
// pdfjsLib.GlobalWorkerOptions.workerPort = new pdfWorker();

// console.log(pdfjsLib.PDFJS)
// pdfjsLib.PDFJS.disableWorker = true;
import ThemeMixin from './mixins/theme.mixin';
import SlideContainer from './components/SlideContainer.vue';
import slideModule from './store/slides.js';
import ThemeCss from './slide-theme.css'

export { SlideContainer, ThemeMixin };

function install(Vue, { store }) {
    if (install.installed) return;

    if (!store) {
        throw new Error('Vue-pdf-viewer requires a Vuex store to function.');
    }

    // Register the PDF JS Library
    Vue.prototype.$pdfjsLib = pdfjsLib;
    // Register the PDF js library off the store
    // Add our modules
    store.registerModule('SlideModule', slideModule);
    
    // Register our theme mixin
    Vue.mixin(ThemeMixin);
    // Register our component
    Vue.component('SlideContainer', SlideContainer)

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