const { override, addWebpackPlugin } = require('customize-cra');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = override(
  (config) => {
    // Add additional HTML plugin for boulder
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        filename: 'boulder/index.html',
        chunks: ['main'],
        publicPath: '/'
      })
    );

    return config;
  }
); 