// Webpack Config
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './dist/app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /^node_modules\/jsonld/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            ['@babel/plugin-proposal-object-rest-spread'],
            ['@babel/plugin-syntax-object-rest-spread'],
            ['@babel/plugin-transform-runtime'],
          ]
        }
      },
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            ['@babel/plugin-proposal-object-rest-spread'],
            ['@babel/plugin-syntax-object-rest-spread'],
            ['@babel/plugin-transform-modules-commonjs'],
            ['@babel/plugin-transform-regenerator'],
            ['@babel/plugin-transform-runtime']
          ]
        }
      }
    ]
  }
}
