<template>
  <div id="app">
    <slide-container variant='light' style='min-height: 50vh;'></slide-container>
  </div>
</template>

<script>
import SlideContainer from '@/components/SlideContainer.vue';

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
