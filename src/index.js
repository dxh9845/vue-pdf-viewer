import ThemeMixin from './mixins/theme.mixin';
import SlideContainer from './components/PDF/SlideContainer.vue';
import SlideModule from './store/slides.js';
import ThemeCss from './slide-theme.css'

export { ThemeMixin, ThemeCss };

function install(Vue, { store }) {
    if (install.installed) return;

    if (!store) {
        throw new Error('Vue-pdf-viewer requires a Vuex store to function.');
    }

    // Register our theme mixin
    Vue.mixin(ThemeMixin);
    // Add our modules
    store.registerModule('SlideModule', SlideModule);
    // Register our component
    Vue.component('SlideContainer', SlideContainer);
    
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