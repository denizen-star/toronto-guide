const { override, addWebpackPlugin } = require('customize-cra');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  webpack: function(config, env) {
    // Modify entry points
    config.entry = {
      main: path.join(__dirname, 'src/index.tsx'),
      boulder: path.join(__dirname, 'src/boulder.tsx')
    };

    // Modify output configuration
    config.output = {
      ...config.output,
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'build')
    };

    // Add additional HTML plugin for boulder
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        filename: 'boulder/index.html',
        chunks: ['boulder'],
        publicPath: '/boulder/'
      })
    );

    return config;
  }
}; 