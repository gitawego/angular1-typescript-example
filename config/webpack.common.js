/**
 * @author: @AngularClass
 */

const webpack = require('webpack');
const helpers = require('./helpers');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

/*
 * Webpack Plugins
 */
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlElementsPlugin = require('./html-elements-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeModulesPath = helpers.root('node_modules');

const scssLoader = [
  // 'css-to-string-loader',
  // 'raw-loader',
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
const METADATA = {
  title: 'Country Map Demo',
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer()
};
//console.log("helpers.root('src/app/app.module#AppModule'),", helpers.root('src/app/app.module#AppModule'));
/*
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
  var isProd = options.ENV === 'production';
  const miniImages = '?' + (isProd ? '' : '-') + '?minimize';
  const scssExtractLoader = ExtractTextPlugin.extract({
    fallbackLoader: 'style-loader',
    loader: scssLoader,
    publicPath: './'
  });
  const cssExtractLoader = ExtractTextPlugin.extract({
    fallbackLoader: 'style-loader',
    loader: ['css-loader'],
    publicPath: './'
  });
  console.log("isProd", isProd);
  const loaderOptions = {
    debug: false,
    options: {
      resolve: {},
      context: helpers.root('.')
    }
  };
  if (isProd) {
    _.merge(loaderOptions, {
      options: {
        minimize: true,
        imagemin: {
          gifsicle: {
            interlaced: false
          },
          jpegtran: {
            progressive: true,
            arithmetic: false
          },
          optipng: {
            optimizationLevel: 5
          },
          pngquant: {
            floyd: 0.5,
            speed: 2
          },
          svgo: {
            plugins: [{
                removeTitle: true
              },
              {
                convertPathData: false
              }
            ]
          }
        }
        // tslint: {
        //   emitErrors: true,
        //   failOnHint: true,
        //   resourcePath: 'src'
        // },
        /**
         * Html loader advanced options
         *
         * See: https://github.com/webpack/html-loader#advanced-options
         */
        // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
        // htmlLoader: {
        //   minimize: true,
        //   removeAttributeQuotes: false,
        //   caseSensitive: true,
        //   customAttrSurround: [
        //     [/#/, /(?:)/],
        //     [/\*/, /(?:)/],
        //     [/\[?\(?/, /(?:)/]
        //   ],
        //   customAttrAssign: [/\)?\]?=/]
        // }
      }
    });
  } else {
    _.merge(loaderOptions, {
      options: {
        tslint: {
          emitErrors: false,
          failOnHint: false,
          resourcePath: 'src'
        }
      }
    });
  }
  return {

    /*
     * Cache generated modules and chunks to improve performance for multiple incremental builds.
     * This is enabled by default in watch mode.
     * You can pass false to disable it.
     *
     * See: http://webpack.github.io/docs/configuration.html#cache
     */
    // cache: false,

    /*
     * The entry point for the bundle
     * Our Angular.js app
     *
     * See: http://webpack.github.io/docs/configuration.html#entry
     */
    entry: {

      'polyfills': './src/polyfills.ts',
      // 'vendor':    './src/vendor.browser.ts',
      'main': './src/index.ts'

    },

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
      extensions: ['.ts', '.js', 'json'],
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
      rules: [{
          enforce: "pre",
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: [
            /node_modules/
          ]
        },
        // {
        //   enforce: 'pre',
        //   test: /\.ts$/,
        //   loader: 'string-replace',
        //   query: {
        //     search: '(System|SystemJS)(.*[\\n\\r]\\s*\\.|\\.)import\\((.+)\\)',
        //     replace: '$1.import($3).then(mod => (mod.__esModule && mod.default) ? mod.default : mod)',
        //     flags: 'g'
        //   },
        //   include: [helpers.root('src')]
        // },
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
          use: ['ng-annotate-loader?add=true', 'ts-loader'],
          exclude: [/\.(spec|e2e)\.ts$/]
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
          use: cssExtractLoader
        },
        {
          test: /\.scss$/,
          loader: scssExtractLoader
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: ['url-loader?name=images/[path][name].[ext]&limit=10000', 'img-loader' + miniImages]
        },
        {
          loader: 'url-loader?name=fonts/[name].[ext]&prefix=font/',
          test: /\.(woff|woff2|eot|ttf)(\?.*?|)$/
        },
        {
          use: ['file-loader?name=svg/[path][name].[ext]', 'img-loader' + miniImages],
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
        }
      ]

    },
    /*
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [
      new AssetsPlugin({
        path: helpers.root('dist'),
        filename: 'webpack-assets.json',
        prettyPrint: true
      }),
      new ExtractTextPlugin('[name].css'),
      /**
       * Plugin: ContextReplacementPlugin
       * Description: Provides context to Angular's use of System.import
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
       * See: https://github.com/angular/angular/issues/11580
       */
      // new webpack.ContextReplacementPlugin(
      //   // The (\\|\/) piece accounts for path separators in *nix and Windows
      //   /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      //   helpers.root('src') // location of your src
      // ),
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        $: 'jquery',
        'window.$': 'jquery'
        // 'window.Tether': 'tether',
        // Tether: 'tether',
        // Util: 'bootstrap/dist/js/umd/util.js'
      }),

      /*
       * Plugin: CopyWebpackPlugin
       * Description: Copy files and directories in webpack.
       *
       * Copies project static assets.
       *
       * See: https://www.npmjs.com/package/copy-webpack-plugin
       */

      new CopyWebpackPlugin([{
        from: 'assets',
        to: 'assets'
      }]),
      new webpack.LoaderOptionsPlugin(loaderOptions),
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
      }),
      new CommonsChunkPlugin({
        name: 'polyfills',
        chunks: ['polyfills']
      }),
      new CommonsChunkPlugin({
        name: 'vendor',
        chunks: ['main'],
        minChunks: module => /node_modules/.test(module.resource)
      }),
      // Specify the correct order the scripts will be injected in
      new CommonsChunkPlugin({
        name: ['polyfills', 'vendor'].reverse()
      }),
    ],

    /*
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  };
};
