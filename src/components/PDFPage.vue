<template>
  <canvas v-show="isCurrentPage" 
    :style="canvasStyle" 
    :width="canvasAttrs.width" 
    :height="canvasAttrs.height" 
    ref="canvas" 
    class='pdf-page'>
  </canvas>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    page: {
      type: Object,
      required: true
    },
    initialScale: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      scale: this.initialScale,
      viewport: this.page.getViewport(this.initialScale),
      renderTask: null,
      rendered: false,
    }
  },

  computed: {
    actualSizeViewport() {
      return this.viewport.clone({ scale: this.initialScale });
    },

    canvasStyle() {
      const { width: documentWidth, height: documentHeight } = this.actualSizeViewport;
      // Set the width of the document display through the height of the container 
      let pixelWidth = Math.ceil(((documentWidth *  this.pixelHeight) / documentHeight));
      return `width: ${pixelWidth}px; height: ${this.pixelHeight}px;`;
    },

    canvasAttrs() {

      let {width, height} = this.page.getViewport(this.scale);
      [width, height] = [width, height].map(dim => Math.ceil(dim));

      return {
        width,
        height,
      }
    },

    isCurrentPage() {
      return this.$store.getters.isCurrentPage(this.page.pageNumber)
    },

    ...mapState({
      pixelHeight: state => state.SlideModule.containerHeight
    })
    
  },

  methods: {
    async renderPage() {
      
      // Create our render params
      const renderParams = {
        canvasContext: this.$refs.canvas.getContext('2d'),
        viewport: this.viewport
      }
      // PDFPageProxy#render
      // https://mozilla.github.io/pdf.js/api/draft/PDFPageProxy.html
      this.renderTask = this.page.render(renderParams);
      await this.renderTask;
      console.log(`Page rendered`);
    },

    destroyPage(page) {
      if (!page) return;

      // PDFPageProxy#_destroy
      // https://mozilla.github.io/pdf.js/api/draft/PDFPageProxy.html
      page._destroy();

      // RenderTask#cancel
      // https://mozilla.github.io/pdf.js/api/draft/RenderTask.html
      if (this.renderTask) this.renderTask.cancel();
    },

    async zoomChange(changeVal) {
      // Set the zoom level based on the change value passed
      this.scale += changeVal
      // Rerender the page
      await this.renderPage();
    }
  },

  created() {
    // PDFPageProxy#getViewport
    // https://mozilla.github.io/pdf.js/api/draft/PDFPageProxy.html
    // this.viewport = this.page.getViewport(this.scale);
    // Listen to zoom changes
    // console.log(this.containerHeight)
    // console.log(`The container height ${this.containerHeight}`)
    this.$root.$on('zoom-change', this.zoomChange)
  },

  async mounted() {
    await this.renderPage();
    // We've rendered the page 
  },

  // Destroy the page before we remove the component
  beforeDestroy() {
    this.destroyPage(this.page);
  },

  // render(h) {
  //   const {canvasAttrs: attrs} = this;
  //   return h('canvas', {attrs});
  // },
};
</script>

<style>
.pdf-page {
  /* Take the full height of the container */
  height: 100%;
  display: block;
  margin: 0 auto 0.5em;
}
</style>