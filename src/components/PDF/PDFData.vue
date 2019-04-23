<script>
import { LOAD_PDFJS } from '../../store/actions.type.js'
import { mapGetters } from 'vuex'

// import pdfjs from 'pdfjs-dist';
export default {
    name: 'PDFData',

    created() {
        // Import our PDF.js library on load
        const PDFPromise = import(
            /* webpackChunkName: 'pdfjs-dist' */ 
            'pdfjs-dist'
        );
        // Dispatch our load event 
        this.$store.dispatch(LOAD_PDFJS, PDFPromise);
    },

    computed: {
        ...mapGetters({ pages: 'loadedPages' })
    },
    // Pass our pages to children in scoped slots
    render(h) {
        return h('div', [
            this.$scopedSlots.document({ pages: this.pages })
        ]);
    }
}
</script>