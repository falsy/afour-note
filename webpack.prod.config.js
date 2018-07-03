// Production Webpack

let { resolve } = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  
  context: resolve(__dirname, 'src'),

  mode: 'production',
  
  entry: [
    '/',
  ],
  
  output: {
    filename: 'app-[hash].js',
    path: resolve(__dirname, 'build'),
    publicPath: '/',
  },
  
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react', 'stage-0']
        },
        exclude: ['/node_modules']
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      },
      { test: /\.(png|jpg|gif)$/, use: 'url-loader?limit=15000&name=[hash:base64:5].[ext]' },
      { test: /\.eot(\?v=\d+.\d+.\d+)?$/, use: 'file-loader' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=image/svg+xml' }
    ]
  },
  
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
    alias: {
      variables: resolve(__dirname, 'src/scss/utils/variables'),
      mixins: resolve(__dirname, 'src/scss/utils/mixins'),
      respond: resolve(__dirname, 'src/scss/utils/respond')
    }
  },
  
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/index.html`,
      filename: 'index.html',
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
  
}