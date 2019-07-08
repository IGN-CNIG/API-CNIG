const path = require('path');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const GenerateVersionPlugin = require('./GenerateVersionPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopywebpackPlugin = require('copy-webpack-plugin');

const PJSON_PATH = path.resolve(__dirname, '..', 'package.json');
const pjson = require(PJSON_PATH);

module.exports = {
  mode: 'production',
  entry: {
    'sharemap.ol.min': path.resolve(__dirname, '..', 'src', 'index.js'),
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].js',
  },
  resolve: {
    alias: {
      templates: path.resolve(__dirname, '../src/templates'),
      assets: path.resolve(__dirname, '../src/facade/assets'),
      facade: path.resolve(__dirname, '../src/facade/js'),
    },
    extensions: ['.wasm', '.mjs', '.js', '.json', '.css', '.hbs', '.html', '.svg'],
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules\/(?!ol)|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
      {
        test: [/\.hbs$/, /\.html$/],
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: MiniCssExtractPlugin.loader,
      }, {
        test: /\.css$/,
        loader: 'css-loader',
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?name=fonts/[name].[ext]',
      }
    ],
  },
  optimization: {
    noEmitOnErrors: true,
    minimizer: [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin({
        sourceMap: true,
        terserOptions: {
          mangle: {
            properties: {
              regex: /.*_/,
            },
          },
        },
      }),
    ],
  },
  plugins: [
    // new GenerateVersionPlugin({
    //   version: pjson.version,
    //   regex: /([A-Za-z]+)(\..*)/,
    // }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopywebpackPlugin([{
      from: 'src/api.json',
      to: 'api.json',
    }]),
  ],
  devtool: 'source-map',
};
