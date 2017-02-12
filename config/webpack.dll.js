// needed to create context for resolveNgRoute

/**
 * @author: @AngularClass
 */
const {
  ContextReplacementPlugin,
  HotModuleReplacementPlugin,
  DefinePlugin,
  DllPlugin,
  ProvidePlugin,
  LoaderOptionsPlugin,
  optimize: {
    CommonsChunkPlugin
  }

} = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');

const path = require('path');
const {
  root
} = require('./helpers');
const {
  polyfills,
  vendors
} = require('./dll');
const libName = 'lib_[name]';
const bundleName = '[name].bundle';

// type definition for WebpackConfig is defined in webpack.d.ts
function webpackConfig(options) {
  const isProd = options && options.env === 'production';
  const webpackCfg = {
    devtool: '#source-map',
    entry: {
      polyfills: polyfills(options && options.env),
      vendors: vendors(options && options.env)
    },

    output: {
      path: root('dist/dll'),
      filename: `${bundleName}.js`,
      sourceMapFilename: `${bundleName}.map`,
      library: libName
    },

    module: {
      rules: [{
          test: /\.ts$/,
          use: [{
            loader: 'ts-loader'
          }],
          exclude: [root('src/app')],
          include: [root('./src')]
        },
        {
          enforce: 'post',
          test: /\.js$/,
          loader: 'string-replace-loader',
          query: {
            search: 'var sourceMappingUrl = extractSourceMappingUrl\\(cssText\\);',
            replace: 'var sourceMappingUrl = "";',
            flags: 'g'
          }
        },
        {
          enforce: 'post',
          test: /\.json$/,
          loader: 'string-replace-loader',
          query: {
            search: '}(.*[\\n\\r]\\s*)}(.*[\\n\\r]\\s*)}"activeExports": \\[\\]',
            replace: '',
            flags: 'g'
          }
        }
      ]

    },

    plugins: [
      new ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        angular: 'exports-loader?window.angular!angular'
      }),
      new LoaderOptionsPlugin({
        debug: false,
        options: {
          resolve: {}
        }
      }),
      new AssetsPlugin({
        path: root('dist/dll'),
        filename: 'webpack-assets.json',
        prettyPrint: true
      }),
      new DllPlugin({
        name: libName,
        path: root('dist/dll/[name]-manifest.json'),
      })
      // end angular2 fix

      //new ProgressPlugin({})
    ],
    node: {
      global: true,
      process: true,
      Buffer: false,
      module: false,
      clearImmediate: false,
      setImmediate: false,
      clearTimeout: true,
      setTimeout: true
    }
  };
  return webpackCfg;
}


// Export
module.exports = webpackConfig;
