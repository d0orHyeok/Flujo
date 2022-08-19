const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: 'production',
      'process.env.name': JSON.stringify('Wave'),
    }),
    new CleanWebpackPlugin(),
  ],
}
