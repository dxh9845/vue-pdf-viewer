<template>
    <div :class="_classes" 
        class='slide-container'>
        <upload-button></upload-button>
        <pdf-wrapper></pdf-wrapper>
        <resize-grip></resize-grip>
    </div>
</template>

<script>
import pdfWrapper from './PDFWrapper';
import uploadButton from './UploadButton'
import resizeGrip from './ResizeGrip';

import { RESIZE_CONTAINER } from '../store/actions.type';

export default {
    name: 'slide-viewer',
    props: {
        responsive: {
            type: Boolean,
            default: true
        },
    },
    components: {
        pdfWrapper,
        uploadButton,
        resizeGrip
    },
    mounted() {
        this.$store.dispatch(RESIZE_CONTAINER, this.$el.clientHeight);
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