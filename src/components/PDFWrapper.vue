<template>
    <div class='pdf-viewer' v-if="showPdf">
        <header class='pdf-header'>
            <button @click="slideChange(-1)">
                Previous
            </button>
            <span>
                Page {{ currentSlideNum }} of {{ numPages }}
            </span>
            <button @click="slideChange(1)">
                Next >
            </button>
        </header>
        <pdf-page v-for="page in pages" :page="page" :key="page.pageNumber" :scale="1.0"></pdf-page>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import pdfPage from './PDFPage';

import { CHANGE_SLIDE } from '@/store/actions.type';

export default {
    name: 'pdf-wrapper',
    computed: {
        ...mapState({
            pages: state => state.SlideModule.pdfPages,
            showPdf: state => state.SlideModule.slideStatus == 2,
            numPages: state => state.SlideModule.numPages,
            currentSlideNum: state => (state.SlideModule.currentSlideIndex + 1),
        }),

    },
    components: {
        pdfPage
    },
    methods: {
        slideChange(changeVal) {
            this.$store.dispatch(CHANGE_SLIDE, changeVal);
        },
        keyChange(ev) {
            let changeVal;
            switch (ev.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    changeVal = 1
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    changeVal = -1;
                    break;
                default:
                    break;
            }

            if (changeVal) {
                this.slideChange(changeVal)                
            }
        }
    },
    created() {
        window.addEventListener('keydown', this.keyChange);
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.keyChange)
    },
}
</script>

<style>
.pdf-viewer {
    width: 100%;
}

.pdf-header {
    display: flex;
    padding: .5rem 0;
    justify-content: space-around;
    background-color:rgba(0, 0, 0, .5);
    text-align: center;
    color: #FFF;
    width: 100%;
}

</style>
