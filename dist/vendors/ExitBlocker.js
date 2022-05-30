(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendors/ExitBlocker"],{

/***/ "./node_modules/@kazupon/vue-i18n-loader/lib/index.js!./src/components/ExitBlocker/ExitBlocker.yaml?vue&type=custom&index=0&blockType=i18n&issuerPath=%2Fapp%2Fsrc%2Fcomponents%2FExitBlocker%2FExitBlocker.vue&lang=yaml":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@kazupon/vue-i18n-loader/lib!./src/components/ExitBlocker/ExitBlocker.yaml?vue&type=custom&index=0&blockType=i18n&issuerPath=%2Fapp%2Fsrc%2Fcomponents%2FExitBlocker%2FExitBlocker.vue&lang=yaml ***!
  \***********************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (Component) {
  Component.options.__i18n = Component.options.__i18n || []
  Component.options.__i18n.push('{"en":null,"zh-TW":{"Please don\u0027t leave.":"請不要離開"}}')
  delete Component.options._Ctor
}


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js?sourceMap!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js?!./src/components/ExitBlocker/ExitBlocker.less?vue&type=style&index=0&id=6a8b746e&lang=less&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js?sourceMap!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??ref--1-2!./src/components/ExitBlocker/ExitBlocker.less?vue&type=style&index=0&id=6a8b746e&lang=less&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(true);
// Module
exports.push([module.i, ".BlockExit[data-v-6a8b746e] {\n  color: rgba(255, 255, 255, 0.8) !important;\n  filter: drop-shadow(0px 0px 5px gray) !important;\n}\n", "",{"version":3,"sources":["ExitBlocker.less?vue&type=style&index=0&id=6a8b746e&lang=less&scoped=true&"],"names":[],"mappings":"AAAA;EACE,0CAA0C;EAC1C,gDAAgD;AAClD","file":"ExitBlocker.less?vue&type=style&index=0&id=6a8b746e&lang=less&scoped=true&","sourcesContent":[".BlockExit[data-v-6a8b746e] {\n  color: rgba(255, 255, 255, 0.8) !important;\n  filter: drop-shadow(0px 0px 5px gray) !important;\n}\n"]}]);


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./src/components/ExitBlocker/ExitBlocker.html?vue&type=template&id=6a8b746e&scoped=true&":
/*!****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./src/components/ExitBlocker/ExitBlocker.html?vue&type=template&id=6a8b746e&scoped=true& ***!
  \****************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "span",
    {
      staticClass: "BlockExit",
      on: {
        click: function($event) {
          return _vm.$emit("click")
        }
      }
    },
    [_c("i", { staticClass: "cloud icon" })]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js?sourceMap!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js?!./src/components/ExitBlocker/ExitBlocker.less?vue&type=style&index=0&id=6a8b746e&lang=less&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader!./node_modules/css-loader/dist/cjs.js?sourceMap!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js??ref--1-2!./src/components/ExitBlocker/ExitBlocker.less?vue&type=style&index=0&id=6a8b746e&lang=less&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js?sourceMap!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/less-loader/dist/cjs.js??ref--1-2!./ExitBlocker.less?vue&type=style&index=0&id=6a8b746e&lang=less&scoped=true& */ "./node_modules/css-loader/dist/cjs.js?sourceMap!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js?!./src/components/ExitBlocker/ExitBlocker.less?vue&type=style&index=0&id=6a8b746e&lang=less&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("3b4a0456", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ "./src/components/ExitBlocker/ExitBlocker.html?vue&type=template&id=6a8b746e&scoped=true&":
/*!************************************************************************************************!*\
  !*** ./src/components/ExitBlocker/ExitBlocker.html?vue&type=template&id=6a8b746e&scoped=true& ***!
  \************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_ExitBlocker_html_vue_type_template_id_6a8b746e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./ExitBlocker.html?vue&type=template&id=6a8b746e&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./src/components/ExitBlocker/ExitBlocker.html?vue&type=template&id=6a8b746e&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_ExitBlocker_html_vue_type_template_id_6a8b746e_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_ExitBlocker_html_vue_type_template_id_6a8b746e_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/components/ExitBlocker/ExitBlocker.js?vue&type=script&lang=js&?6897":
/*!****************************************************************************!*\
  !*** ./src/components/ExitBlocker/ExitBlocker.js?vue&type=script&lang=js& ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ExitBlocker_js_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./ExitBlocker.js?vue&type=script&lang=js& */ "./src/components/ExitBlocker/ExitBlocker.js?vue&type=script&lang=js&?b9d9");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_ExitBlocker_js_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/ExitBlocker/ExitBlocker.js?vue&type=script&lang=js&?b9d9":
