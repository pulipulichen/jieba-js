/* global __webpack_public_path__ */
import Vue from 'vue'


// ----------------------------------
// plugins

import i18n from './i18n/i18n.js'

// ----------------------

import './styles/styles.js'
import template from './index.tpl'
import config from './config.js'
import clientConfig from './clientConfig.js'

import utils from './utils/utils.js'

// --------------------
// Components or routes

//import components from './components/index.js'
import Index from './components/Index.vue'

// -----------------------
// 20220424-2008 
// for Jieba-JS
import IndexWatch from './IndexWatch.js'
import ComputedManager from './ComputedManager/ComputedManager.vue'

// -----------------------
// 確認 baseURL

let baseURL = __webpack_public_path__
baseURL = baseURL.split('/').slice(0, 3).join('/')

let baseScript = document.currentScript
if (baseScript) {
  
  let src = baseScript.src
  //console.log(src)
  if (src.startsWith('/')) {
    src = window.location.href
    console.log(src)
  }
  else {
    baseURL = src.split('/').slice(0, 3).join('/')
  }
  //console.log(baseURL)
  //if (enableBrowserTest && baseScript[0].src.startsWith(testBaseURL)) {
  //if (enableBrowserTest) {
  //}
  
  
  let appNode = document.createElement("div");
  appNode.id = 'app'
  baseScript.parentNode.insertBefore(appNode, baseScript);
  //baseScript.before(`<div id="app"></div>`)
}
config.baseURL = baseURL

// ---------------
// 錯誤訊息的設置

window.onerror = function(message, source, lineno, colno, error) {
  if (error === null) {
    error = message
  }
  //console.error(error)
  VueController.data.errors.push(error)
}

Vue.config.errorHandler  = function(err, vm, info) {
  //console.log(`errorHandler Error: ${err.stack}\nInfo: ${info}`);
  console.error(err)
  VueController.data.errors.push(err)
}

// -----------------------

let VueController = {
  el: '#app',
  template: template,
  data: {
    config: config,
    clientConfig,
    errors: [],
    utils: utils
  },
  i18n: i18n,
  components: {
    'index': Index,
    'ComputedManager': ComputedManager
  }, 
  watch: {
    ...IndexWatch
  },
  mounted: function () {
    this.config.computed = this.$refs.ComputedManager
    this.inited = true
  }
}

if (typeof(baseURL) === 'string') {
  setTimeout(() => {
    new Vue(VueController)
  }, 0)
}

import './service-worker-loader.js'