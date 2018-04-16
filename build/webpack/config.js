const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;

const logger = require('../../server/lib/logger');
const project = require('../../package.json');

const productionMode  = 'production';
const developmentMode = 'development';

const mode = process.env.NODE_ENV || developmentMode;
logger.info(`webpack mode: ${mode}`)

let config = {
  mode,

  // Capture a "profile" of the application, including statistics and hints, which can then be dissected using the Analyze tool.
  // Use the StatsPlugin for more control over the generated profile.
  profile: mode === developmentMode,

  entry: {
    app: path.resolve(__dirname, '../../client/app.jsx'),
  },

  output: {
    chunkFilename: `${project.name}.ui.[name].${project.version}.js`,
    filename: `${project.name}.ui.${project.version}.js`,
    path: path.join(__dirname, '../../dist'),
    publicPath: '/app/'
  },

  resolve: {
    extensions: ['.json', '.js', '.jsx'],
  },

  // Load all modules.
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [ '@babel/preset-env', {
                targets: {
                  browsers: [ 'last 2 versions' ]
                },
                shippedProposals: true,
              } ],
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-export-default-from',
              '@babel/plugin-proposal-export-namespace-from',
              '@babel/plugin-transform-runtime',
              '@babel/plugin-syntax-dynamic-import',
            ],
            ignore: [ './node_modules/**/*.js' ]
          }
        },
        exclude: path.join(__dirname, '../../node_modules/')
      },
      {
        test: /\.(png|ttf|svg|jpg|gif)/,
        use: {
          loader: 'url-loader?limit=8192'
        }
      },
      {
        test: /\.(woff|woff2|eot)/,
        use: {
          loader: 'url-loader?limit=100000'
        }
      },
      {
        test: /\.css$/,
        use: [
//          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('postcss-simple-vars')(),
                require('postcss-focus')(),
                require('autoprefixer')({
                  browsers: [ 'last 2 versions', 'IE > 8' ]
                }),
                require('postcss-reporter')({
                  clearMessages: true
                })
              ]
            }
          },
        ]
      },
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(mode === developmentMode),
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify(mode)
      },
      __CLIENT__: JSON.stringify(true),
      __SERVER__: JSON.stringify(false)
    }),
//    new BundleAnalyzerPlugin(),
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          chunks: "all",
          name: "vendor",
          priority: 10,
          enforce: true
        }
      }
    }
  },
};

switch(mode) {
  case productionMode:
    config.optimization.minimizer = [
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: true,
          output: {
            comments: false
          },
          compress: {
            sequences: true,
            dead_code: true,
            conditionals: true,
            booleans: true,
            unused: true,
            if_return: true,
            join_vars: true,
            drop_console: true,
            warnings: false
          }
        }
      })
    ];

    config.plugins.push(
      new StatsWriterPlugin({
        filename: 'manifest.json',
        transform: function transformData(data) {
          const chunks = {
            app: data.assetsByChunkName.app[0],
            style: data.assetsByChunkName.app[1],
            vendors: data.assetsByChunkName.vendor
          };
          return JSON.stringify(chunks);
        }
      })
    );


    config = extractCSS(config);
    break;
  case developmentMode:
    break;
}

function extractCSS(config) {
  const cssRule = config.module.rules.find(rule => rule.test.test('foo.css'));
  cssRule.use.unshift(MiniCssExtractPlugin.loader);

  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: `${project.name}.ui.${project.version}.css`,
      allChunks: true
    })
  );

  return config;
}

module.exports = config;
