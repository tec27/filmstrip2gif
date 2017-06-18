var path = require('path')

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },

  externals: [
    'animated_gif',
    /^animated_gif\/.+$/',
    'data-uri-to-blob',
  ],
}
