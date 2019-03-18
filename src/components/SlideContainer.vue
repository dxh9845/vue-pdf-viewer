<template>
    <div :class="_classes" 
        class='slide-container'>
        <upload-button></upload-button>
        <pdf-wrapper></pdf-wrapper>
    </div>
</template>

<script>
import pdfWrapper from './PDFWrapper';
import uploadButton from './UploadButton'
import { mapState } from 'vuex';

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
        uploadButton
    }
}
</script>

<style>
.slide-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
</style>