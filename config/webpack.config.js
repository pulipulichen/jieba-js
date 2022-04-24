'use strict';

//const dotenv = require('dotenv');
//dotenv.config();
//const baseURL = process.env.PROTOCOL + '//' + process.env.PUBLIC_HOST + ':' + process.env.PORT
//const baseURL = ''

const path = require('path')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

let compileCount = 0

module.exports = (env, argv) => {

  if (argv.mode === undefined) {
    argv.mode = 'development'
  }
  if (argv.watch === undefined) {
    argv.watch = false
  }

  let webpackConfig = {
    mode: argv.mode,
    cache: true,
    devtool: 'source-map',
    //devtool: false,
    entry: {
      'index': path.resolve(__dirname, '../src/index.js'),
      //'test': path.resolve(__dirname, '../src/test.js'),
    },
    output: {
      path: path.resolve(__dirname, '../dist/'),
      filename: '[name].js',
      publicPath: './dist/'
    },
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm.js'
      }
    },
    module: {
      rules: [
        {
          test: /\.css$/, // 針對所有.css 的檔案作預處理，這邊是用 regular express 的格式
          use: [
            'vue-style-loader', // 這個會後執行 (順序很重要)
            'css-loader?sourceMap' // 這個會先執行
          ]
        },
        {
          test: /\.less$/,
          use: [
            'vue-style-loader', // Step 3
            'css-loader?sourceMap', // Step 2再執行這個
            {
              loader: 'less-loader?sourceMap',
              options: {
                globalVars: require('../src/styles/style.config.js')
              }
            }, // Step 1 要先執行這個
          ]
        },
        {
          test: /\.vue$/,
          use: [
            'vue-loader'
          ]
        },
        {
          test: /\.(eot|woff|woff2|svg|wav|ogg|gif|mp3|png|jpg|ttf)([\?]?.*)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'asset',
                //publicPath: baseURL + '/spa/asset'
                publicPath: './dist/asset'
              }
            }
          ]
        },
        {
          resourceQuery: /blockType=i18n/,
          type: 'javascript/auto',
          loader: '@kazupon/vue-i18n-loader',
        },
        {
            test: /\.tpl$/,
            exclude: /node_modules/,
            use: {
              loader: 'html-loader',
              options: {
                attrs: false
              }
            }
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
            let paddingZero = (n) => {
              if (n < 10) {
                n = '0' + n
              }
              return n
            }
            setTimeout(() => {
              compileCount++
              let date = new Date;
              let seconds = paddingZero(date.getSeconds())
              let minutes = paddingZero(date.getMinutes())
              let hour = paddingZero(date.getHours())
              console.warn(`[${compileCount}] Webpack building completed at ${hour}:${minutes}:${seconds}`)
            }, 100)
          });
        } // apply: (compiler) => {
      },
//      new BundleAnalyzerPlugin({
//        analyzerPort: 5001
//      })
    ],  // plugins: [
    optimization: {
      splitChunks: {
        cacheGroups: {
          // Split vendor code to its own chunk(s)
//          vendors: {
//            test: /[\\/]node_modules[\\/]/,
//            name: 'vendors',
//            chunks: "all"
//          },
          // Split code common to all chunks to its own chunk
          commons: {
            name: "commons",    // The name of the chunk containing all common code
            chunks: "initial",  // TODO: Document
            minChunks: 2        // This is the number of modules
          }
        }
      }
    },
  } // let webpackConfig = {

  // -------------------------------------------------------------------

  if (argv.mode === 'production') {
    webpackConfig.devtool = false

    webpackConfig.module.rules[0] = {
      test: /\.css$/, // 針對所有.css 的檔案作預處理，這邊是用 regular express 的格式
      use: [
        'style-loader', // 這個會後執行 (順序很重要)
        'css-loader', // 這個會先執行
        'postcss-loader'
      ]
    }
    webpackConfig.module.rules[1] = {
      test: /\.less$/,
      use: [
        'style-loader', // Step 3
        'css-loader', // Step 2再執行這個
        'postcss-loader',
        {
          loader: 'less-loader?sourceMap',
          options: {
            globalVars: require('../src/styles/style.config.js')
          }
        }, // Step 1 要先執行這個
      ]
    }
    webpackConfig.module.rules.push({
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-transform-runtime']
        }
      }
    })
    
    
    if (typeof(webpackConfig.optimization) !== 'object') {
      webpackConfig.optimization = {}
    }
    
    webpackConfig.optimization.minimizer = [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // set to true if you want JS source maps
      })
    ]
    
    if (argv.watch === false) {
      if (Array.isArray(webpackConfig.plugins) === false) {
        webpackConfig.plugins = []
      }
      //webpackConfig.plugins.push(new BundleAnalyzerPlugin())
    }
  }
  
  if (argv.mode === 'development') {

  }

  return webpackConfig
}
