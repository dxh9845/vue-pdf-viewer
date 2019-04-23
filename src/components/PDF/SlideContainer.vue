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
    mounted() {
        this.$store.dispatch(RESIZE_CONTAINER, this.$el.clientHeight);
    },
    computed: {
        ...mapState({
            showUpload: state => (state.SlideModule.slideStatus === SLIDE_NOT_LOADED),
            showLoading: state => (state.SlideModule.slideStatus === SLIDE_LOADING),
            showPDF: state => (state.SlideModule.slideStatus === SLIDE_LOADED),
        }),
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