/*!****************************************************************************!*\
  !*** ./src/components/ExitBlocker/ExitBlocker.js?vue&type=script&lang=js& ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
let preventExit = function (event) {
  //var message = 'Important: Please click on \'Save\' button to leave this page.';
  /*
  if (typeof (event) === 'undefined') {
    event = window.event
  }
  if (event) {
    event.returnValue = message
  }
  return message
  */
  event.returnValue = ''
}

let preventFunctionKeysList = ['F1', 'F3', 'F6', 'F12']
let preventFunctionKeys = function (event) {
  //console.log(event)
  //console.log(event.key)
  if (preventFunctionKeysList.indexOf(event.key) > -1) {
    event.preventDefault()
    return false
  }
}

let BlockExit = {
  data() {
    return {
    }
  },
  created: function () {
    //return // for test
    window.addEventListener('beforeunload', preventExit, true)
    document.body.addEventListener('keydown', preventFunctionKeys, true)
  },
  destroyed: function () {
    window.removeEventListener('beforeunload', preventExit, true)
    document.body.removeEventListener('keydown', preventFunctionKeys, true)
    //console.log('destroyed')
  }
}

/* harmony default export */ __webpack_exports__["default"] = (BlockExit);

/***/ }),

/***/ "./src/components/ExitBlocker/ExitBlocker.less?vue&type=style&index=0&id=6a8b746e&lang=less&scoped=true&":
/*!***************************************************************************************************************!*\
  !*** ./src/components/ExitBlocker/ExitBlocker.less?vue&type=style&index=0&id=6a8b746e&lang=less&scoped=true& ***!
  \***************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_sourceMap_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_1_2_ExitBlocker_less_vue_type_style_index_0_id_6a8b746e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-style-loader!../../../node_modules/css-loader/dist/cjs.js?sourceMap!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/less-loader/dist/cjs.js??ref--1-2!./ExitBlocker.less?vue&type=style&index=0&id=6a8b746e&lang=less&scoped=true& */ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js?sourceMap!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js?!./src/components/ExitBlocker/ExitBlocker.less?vue&type=style&index=0&id=6a8b746e&lang=less&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_sourceMap_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_1_2_ExitBlocker_less_vue_type_style_index_0_id_6a8b746e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_sourceMap_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_1_2_ExitBlocker_less_vue_type_style_index_0_id_6a8b746e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_sourceMap_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_1_2_ExitBlocker_less_vue_type_style_index_0_id_6a8b746e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_sourceMap_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_1_2_ExitBlocker_less_vue_type_style_index_0_id_6a8b746e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_sourceMap_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_1_2_ExitBlocker_less_vue_type_style_index_0_id_6a8b746e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/components/ExitBlocker/ExitBlocker.vue":
/*!****************************************************!*\
  !*** ./src/components/ExitBlocker/ExitBlocker.vue ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ExitBlocker_html_vue_type_template_id_6a8b746e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ExitBlocker.html?vue&type=template&id=6a8b746e&scoped=true& */ "./src/components/ExitBlocker/ExitBlocker.html?vue&type=template&id=6a8b746e&scoped=true&");
/* harmony import */ var _ExitBlocker_js_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ExitBlocker.js?vue&type=script&lang=js& */ "./src/components/ExitBlocker/ExitBlocker.js?vue&type=script&lang=js&?6897");
/* empty/unused harmony star reexport *//* harmony import */ var _ExitBlocker_less_vue_type_style_index_0_id_6a8b746e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ExitBlocker.less?vue&type=style&index=0&id=6a8b746e&lang=less&scoped=true& */ "./src/components/ExitBlocker/ExitBlocker.less?vue&type=style&index=0&id=6a8b746e&lang=less&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");
/* harmony import */ var _ExitBlocker_yaml_vue_type_custom_index_0_blockType_i18n_issuerPath_2Fapp_2Fsrc_2Fcomponents_2FExitBlocker_2FExitBlocker_vue_lang_yaml__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ExitBlocker.yaml?vue&type=custom&index=0&blockType=i18n&issuerPath=%2Fapp%2Fsrc%2Fcomponents%2FExitBlocker%2FExitBlocker.vue&lang=yaml */ "./src/components/ExitBlocker/ExitBlocker.yaml?vue&type=custom&index=0&blockType=i18n&issuerPath=%2Fapp%2Fsrc%2Fcomponents%2FExitBlocker%2FExitBlocker.vue&lang=yaml");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _ExitBlocker_js_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ExitBlocker_html_vue_type_template_id_6a8b746e_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _ExitBlocker_html_vue_type_template_id_6a8b746e_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "6a8b746e",
  null
  
)

