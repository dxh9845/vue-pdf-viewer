const vue = require('rollup-plugin-vue2')
const postcss = require('rollup-plugin-postcss');

const plugins = [
    postcss({ extract: true }),
    vue(),
]

let config = {
    input: 'src/index.js',
    output: [
        {
            format: 'cjs',
            // file: 'dist/vue-pdf-slides.ssr.js',
            dir: 'dist/cjs',
            sourcemap: true,
        },
        {
            format: 'esm',
            dir: 'dist/esm/',
            // file: 'dist/vue-pdf-slides.esm.js',
            sourcemap: true,
        }, 
        {
            format: 'iife',
            dir: 'dist',
            name: 'vue-pdf-slides.js',
            sourcemap: true,
        }
    ],
    plugins: plugins
}

export default config;