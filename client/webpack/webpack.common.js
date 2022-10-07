const path = require('path')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: path.resolve(__dirname, '..', './src/index.tsx'),
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, '..', './src/api'),
      '@assets': path.resolve(__dirname, '..', './src/assets'),
      '@components': path.resolve(__dirname, '..', './src/components'),
      '@pages': path.resolve(__dirname, '..', './src/pages'),
      '@redux': path.resolve(__dirname, '..', './src/redux'),
      '@routes': path.resolve(__dirname, '..', './src/routes'),
      '@styles': path.resolve(__dirname, '..', './src/styles'),
      '@appTypes': path.resolve(__dirname, '..', './src/types'),
    },
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, '..', './build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', './src/index.html'),
      favicon: path.resolve(__dirname, '..', './public/favicon.ico'),
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    new webpack.EnvironmentPlugin(),

    // new CopyPlugin({
    //   patterns: [{ from: 'source', to: 'dest' }],
    // }),
  ],
  stats: 'errors-only',
}
