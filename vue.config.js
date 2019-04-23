module.export = {
    publicPath: process.env.WEBPACK_PUBLIC_PATH || '/',
    configureWebpack: {
        output: {
            globalObject: 'this'
        }
    }
}