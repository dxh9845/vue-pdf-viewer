<template>
  <canvas v-show="isCurrentPage" :style="canvasStyle" :width="canvasAttrs.width" :height="canvasAttrs.height" ref="canvas" class='pdf-page'></canvas>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    page: {
      type: Object,
      required: true
    },
    scale: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      viewport: null,
      renderTask: null,
      rendered: false,
    }
  },


  computed: {
    actualSizeViewport() {
      return this.viewport.clone({scale: this.scale});
    },

    canvasStyle() {
      const {width: actualSizeWidth, height: actualSizeHeight} = this.actualSizeViewport;
      const pixelRatio = window.devicePixelRatio || 1;
      const [pixelWidth, pixelHeight] = [actualSizeWidth, actualSizeHeight].map(dim => Math.ceil(dim / pixelRatio));
      return `width: ${pixelWidth}px; height: ${pixelHeight}px;`
    },

    canvasAttrs() {
      let {width, height} = this.viewport;
      [width, height] = [width, height].map(dim => Math.ceil(dim));

      const style = this.canvasStyle;

      return {
        width,
        height,
      }
    },

    isCurrentPage() {
      return this.$store.getters.isCurrentPage(this.page.pageNumber)
    }
    
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
  },

  created() {
    // PDFPageProxy#getViewport
    // https://mozilla.github.io/pdf.js/api/draft/PDFPageProxy.html
    this.viewport = this.page.getViewport(this.scale);
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