/* custom blocks */

if (typeof _ExitBlocker_yaml_vue_type_custom_index_0_blockType_i18n_issuerPath_2Fapp_2Fsrc_2Fcomponents_2FExitBlocker_2FExitBlocker_vue_lang_yaml__WEBPACK_IMPORTED_MODULE_4__["default"] === 'function') Object(_ExitBlocker_yaml_vue_type_custom_index_0_blockType_i18n_issuerPath_2Fapp_2Fsrc_2Fcomponents_2FExitBlocker_2FExitBlocker_vue_lang_yaml__WEBPACK_IMPORTED_MODULE_4__["default"])(component)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/ExitBlocker/ExitBlocker.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/components/ExitBlocker/ExitBlocker.yaml?vue&type=custom&index=0&blockType=i18n&issuerPath=%2Fapp%2Fsrc%2Fcomponents%2FExitBlocker%2FExitBlocker.vue&lang=yaml":
/*!***************************************************************************************************************************************************************************!*\
  !*** ./src/components/ExitBlocker/ExitBlocker.yaml?vue&type=custom&index=0&blockType=i18n&issuerPath=%2Fapp%2Fsrc%2Fcomponents%2FExitBlocker%2FExitBlocker.vue&lang=yaml ***!
  \***************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_kazupon_vue_i18n_loader_lib_index_js_ExitBlocker_yaml_vue_type_custom_index_0_blockType_i18n_issuerPath_2Fapp_2Fsrc_2Fcomponents_2FExitBlocker_2FExitBlocker_vue_lang_yaml__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/@kazupon/vue-i18n-loader/lib!./ExitBlocker.yaml?vue&type=custom&index=0&blockType=i18n&issuerPath=%2Fapp%2Fsrc%2Fcomponents%2FExitBlocker%2FExitBlocker.vue&lang=yaml */ "./node_modules/@kazupon/vue-i18n-loader/lib/index.js!./src/components/ExitBlocker/ExitBlocker.yaml?vue&type=custom&index=0&blockType=i18n&issuerPath=%2Fapp%2Fsrc%2Fcomponents%2FExitBlocker%2FExitBlocker.vue&lang=yaml");
/* harmony import */ var _node_modules_kazupon_vue_i18n_loader_lib_index_js_ExitBlocker_yaml_vue_type_custom_index_0_blockType_i18n_issuerPath_2Fapp_2Fsrc_2Fcomponents_2FExitBlocker_2FExitBlocker_vue_lang_yaml__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_kazupon_vue_i18n_loader_lib_index_js_ExitBlocker_yaml_vue_type_custom_index_0_blockType_i18n_issuerPath_2Fapp_2Fsrc_2Fcomponents_2FExitBlocker_2FExitBlocker_vue_lang_yaml__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_kazupon_vue_i18n_loader_lib_index_js_ExitBlocker_yaml_vue_type_custom_index_0_blockType_i18n_issuerPath_2Fapp_2Fsrc_2Fcomponents_2FExitBlocker_2FExitBlocker_vue_lang_yaml__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_kazupon_vue_i18n_loader_lib_index_js_ExitBlocker_yaml_vue_type_custom_index_0_blockType_i18n_issuerPath_2Fapp_2Fsrc_2Fcomponents_2FExitBlocker_2FExitBlocker_vue_lang_yaml__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_kazupon_vue_i18n_loader_lib_index_js_ExitBlocker_yaml_vue_type_custom_index_0_blockType_i18n_issuerPath_2Fapp_2Fsrc_2Fcomponents_2FExitBlocker_2FExitBlocker_vue_lang_yaml__WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ })

}]);
//# sourceMappingURL=ExitBlocker.js.map