const history = require('connect-history-api-fallback');

module.exports = {
  devServer: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', // Endereço da sua API local
        changeOrigin: true,
        pathRewrite: { '^/api': '' }, // Remove '/api' da URL final
      },
    },
  },
  configureWebpack: {
    output: {
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js',
    },
  },
  outputDir: 'dist',
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/styles/variables.scss";` // Exemplo de importação de variáveis globais
      }
    }
  }
};