<template>
    <div class='pdf-document'>
        <PDFPage v-for="page in pages" :page='page' :key="page.pageNumber" :initial-scale="2"></PDFPage>
    </div>
</template>

<script>
import PDFPage from './PDFPage.vue'

export default {
    name: 'PDFDocument',
    props: {
        pages: {
            required: true,
        }
    },
    components: {
        PDFPage
    }
}
</script>

<style>

</style>
