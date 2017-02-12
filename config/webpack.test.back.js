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
  var isProd = ENV === 'production';
  console.log("isProd", isProd);
  return {
    devtool: 'inline-source-map',
    /*
     * Options affecting the resolving of modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve
     */
    resolve: {

      /*
       * An array of extensions that should be used to resolve modules.
       *
       * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
       */
      extensions: ['.ts', '.js'],
      // Make sure root is src
      modules: [helpers.root('src'), 'node_modules', helpers.root('../')]

    },

    /*
     * Options affecting the normal modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#module
     */
    module: {

      /*
       * An array of applied pre and post loaders.
       *
       * See: http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
       */
      rules: [

        /**
         * Tslint loader support for *.ts files
         *
         * See: https://github.com/wbuchwalter/tslint-loader
         */
        {
          enforce: 'pre',
          test: /\.ts$/,
          loader: 'tslint-loader',
          exclude: [helpers.root('node_modules'), /\.(spec|e2e)\.ts$/]
        },

        /**
         * Source map loader support for *.js files
         * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
         *
         * See: https://github.com/webpack/source-map-loader
         */
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: [
            // these packages have problems with their sourcemaps
            helpers.root('node_modules/rxjs'),
            helpers.root('node_modules/@angular')
          ]
        },
        /*
         * Typescript loader support for .ts and Angular 2 async routes via .async.ts
         * Replace templateUrl and stylesUrl with require()
         *
         * See: https://github.com/TypeStrong/ts-loader
         * See: https://github.com/TheLarkInn/angular2-template-loader
         */
        {
          test: /\.ts$/,
          /** notice: in webpack 2.1.0-beta.25, loaders order is changed to asc. */
          use: ['angular2-template-loader', 'ts-loader'],
          exclude: [/\.e2e\.ts$/]
        },

        /*
         * Json loader support for *.json files.
         *
         * See: https://github.com/webpack/json-loader
         */
        {
          test: /\.json$/,
          loader: 'json-loader'
        },

        /*
         * to string and css loader support for *.css files
         * Returns file content as string
         *
         */
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
        /* Raw loader support for *.html
         * Returns file content as string
         *
         * See: https://github.com/webpack/raw-loader
         */
        {
          test: /\.html$/,
          loader: 'raw-loader',
          exclude: [helpers.root('src/index.html')]
        },
        // Bootstrap 4
        {
          test: /bootstrap\/dist\/js\/umd\//,
          loader: 'imports-loader?jQuery=jquery'
        },
        {
          enforce: 'post',
          test: /\.ts$/,
          exclude: /(node_modules|\.spec\.ts$)/,
          loader: 'sourcemap-istanbul-instrumenter-loader?force-sourcemap=true'
        }
        /**
         * Instruments JS files with Istanbul for subsequent code coverage reporting.
         * Instrument only testing sources.
         *
         * See: https://github.com/deepsweet/istanbul-instrumenter-loader
         */
        // {
        //   enforce: 'post',
        //   test: /\.(js|ts)$/,
        //   loader: 'istanbul-instrumenter-loader',
        //   include: helpers.root('src'),
        //   options: {
        //     esModules: true
        //   },
        //   exclude: [
        //     /\.(e2e|spec)\.ts$/,
        //     /node_modules/
        //   ]
        // }
      ]
    },
    /*
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [
      new webpack.SourceMapDevToolPlugin({
        filename: null,
        test: /\.(ts|js)($|\?)/i
      }),
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
              sourceMap: false,
              inlineSourceMap: true
            }
          },
          tslint: {
            emitErrors: false,
            failOnHint: false,
            resourcePath: 'src'
          }
        }
      }),
      // new ExtractTextPlugin('[name].css'),
      /*
       * Plugin: CommonsChunkPlugin
       * Description: Shares common code between the pages.
       * It identifies common modules and put them into a commons chunk.
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
       * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
       */
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: ['polyfills', 'vendor'].reverse()
      // }),

      /*
       * Plugin: CopyWebpackPlugin
       * Description: Copy files and directories in webpack.
       *
       * Copies project static assets.
       *
       * See: https://www.npmjs.com/package/copy-webpack-plugin
       */
      new CopyWebpackPlugin([{
        from: 'src/assets',
        to: 'assets'
      }]),

      /*
       * Plugin: HtmlWebpackPlugin
       * Description: Simplifies creation of HTML files to serve your webpack bundles.
       * This is especially useful for webpack bundles that include a hash in the filename
       * which changes every compilation.
       *
       * See: https://github.com/ampedandwired/html-webpack-plugin
       */
      new HtmlWebpackPlugin(Object.assign({
        template: 'src/index.html',
        chunksSortMode: 'dependency'
      }, METADATA)),

      /*
       * Plugin: HtmlHeadConfigPlugin
       * Description: Generate html tags based on javascript maps.
       *
       * If a publicPath is set in the webpack output configuration, it will be automatically added to
       * href attributes, you can disable that by adding a "=href": false property.
       * You can also enable it to other attribute by settings "=attName": true.
       *
       * The configuration supplied is map between a location (key) and an element definition object (value)
       * The location (key) is then exported to the template under then htmlElements property in webpack configuration.
       *
       * Example:
       *  Adding this plugin configuration
       *  new HtmlElementsPlugin({
       *    headTags: { ... }
       *  })
       *
       *  Means we can use it in the template like this:
       *  <%= webpackConfig.htmlElements.headTags %>
       *
       * Dependencies: HtmlWebpackPlugin
       */
      new HtmlElementsPlugin({
        headTags: require('./head-config.common')
      })
    ],
    /*
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  };
};
