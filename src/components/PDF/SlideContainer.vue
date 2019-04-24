<template>
    <div :class="_classes" 
        class='slide-container'>
        <UploadButton v-if='showUpload'></UploadButton>
        <LoadingSpinner v-if='showLoading'></LoadingSpinner>
        <PDFViewer v-show='showPDF'></PDFViewer>
        <ResizeGrip></ResizeGrip>
    </div>
</template>

<script>
import { UploadButton, LoadingSpinner, ResizeGrip } from '../Common/index.js';
import PDFViewer from './PDFViewer.vue';
import _ from 'lodash';

import { mapState } from 'vuex';
import { SLIDE_NOT_LOADED, SLIDE_LOADING, SLIDE_LOADED } from '../../services/pdf.utils.js'; 
import { RESIZE_CONTAINER } from '../../store/actions.type';

export default {
    name: 'slide-container',
    props: {
        responsive: {
            type: Boolean,
            default: true
        },
    },
    components: {
        PDFViewer,
        LoadingSpinner,
        UploadButton,
        ResizeGrip
    },
    methods: {
        dispatchContainerSize() {
            const { clientWidth, clientHeight } = this.$el;
            this.$store.dispatch(RESIZE_CONTAINER, { clientHeight, clientWidth });
        }
    },
    mounted() {
        this.dispatchContainerSize();
        this.debouncedResize = _.throttle(this.dispatchContainerSize, 100, {});
        window.addEventListener('resize', this.debouncedResize)
    },
    computed: {
        ...mapState({
            showUpload: state => (state.SlideModule.slideStatus === SLIDE_NOT_LOADED),
            showLoading: state => (state.SlideModule.slideStatus === SLIDE_LOADING),
            showPDF: state => (state.SlideModule.slideStatus === SLIDE_LOADED),
        }),
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.debouncedResize)
    }

}
</script>

<style>
.slide-container {
    width: 100%;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
}

.light {
    background-color: #ececec;
    color: #000;
}

.dark {
    background-color: #000;
    color: #FFF;
}

.bottom {
    justify-self: flex-end;
    bottom: 0;
}
</style>