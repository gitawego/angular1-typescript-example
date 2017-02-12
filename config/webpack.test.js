/**
 * @author: @AngularClass
 */

const webpack = require('webpack');
const helpers = require('./helpers');
const fs = require('fs');
/*
 * Webpack Plugins
 */
// problem with copy-webpack-plugin
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlElementsPlugin = require('./html-elements-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeModulesPath = helpers.root('node_modules');
const rootNodeModulesPath = helpers.root('../../node_modules');
// dll helpers
function getManifest(__path) {
  var __fs = fs || require('fs');
  var manifest = tryDll(() => JSON.parse(__fs.readFileSync(helpers.root('./dist/dll/' + __path + '-manifest.json'), 'utf8')
    // TODO(gdi2290): workaround until webpack fixes dll generation
    .replace(/}(.*[\n\r]\s*)}(.*[\n\r]\s*)}"activeExports": \[\]/, '')));
  return manifest;
}

function getDllAssets(chunk) {
  var assets = tryDll(() => require(root('./dist/dll/webpack-assets.json')));
  // {"vendors":{"js":"vendors.js"},"polyfills":{"js":"polyfills.js"}}
  return assets[chunk]['js'];
}

function getAssets(chunk) {
  var assets = tryDll(() => require(root('./dist/webpack-assets.json')));
  // {"vendors":{"js":"vendors.js"},"polyfills":{"js":"polyfills.js"}}
  return assets[chunk]['js'];
}

function tryDll(cb) {
  try {
    return cb();
  } catch (e) {
    console.info("Initializing `%s`...", "DLL files");
    var spawn = require('cross-spawn');
    spawn.sync("npm", ["run", "dll"], { stdio: "inherit" });
    return cb();
    // throw new Error('Please run `npm run dll` first before building or running the server');
  }
}

const scssLoader = [
  'css-to-string-loader',
  //'raw',
  'css-loader',
  'sass-loader?' + ['outputStyle=expanded',
    'includePaths[]=' + nodeModulesPath
  ].join('&')
];
// const sassExtractText = ExtractTextPlugin.extract({
//   fallbackLoader: "style-loader",
//   loader: [
//     'to-string',
//     'css',
//     'sass?' + ['outputStyle=expanded',
//       'includePaths[]=' + nodeModulesPath].join('&')
//   ].join('!'),
//   publicPath: './'
// });
/*
 * Webpack Constants
 */
const HMR = helpers.hasProcessFlag('hot');
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const ENV = process.env.ENV = process.env.NODE_ENV = 'test';
const METADATA = {
  title: 'Country Map Demo',
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer(),
  host: HOST,
  port: PORT,
  ENV: ENV
};

/*
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function(options) {
  return {
    devtool: '#inline-source-map',
    // entry: './src/tests.entry.ts',
    // output: {
    //   path: helpers.root('dist-test'),
    //   filename: '[name].bundle.js',
    //   sourceMapFilename: '[name].bundle.map'
    // },
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [helpers.root('src'), 'node_modules', helpers.root('../')]
    },
    module: {
      rules: [{
          enforce: 'pre',
          test: /\.ts$/,
          loader: 'tslint-loader',
          exclude: [helpers.root('node_modules'), /\.(spec|e2e)\.ts$/]
        },
        {
          enforce: 'pre',
          test: /\.(js|ts)$/,
          loader: 'source-map-loader'
        },
        {
          enforce: 'post',
          test: /\.(ts)$/,
          loader: 'istanbul-instrumenter-loader?esModules=true',
          include: helpers.root('src'),
          exclude: [
            ///\.(e2e|spec)\.ts$/,
            /node_modules/
          ]
        },
        {
          test: /\.ts$/,
          loader: [{
            loader: 'babel-loader',
            query: {
              "presets": [
                ["es2015"]
              ],
              "plugins": [
                ["transform-runtime"]
              ]
            }
          }, 'ts-loader'],
          exclude: [/\.e2e\.ts$/]
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.css$/,
          use: ['css-to-string-loader', 'css-loader']
        },
        {
          test: /\.scss$/,
          loader: scssLoader
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: ['url-loader?name=images/[path][name].[ext]&limit=10000']
        },
        {
          loader: 'url-loader?name=fonts/[name].[ext]&prefix=font/',
          test: /\.(woff|woff2|eot|ttf)(\?.*?|)$/
        },
        {
          use: ['file-loader?name=svg/[path][name].[ext]'],
          test: /\.(svg)(\?.*?|)$/
        },
        {
          test: /\.html$/,
          loader: 'raw-loader',
          exclude: [helpers.root('src/index.html')]
        }

      ]
    },
    plugins: [
      new AssetsPlugin({
        path: helpers.root('dist'),
        filename: 'webpack-assets.json',
        prettyPrint: true
      }),
      new webpack.DllReferencePlugin({
        context: '.',
        manifest: getManifest('vendors'),
      }),
      new webpack.DllReferencePlugin({
        context: '.',
        manifest: getManifest('polyfills'),
      }),
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        $: 'jquery',
        'window.$': 'jquery',
        'window.Tether': 'tether',
        Tether: 'tether',
        Util: 'bootstrap/dist/js/umd/util.js'
      }),
      new webpack.LoaderOptionsPlugin({
        debug: true,
        options: {
          // for ts-loader
          resolve: {},
          ts: {
            // override compiler options for "ts-loader"
            compilerOptions: {
              sourceMap: true,
              inlineSourceMap: false,
              removeComments: true
            }
          },
          tslint: {
            emitErrors: false,
            failOnHint: false,
            resourcePath: 'src'
          }
        }
      }),
      new CopyWebpackPlugin([{
        from: 'src/assets',
        to: 'assets'
      }]),
      new HtmlWebpackPlugin(Object.assign({
        template: 'src/index.html',
        chunksSortMode: 'dependency'
      }, METADATA)),
      new HtmlElementsPlugin({
        headTags: require('./head-config.common')
      })
    ],
    node: {
      global: true,
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  };
};
