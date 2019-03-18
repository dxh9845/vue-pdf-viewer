<template>
  <div id="app">
    <slide-container variant='dark' style='min-height: 50vh;'></slide-container>
    <!-- <PDFData url='http://www.africau.edu/images/default/sample.pdf'></PDFData> -->
  </div>
</template>

<script>
import SlideContainer from '@/components/SlideContainer.vue';
// import PDFData from '@/components/PDFData.vue';

export default {
  name: 'app',
  components: {
    // PDFData
    SlideContainer
  }
}
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
