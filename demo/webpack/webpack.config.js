const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'a.js'),
  output: {
    path: path.resolve(__dirname, '.'),
    filename: 'bundle.js'
  },
  optimization: {
    minimize: false // disables uglify.
  }
}
