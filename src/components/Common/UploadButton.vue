<template>
    <div class='upload-container'>
        <label class='upload-button'>
            <input @change="onFileChange" accept=".pdf" type='file' name='file' />
            📁 Upload PDF
        </label>

        <p>{{ infoText }}</p>
    </div>
</template>

<script>
import { UPLOAD_FILE } from '../../store/actions.type';
import { mapGetters } from 'vuex';

export default {
    name: 'upload-button',
    computed: {
        ...mapGetters({
            infoText: 'slideStatusText'
        })
    },
    methods: {
        /**
         * Receive the file change and dispatch it to our store
         * @param {}
         */
        onFileChange(ev) {
            var files = ev.target.files || ev.dataTransfer.files;
            if (!files.length)
                return;
            this.tempFile = files[0];
            // Tell other components we've uploaded a file
            this.$store.dispatch(UPLOAD_FILE, this.tempFile)
        }
    }
}
</script>

<style>
.upload-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.upload-button {
    border: 1px solid black;
    padding: 6px 12px;
    cursor: pointer;
}

.upload-button > input {
    display: none;
}
</style>
