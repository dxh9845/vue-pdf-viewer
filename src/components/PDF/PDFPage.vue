<template>
  <canvas 
    v-show="isCurrentPage" 
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
  name: 'pdf-page',
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
      viewport: this.page.getViewport({ scale: this.initialScale }),
      renderTask: null,
    }
  },

  computed: {
    actualSizeViewport() {
      return this.viewport.clone({ scale: this.initialScale });
    },

    canvasStyle() {
      const { width: documentWidth, height: documentHeight } = this.actualSizeViewport;
      // console.log(`Pixel width: ${this.pixelWidth}; Height: ${this.pixelHeight}`)
      const { pixelWidth, pixelHeight } = this;

      if (pixelWidth > pixelHeight) {
        let ph = Math.ceil(( (documentHeight * pixelWidth) / documentWidth ));
        return `width: ${pixelWidth}px; height: ${ph}px;`
      }
      // } else if (pixelHeight > pixelWidth ) {
      //   // Set the width of the document display through the height of the container 
      //   let pw = Math.ceil(((documentWidth *  this.pixelHeight) / documentHeight));
      //   return `width: ${pw}px; height: ${this.pixelHeight}px;`;
      // }
      
      return `width: ${pixelWidth}; height: ${pixelHeight}px;`
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
      pixelHeight: state => state.SlideModule.containerHeight,
      pixelWidth: state => state.SlideModule.containerWidth
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
      this.renderTask = this.page.render(renderParams).promise;
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
    this.$root.$on('zoom-change', this.zoomChange)
  },

  async mounted() {
    await this.renderPage();
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