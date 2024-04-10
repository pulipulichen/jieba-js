(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{123:function(e,t,o){"use strict";o.r(t);function n(){var i=this,e=i.$createElement;return(e=i._self._c||e)("div",{staticClass:"ConfigurationPanel ui grid configuration-panel",class:{"n-gram":"n-gram"===i.config.session.segmentationMethod}},[e("div",{staticClass:"row"},[e("div",{staticClass:"ten wide column"},[e("label",{staticClass:"ui header"},[i._v("\n        Configuration ("+i._s(i.config.development.version)+")\n      ")])]),i._v(" "),e("div",{staticClass:"six wide column",staticStyle:{"text-align":"right","margin-bottom":"5px"}},[e("button",{staticClass:"ui mini icon basic button",attrs:{type:"button"},on:{click:function(e){return i.$refs.InputConfigFileTrigger.click()}}},[e("i",{staticClass:"folder open outline icon"})]),i._v(" "),e("input",{ref:"InputConfigFileTrigger",staticClass:"input-field",attrs:{type:"file",id:"input_config_file",accept:".ods"},on:{change:i.loadConfigFile}}),i._v(" "),e("button",{staticClass:"ui mini icon basic button",attrs:{type:"button"},on:{click:i.downloadConfiguration}},[e("i",{staticClass:"save outline icon"})])])]),i._v(" "),e("div",{staticClass:"row"},[e("div",{staticClass:"column"},[e("div",{staticClass:"inline fields input-options"},[e("div",{staticClass:"field"},[e("div",{staticClass:"ui checkbox"},[e("input",{directives:[{name:"model",rawName:"v-model",value:i.config.session.doRemoveHeader,expression:"config.session.doRemoveHeader"}],attrs:{id:"DoSkipHeader",type:"checkbox"},domProps:{checked:Array.isArray(i.config.session.doRemoveHeader)?-1<i._i(i.config.session.doRemoveHeader,null):i.config.session.doRemoveHeader},on:{change:function(e){var t,o=i.config.session.doRemoveHeader,e=e.target,n=!!e.checked;Array.isArray(o)?(t=i._i(o,null),e.checked?t<0&&i.$set(i.config.session,"doRemoveHeader",o.concat([null])):-1<t&&i.$set(i.config.session,"doRemoveHeader",o.slice(0,t).concat(o.slice(t+1)))):i.$set(i.config.session,"doRemoveHeader",n)}}}),i._v(" "),e("label",{attrs:{for:"DoSkipHeader"}},[i._v("Skip first line (header)")])])]),i._v(" "),e("div",{staticClass:"field"},[e("div",{staticClass:"ui checkbox"},[e("input",{directives:[{name:"model",rawName:"v-model",value:i.config.session.onlyFirstColumn,expression:"config.session.onlyFirstColumn"}],attrs:{id:"OnlyFirstColumn",type:"checkbox"},domProps:{checked:Array.isArray(i.config.session.onlyFirstColumn)?-1<i._i(i.config.session.onlyFirstColumn,null):i.config.session.onlyFirstColumn},on:{change:function(e){var t,o=i.config.session.onlyFirstColumn,e=e.target,n=!!e.checked;Array.isArray(o)?(t=i._i(o,null),e.checked?t<0&&i.$set(i.config.session,"onlyFirstColumn",o.concat([null])):-1<t&&i.$set(i.config.session,"onlyFirstColumn",o.slice(0,t).concat(o.slice(t+1)))):i.$set(i.config.session,"onlyFirstColumn",n)}}}),i._v(" "),e("label",{attrs:{for:"OnlyFirstColumn"}},[i._v("Only first column")])])])])])]),i._v(" "),e("div",{staticClass:"row"},[e("div",{staticClass:"sixteen wide column"},[e("div",{staticClass:"ui form"},[e("div",{staticClass:"two fields"},[e("div",{staticClass:"field"},[e("label",[i._v("\n              Segmentation Method\n            ")]),i._v(" "),e("div",{staticClass:"inline fields"},[e("div",{staticClass:"field"}),i._v(" "),e("div",{staticClass:"field",on:{click:function(e){i.config.session.segmentationMethod="dictionary"}}},[e("input",{directives:[{name:"model",rawName:"v-model",value:i.config.session.segmentationMethod,expression:"config.session.segmentationMethod"}],attrs:{type:"radio",value:"dictionary"},domProps:{checked:i._q(i.config.session.segmentationMethod,"dictionary")},on:{change:function(e){return i.$set(i.config.session,"segmentationMethod","dictionary")}}}),i._v(" "),e("label",[i._v("Dictionary")])]),i._v(" "),e("div",{staticClass:"field"},[e("input",{directives:[{name:"model",rawName:"v-model",value:i.config.session.segmentationMethod,expression:"config.session.segmentationMethod"}],attrs:{type:"radio",value:"n-gram"},domProps:{checked:i._q(i.config.session.segmentationMethod,"n-gram")},on:{change:function(e){return i.$set(i.config.session,"segmentationMethod","n-gram")}}})]),i._v(" "),e("div",{staticClass:"field"},[e("input",{directives:[{name:"model",rawName:"v-model",value:i.config.session.nGramLength,expression:"config.session.nGramLength"}],staticClass:"n-gram-number",attrs:{type:"number"},domProps:{value:i.config.session.nGramLength},on:{change:function(e){i.config.session.segmentationMethod="n-gram"},input:function(e){e.target.composing||i.$set(i.config.session,"nGramLength",e.target.value)}}})]),i._v(" "),e("div",{staticClass:"field clickable",on:{click:function(e){i.config.session.segmentationMethod="n-gram"}}},[e("label",[i._v("\n                  - gram\n                ")])])])]),i._v(" "),e("div",{staticClass:"field"},[e("label",[i._v("\n              Word Vector Model\n            ")]),i._v(" "),e("div",{staticClass:"inline fields"},[e("div",{staticClass:"field",on:{click:function(e){i.config.session.wordVectorModel="BagOfWords"}}},[e("input",{directives:[{name:"model",rawName:"v-model",value:i.config.session.wordVectorModel,expression:"config.session.wordVectorModel"}],attrs:{type:"radio",value:"BagOfWords"},domProps:{checked:i._q(i.config.session.wordVectorModel,"BagOfWords")},on:{change:function(e){return i.$set(i.config.session,"wordVectorModel","BagOfWords")}}}),i._v(" "),e("label",[i._v("Bag of Words")])]),i._v(" "),e("div",{staticClass:"field",on:{click:function(e){i.config.session.wordVectorModel="TermFrequency"}}},[e("input",{directives:[{name:"model",rawName:"v-model",value:i.config.session.wordVectorModel,expression:"config.session.wordVectorModel"}],attrs:{type:"radio",value:"TermFrequency"},domProps:{checked:i._q(i.config.session.wordVectorModel,"TermFrequency")},on:{change:function(e){return i.$set(i.config.session,"wordVectorModel","TermFrequency")}}}),i._v(" "),e("label",[i._v("Term Frequency")])]),i._v(" "),e("div",{staticClass:"field",on:{click:function(e){i.config.session.wordVectorModel="Embbeding"}}},[e("input",{directives:[{name:"model",rawName:"v-model",value:i.config.session.wordVectorModel,expression:"config.session.wordVectorModel"}],attrs:{type:"radio",value:"Embbeding"},domProps:{checked:i._q(i.config.session.wordVectorModel,"Embbeding")},on:{change:function(e){return i.$set(i.config.session,"wordVectorModel","Embbeding")}}}),i._v(" "),e("label",[i._v("Embbeding")])])])])]),i._v(" "),e("div",{staticClass:"two fields"},[e("div",{staticClass:"field"},[e("label",[i._v("\n              Remove\n            ")]),i._v(" "),e("div",{staticClass:"inline fields"},[e("div",{staticClass:"field"},[e("div",{staticClass:"ui checkbox"},[e("input",{directives:[{name:"model",rawName:"v-model",value:i.config.session.removeEnglish,expression:"config.session.removeEnglish"}],attrs:{id:"RemoveEnglish",type:"checkbox"},domProps:{checked:Array.isArray(i.config.session.removeEnglish)?-1<i._i(i.config.session.removeEnglish,null):i.config.session.removeEnglish},on:{change:function(e){var t,o=i.config.session.removeEnglish,e=e.target,n=!!e.checked;Array.isArray(o)?(t=i._i(o,null),e.checked?t<0&&i.$set(i.config.session,"removeEnglish",o.concat([null])):-1<t&&i.$set(i.config.session,"removeEnglish",o.slice(0,t).concat(o.slice(t+1)))):i.$set(i.config.session,"removeEnglish",n)}}}),i._v(" "),e("label",{attrs:{for:"RemoveEnglish"}},[i._v("Remove English")])])]),i._v(" "),e("div",{staticClass:"field"},[e("div",{staticClass:"ui checkbox"},[e("input",{directives:[{name:"model",rawName:"v-model",value:i.config.session.removeNumber,expression:"config.session.removeNumber"}],attrs:{id:"RemoveNumber",type:"checkbox"},domProps:{checked:Array.isArray(i.config.session.removeNumber)?-1<i._i(i.config.session.removeNumber,null):i.config.session.removeNumber},on:{change:function(e){var t,o=i.config.session.removeNumber,e=e.target,n=!!e.checked;Array.isArray(o)?(t=i._i(o,null),e.checked?t<0&&i.$set(i.config.session,"removeNumber",o.concat([null])):-1<t&&i.$set(i.config.session,"removeNumber",o.slice(0,t).concat(o.slice(t+1)))):i.$set(i.config.session,"removeNumber",n)}}}),i._v(" "),e("label",{attrs:{for:"RemoveNumber"}},[i._v("Remove Number")])])]),i._v(" "),e("div",{staticClass:"field"},[e("div",{staticClass:"ui checkbox"},[e("input",{directives:[{name:"model",rawName:"v-model",value:i.config.session.removeHTML,expression:"config.session.removeHTML"}],attrs:{type:"checkbox",id:"RemoveHTML"},domProps:{checked:Array.isArray(i.config.session.removeHTML)?-1<i._i(i.config.session.removeHTML,null):i.config.session.removeHTML},on:{change:function(e){var t,o=i.config.session.removeHTML,e=e.target,n=!!e.checked;Array.isArray(o)?(t=i._i(o,null),e.checked?t<0&&i.$set(i.config.session,"removeHTML",o.concat([null])):-1<t&&i.$set(i.config.session,"removeHTML",o.slice(0,t).concat(o.slice(t+1)))):i.$set(i.config.session,"removeHTML",n)}}}),i._v(" "),e("label",{attrs:{for:"RemoveHTML"}},[i._v("Remove HTML")])])])])]),i._v(" "),e("div",{staticClass:"field",class:{disabled:i.config.session.removeEnglish}},[e("label",[i._v("\n              English Process\n\n            ")]),i._v(" "),e("div",{staticClass:"ui checkbox"},[e("input",{directives:[{name:"model",rawName:"v-model",value:i.config.session.usePorterStemmer,expression:"config.session.usePorterStemmer"}],attrs:{type:"checkbox",id:"usePorterStemmer"},domProps:{checked:Array.isArray(i.config.session.usePorterStemmer)?-1<i._i(i.config.session.usePorterStemmer,null):i.config.session.usePorterStemmer},on:{change:function(e){var t,o=i.config.session.usePorterStemmer,e=e.target,n=!!e.checked;Array.isArray(o)?(t=i._i(o,null),e.checked?t<0&&i.$set(i.config.session,"usePorterStemmer",o.concat([null])):-1<t&&i.$set(i.config.session,"usePorterStemmer",o.slice(0,t).concat(o.slice(t+1)))):i.$set(i.config.session,"usePorterStemmer",n)}}}),i._v(" "),i._m(0)]),i._v(" "),e("div",{staticClass:"ui checkbox"},[e("input",{directives:[{name:"model",rawName:"v-model",value:i.config.session.useLowerCase,expression:"config.session.useLowerCase"}],attrs:{type:"checkbox",id:"useLowerCase"},domProps:{checked:Array.isArray(i.config.session.useLowerCase)?-1<i._i(i.config.session.useLowerCase,null):i.config.session.useLowerCase},on:{change:function(e){var t,o=i.config.session.useLowerCase,e=e.target,n=!!e.checked;Array.isArray(o)?(t=i._i(o,null),e.checked?t<0&&i.$set(i.config.session,"useLowerCase",o.concat([null])):-1<t&&i.$set(i.config.session,"useLowerCase",o.slice(0,t).concat(o.slice(t+1)))):i.$set(i.config.session,"useLowerCase",n)}}}),i._v(" "),e("label",{attrs:{for:"useLowerCase"}},[i._v("\n                Lower Case\n              ")])])])])]),i._v(" "),"dictionary"===i.config.session.segmentationMethod?[i._m(1),i._v(" "),e("div",{staticClass:"field"},[e("textarea",{directives:[{name:"model",rawName:"v-model",value:i.config.session.configUserDictionary,expression:"config.session.configUserDictionary"}],attrs:{spellcheck:"false"},domProps:{value:i.config.session.configUserDictionary},on:{input:function(e){e.target.composing||i.$set(i.config.session,"configUserDictionary",e.target.value)}}})])]:i._e(),i._v(" "),e("div",{staticClass:"field"},[i._m(2),i._v(" "),e("textarea",{directives:[{name:"model",rawName:"v-model",value:i.config.session.configWordRemap,expression:"config.session.configWordRemap"}],attrs:{spellcheck:"false"},domProps:{value:i.config.session.configWordRemap},on:{input:function(e){e.target.composing||i.$set(i.config.session,"configWordRemap",e.target.value)}}})]),i._v(" "),e("div",{staticClass:"field"},[e("div",{staticClass:"inline fields"},[i._m(3),i._v(" "),e("div",{staticClass:"field"},[e("button",{staticClass:"ui mini basic button",attrs:{type:"button"},on:{click:i.loadFullStopWords}},[e("i",{staticClass:"file alternate outline icon"}),i._v("\n              Load Full\n            ")])])]),i._v(" "),e("textarea",{directives:[{name:"model",rawName:"v-model",value:i.config.session.configStopWords,expression:"config.session.configStopWords"}],attrs:{spellcheck:"false"},domProps:{value:i.config.session.configStopWords},on:{input:function(e){e.target.composing||i.$set(i.config.session,"configStopWords",e.target.value)}}})])],2)])])}n._withStripped=!0;var i=o(2),C=o.n(i),i=o(0),s=o.n(i),i=o(13),r=o.n(i),a=o(14),i=o(60),c=o.n(i);function S(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */S=function(){return r};var r={},e=Object.prototype,c=e.hasOwnProperty,l=Object.defineProperty||function(e,t,o){e[t]=o.value},t="function"==typeof Symbol?Symbol:{},n=t.iterator||"@@iterator",o=t.asyncIterator||"@@asyncIterator",i=t.toStringTag||"@@toStringTag";function s(e,t,o){return Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{s({},"")}catch(e){s=function(e,t,o){return e[t]=o}}function a(e,t,o,n){var i,s,r,a,t=t&&t.prototype instanceof d?t:d,t=Object.create(t.prototype),n=new x(n||[]);return l(t,"_invoke",{value:(i=e,s=o,r=n,a="suspendedStart",function(e,t){if("executing"===a)throw new Error("Generator is already running");if("completed"===a){if("throw"===e)throw t;return k()}for(r.method=e,r.arg=t;;){var o=r.delegate;if(o){o=function e(t,o){var n=o.method,i=t.iterator[n];if(void 0===i)return o.delegate=null,"throw"===n&&t.iterator.return&&(o.method="return",o.arg=void 0,e(t,o),"throw"===o.method)||"return"!==n&&(o.method="throw",o.arg=new TypeError("The iterator does not provide a '"+n+"' method")),u;n=f(i,t.iterator,o.arg);if("throw"===n.type)return o.method="throw",o.arg=n.arg,o.delegate=null,u;i=n.arg;return i?i.done?(o[t.resultName]=i.value,o.next=t.nextLoc,"return"!==o.method&&(o.method="next",o.arg=void 0),o.delegate=null,u):i:(o.method="throw",o.arg=new TypeError("iterator result is not an object"),o.delegate=null,u)}(o,r);if(o){if(o===u)continue;return o}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===a)throw a="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);a="executing";o=f(i,s,r);if("normal"===o.type){if(a=r.done?"completed":"suspendedYield",o.arg===u)continue;return{value:o.arg,done:r.done}}"throw"===o.type&&(a="completed",r.method="throw",r.arg=o.arg)}})}),t}function f(e,t,o){try{return{type:"normal",arg:e.call(t,o)}}catch(e){return{type:"throw",arg:e}}}r.wrap=a;var u={};function d(){}function p(){}function m(){}var t={},g=(s(t,n,function(){return this}),Object.getPrototypeOf),g=g&&g(g(_([]))),v=(g&&g!==e&&c.call(g,n)&&(t=g),m.prototype=d.prototype=Object.create(t));function h(e){["next","throw","return"].forEach(function(t){s(e,t,function(e){return this._invoke(t,e)})})}function y(r,a){var t;l(this,"_invoke",{value:function(o,n){function e(){return new a(function(e,t){!function t(e,o,n,i){var s,e=f(r[e],r,o);if("throw"!==e.type)return(o=(s=e.arg).value)&&"object"==C()(o)&&c.call(o,"__await")?a.resolve(o.__await).then(function(e){t("next",e,n,i)},function(e){t("throw",e,n,i)}):a.resolve(o).then(function(e){s.value=e,n(s)},function(e){return t("throw",e,n,i)});i(e.arg)}(o,n,e,t)})}return t=t?t.then(e,e):e()}})}function w(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function b(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function x(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(w,this),this.reset(!0)}function _(t){if(t){var o,e=t[n];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length))return o=-1,(e=function e(){for(;++o<t.length;)if(c.call(t,o))return e.value=t[o],e.done=!1,e;return e.value=void 0,e.done=!0,e}).next=e}return{next:k}}function k(){return{value:void 0,done:!0}}return l(v,"constructor",{value:p.prototype=m,configurable:!0}),l(m,"constructor",{value:p,configurable:!0}),p.displayName=s(m,i,"GeneratorFunction"),r.isGeneratorFunction=function(e){e="function"==typeof e&&e.constructor;return!!e&&(e===p||"GeneratorFunction"===(e.displayName||e.name))},r.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,m):(e.__proto__=m,s(e,i,"GeneratorFunction")),e.prototype=Object.create(v),e},r.awrap=function(e){return{__await:e}},h(y.prototype),s(y.prototype,o,function(){return this}),r.AsyncIterator=y,r.async=function(e,t,o,n,i){void 0===i&&(i=Promise);var s=new y(a(e,t,o,n),i);return r.isGeneratorFunction(t)?s:s.next().then(function(e){return e.done?e.value:s.next()})},h(v),s(v,i,"Generator"),s(v,n,function(){return this}),s(v,"toString",function(){return"[object Generator]"}),r.keys=function(e){var t,o=Object(e),n=[];for(t in o)n.push(t);return n.reverse(),function e(){for(;n.length;){var t=n.pop();if(t in o)return e.value=t,e.done=!1,e}return e.done=!0,e}},r.values=_,x.prototype={constructor:x,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(b),!e)for(var t in this)"t"===t.charAt(0)&&c.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=void 0)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(o){if(this.done)throw o;var n=this;function e(e,t){return s.type="throw",s.arg=o,n.next=e,t&&(n.method="next",n.arg=void 0),!!t}for(var t=this.tryEntries.length-1;0<=t;--t){var i=this.tryEntries[t],s=i.completion;if("root"===i.tryLoc)return e("end");if(i.tryLoc<=this.prev){var r=c.call(i,"catchLoc"),a=c.call(i,"finallyLoc");if(r&&a){if(this.prev<i.catchLoc)return e(i.catchLoc,!0);if(this.prev<i.finallyLoc)return e(i.finallyLoc)}else if(r){if(this.prev<i.catchLoc)return e(i.catchLoc,!0)}else{if(!a)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return e(i.finallyLoc)}}}},abrupt:function(e,t){for(var o=this.tryEntries.length-1;0<=o;--o){var n=this.tryEntries[o];if(n.tryLoc<=this.prev&&c.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var i=n;break}}var s=(i=i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc?null:i)?i.completion:{};return s.type=e,s.arg=t,i?(this.method="next",this.next=i.finallyLoc,u):this.complete(s)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),u},finish:function(e){for(var t=this.tryEntries.length-1;0<=t;--t){var o=this.tryEntries[t];if(o.finallyLoc===e)return this.complete(o.completion,o.afterLoc),b(o),u}},catch:function(e){for(var t=this.tryEntries.length-1;0<=t;--t){var o,n,i=this.tryEntries[t];if(i.tryLoc===e)return"throw"===(o=i.completion).type&&(n=o.arg,b(i)),n}throw new Error("illegal catch attempt")},delegateYield:function(e,t,o){return this.delegate={iterator:_(e),resultName:t,nextLoc:o},"next"===this.method&&(this.arg=void 0),u}},r}var l,f,u,i={props:["config","utils"],mounted:(u=s()(S().mark(function e(){return S().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return this.initExample(),e.next=3,this.loadFullStopWordsOnMount();case 3:case"end":return e.stop()}},e,this)})),function(){return u.apply(this,arguments)}),methods:{initExample:function(){this.config.state.configUserDictionaryExample=this.config.session.configUserDictionary,this.config.state.configWordRemapExample=this.config.session.configWordRemap,this.config.state.configStopWordsExample=this.config.session.configStopWords},downloadConfiguration:function(){var e=a.b.book_new(),e=(e.SheetNames.push("Segmentation"),e.Sheets.Segmentation=this.utils.Sheet.aoa_to_sheet([["field","value"],["segmentationMethod",this.config.session.segmentationMethod],["nGramLength",this.config.session.nGramLength],["removeEnglish",this.config.session.removeEnglish],["removeNumber",this.config.session.removeNumber],["usePorterStemmer",this.config.session.usePorterStemmer]]),e.SheetNames.push("UserDictionary"),e.Sheets.UserDictionary=this.utils.Sheet.aoa_to_sheet([["word","weight","pos"]].concat(this.config.computed.configUserDictionaryArray)),e.SheetNames.push("WordRemap"),e.Sheets.WordRemap=this.utils.Sheet.aoa_to_sheet([["from","to"]].concat(this.config.computed.configWordRemapArray.map(function(e){return[e.targetWord,e.replaceWord]}))),e.SheetNames.push("StopWords"),e.Sheets.StopWords=this.utils.Sheet.aoa_to_sheet([["stopword"]].concat(this.config.computed.configStopWordsArray.map(function(e){return[e]}))),a.c(e,{bookType:"ods",type:"binary"})),t="jieba-js-config_"+this.utils.Date.mmddhhmm()+".ods";c.a.saveAs(new Blob([this.utils.Sheet.s2ab(e)],{type:"application/octet-stream"}),t)},loadFullStopWords:function(){var t=this;this.config.state.fullStopWords?this.loadFullStopWordsInited():(this.config.state.processOutputWait=!0,r.a.get("stop_words.txt",function(e){t.config.state.fullStopWords=e,t.loadFullStopWordsInited(),t.config.state.processOutputWait=!1}))},loadFullStopWordsInited:function(e){if(!0===(e=void 0===e?!0:e)&&this.config.state.fullStopWords!==this.config.session.configStopWords&&this.config.session.configStopWords&&""!==this.config.session.configStopWords.trim()&&!1===window.confirm("Are you sure to replace existed content?"))return!1;this.config.session.configStopWords=this.config.state.fullStopWords},processUploadConfiguration:(f=s()(S().mark(function e(t){var o,n,i,s,r=this;return S().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:for(n in o=a.a(t,{type:"binary"}),o.SheetNames)i=o.SheetNames[n],s=a.b.sheet_to_json(o.Sheets[i]),"Segmentation"===i?s.forEach(function(e){var t=e.key,e=e.value;r[t]=e}):"UserDictionary"===i?this.config.session.configUserDictionary=s.map(function(e){return[e.word,e.weight,e.pos].join(",")}).join("\n"):"WordRemap"===i?this.config.session.configWordRemap=s.map(function(e){return[e.from,e.to].join(",")}).join("\n"):"StopWords"===i&&(this.config.session.configStopWords=s.map(function(e){return e.stopword}).join("\n"));case 3:case"end":return e.stop()}},e,this)})),function(e){return f.apply(this,arguments)}),setExampleUserDictionary:function(){return this.config.state.configUserDictionaryExample!==this.config.session.configUserDictionary&&""!==this.config.session.configUserDictionary.trim()&&!1!==window.confirm("Are you sure to replace existed content?")&&void(this.config.session.configUserDictionary=this.config.state.configUserDictionaryExample)},setExampleWordRemap:function(){return this.config.state.configWordRemapExample!==this.config.session.configWordRemap&&""!==this.config.session.configWordRemap.trim()&&!1!==window.confirm("Are you sure to replace existed content?")&&void(this.config.session.configWordRemap=this.config.state.configWordRemapExample)},setExampleStopWords:function(){return this.config.state.configStopWordsExample!==this.config.session.configStopWords&&""!==this.config.session.configStopWords.trim()&&!1!==window.confirm("Are you sure to replace existed content?")&&void(this.config.session.configStopWords=this.config.state.configStopWordsExample)},loadFullStopWordsOnMount:(l=s()(S().mark(function e(){var o=this;return S().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if("string"!=typeof this.config.development.configStopWordsFile)return e.abrupt("return",!1);e.next=4;break;case 4:return e.abrupt("return",new Promise(function(t){o.config.state.processOutputWait=!0,r.a.get("stop_words.txt",function(e){o.config.state.fullStopWords=e,""!==o.config.session.configStopWords&&o.config.session.configStopWords||(o.config.session.configStopWords=o.config.state.fullStopWords),o.config.state.processOutputWait=!1,t()})}));case 5:case"end":return e.stop()}},e,this)})),function(){return l.apply(this,arguments)}),loadConfigFile:function(e){var n=this;if(window.FileReader){this.processOutputWait=!0;var t=new FileReader,o=e.target.files[0].type,i=e.target.files[0].name;if("application/vnd.oasis.opendocument.spreadsheet"!==o||!1===i.endsWith(".ods"))return alert("Configuration file is invalid."),this.processOutputWait=!1;t.onload=function(){var t=s()(S().mark(function e(t){var o;return S().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(2!==t.target.readyState)return n.processOutputWait=!1,e.abrupt("return");e.next=3;break;case 3:if(t.target.error)return alert("Error while reading file"),n.processOutputWait=!1,e.abrupt("return");e.next=7;break;case 7:return o=t.target.result,e.next=10,n.processUploadConfiguration(o);case 10:n.processOutputWait=!1;case 11:case"end":return e.stop()}},e)}));return function(e){return t.apply(this,arguments)}}(),t.readAsBinaryString(e.target.files[0])}}}},o=(o(96),o(3)),o=Object(o.a)(i,n,[function(){var e=this.$createElement,e=this._self._c||e;return e("label",{attrs:{for:"usePorterStemmer"}},[this._v("\n                Use Porter Stemmer\n                "),e("a",{attrs:{href:"https://github.com/kristopolous/Porter-Stemmer/blob/master/README.md",target:"_blank"}},[this._v("\n                  (Help)\n                ")])])},function(){var e=this.$createElement,e=this._self._c||e;return e("div",{staticClass:"inline fields"},[e("div",{staticClass:"field"},[e("label",{staticClass:"ui header"},[this._v("\n              User Dictionary\n            ")])])])},function(){var e=this.$createElement,e=this._self._c||e;return e("div",{staticClass:"inline fields"},[e("div",{staticClass:"field"},[e("label",{staticClass:"ui header"},[this._v("\n              Word Remap\n            ")])])])},function(){var e=this.$createElement,e=this._self._c||e;return e("div",{staticClass:"field"},[e("label",{staticClass:"ui header"},[this._v("\n              Stop Words\n            ")])])}],!1,null,"00331f62",null);o.options.__file="src/components/ConfigurationPanel/ConfigurationPanel.vue",t.default=o.exports},60:function(o,n,e){!function(e){var t;void 0!==(t="function"==typeof(t=function(){"use strict";function i(e,t){return"undefined"==typeof t?t={autoBom:!1}:"object"!=typeof t&&(console.warn("Deprecated: Expected third argument to be a object"),t={autoBom:!t}),t.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["\ufeff",e],{type:e.type}):e}function f(e,t,o){var n=new XMLHttpRequest;n.open("GET",e),n.responseType="blob",n.onload=function(){a(n.response,t,o)},n.onerror=function(){console.error("could not download file")},n.send()}function s(e){var t=new XMLHttpRequest;t.open("HEAD",e,!1);try{t.send()}catch(e){}return 200<=t.status&&299>=t.status}function r(t){try{t.dispatchEvent(new MouseEvent("click"))}catch(e){var o=document.createEvent("MouseEvents");o.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),t.dispatchEvent(o)}}var u="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof e&&e.global===e?e:void 0,d=u.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),a=u.saveAs||("object"!=typeof window||window!==u?function(){}:"download"in HTMLAnchorElement.prototype&&!d?function(e,t,o){var n=u.URL||u.webkitURL,i=document.createElement("a");t=t||e.name||"download",i.download=t,i.rel="noopener","string"==typeof e?(i.href=e,i.origin===location.origin?r(i):s(i.href)?f(e,t,o):r(i,i.target="_blank")):(i.href=n.createObjectURL(e),setTimeout(function(){n.revokeObjectURL(i.href)},4e4),setTimeout(function(){r(i)},0))}:"msSaveOrOpenBlob"in navigator?function(e,t,o){if(t=t||e.name||"download","string"!=typeof e)navigator.msSaveOrOpenBlob(i(e,o),t);else if(s(e))f(e,t,o);else{var n=document.createElement("a");n.href=e,n.target="_blank",setTimeout(function(){r(n)})}}:function(e,t,o,n){if(n=n||open("","_blank"),n&&(n.document.title=n.document.body.innerText="downloading..."),"string"==typeof e)return f(e,t,o);var i="application/octet-stream"===e.type,s=/constructor/i.test(u.HTMLElement)||u.safari,r=/CriOS\/[\d]+/.test(navigator.userAgent);if((r||i&&s||d)&&"undefined"!=typeof FileReader){var a=new FileReader;a.onloadend=function(){var e=a.result;e=r?e:e.replace(/^data:[^;]*;/,"data:attachment/file;"),n?n.location.href=e:location=e,n=null},a.readAsDataURL(e)}else{var c=u.URL||u.webkitURL,l=c.createObjectURL(e);n?n.location=l:location.href=l,n=null,setTimeout(function(){c.revokeObjectURL(l)},4e4)}});u.saveAs=a.saveAs=a,true&&(o.exports=a)})?t.apply(n,[]):t)&&(o.exports=t)}.call(this,e(11))},62:function(e,t,o){var n=o(97),i=("string"==typeof n&&(n=[[e.i,n,""]]),{});i.insert="head",i.singleton=!1,o(10)(n,i);n.locals&&(e.exports=n.locals)},96:function(e,t,o){"use strict";var n=o(62);o.n(n).a},97:function(e,t,o){(e.exports=o(9)(!1)).push([e.i,"input.input-field[type=file][data-v-00331f62]{display:none}textarea[data-v-00331f62]{height:9em!important;min-height:inherit!important}.n-gram-number[data-v-00331f62]{width:4rem!important}.text-panel .input-textarea[data-v-00331f62],.text-panel .input-textarea-container[data-v-00331f62],.text-panel .output-textarea[data-v-00331f62],.text-panel .output-textarea-container[data-v-00331f62]{height:calc(50vh - 13.5rem)!important;max-height:100vh!important;min-height:0!important}.text-panel #outputWordVector[data-v-00331f62],.text-panel .output-textarea-container[data-v-00331f62]{margin-bottom:2rem!important}.text-panel .buttons-panel[data-v-00331f62]{padding:0!important;width:100%;margin-top:1rem}.text-panel .buttons[data-v-00331f62]{position:relative;top:-2rem}.text-panel .input-filename[data-v-00331f62]{width:calc(100vw - 10rem)}.text-panel #hot-display-license-info[data-v-00331f62]{position:fixed!important;top:-100vh!important}.text-panel .input-options[data-v-00331f62]{justify-content:flex-end!important;margin:0!important;overflow:auto;max-width:100%;max-height:1.5rem}.text-panel .input-options input[type=text][data-v-00331f62]{width:2rem!important;padding-left:0!important;padding-right:0!important;text-align:center}.clickable[data-v-00331f62]{cursor:pointer}.configuration-panel textarea[data-v-00331f62]{max-height:100vh!important;height:calc(33.33333vh - 8rem)!important}.configuration-panel.n-gram textarea[data-v-00331f62]{height:calc(50vh - 10.5rem)!important}textarea[data-v-00331f62]{white-space:pre;overflow-wrap:normal;overflow-x:auto}label[data-v-00331f62]{user-select:none}label[for][data-v-00331f62]{cursor:pointer}.loading-modal[data-v-00331f62]{position:fixed;top:0;left:0;z-index:9999;width:100vw;height:100vh;background-color:rgba(0,0,0,.5);user-select:none;cursor:wait;text-align:center}.loading-modal img[data-v-00331f62]{-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-o-user-select:none;user-select:none;-webkit-user-drag:none;-khtml-user-drag:none;-moz-user-drag:none;-o-user-drag:none;user-drag:none}.menu .active.item[data-v-00331f62]{pointer-events:none}.output-copy-textarea[data-v-00331f62]{position:fixed;left:-100vw}.row.file-button-row[data-v-00331f62],.row.filename[data-v-00331f62],.row.input-header[data-v-00331f62],.row.input-row[data-v-00331f62],.row.output-header[data-v-00331f62],.row.output-row[data-v-00331f62]{padding-bottom:0!important}.row.header-remove-row[data-v-00331f62],.row.input-header[data-v-00331f62],.row.input-row[data-v-00331f62],.row.output-header[data-v-00331f62],.row.output-row[data-v-00331f62]{padding-top:0!important}.input-format[data-v-00331f62]{flex-direction:row-reverse!important;align-items:flex-end!important}.checkbox-row[data-v-00331f62]{margin:-1rem auto 1.5rem!important;max-width:100vw;overflow:auto}.checkbox-row .checkbox-row-container.fields[data-v-00331f62]{width:fit-content;margin:0 auto;padding-bottom:1rem}.checkbox-row .checkbox-row-container.fields label[data-v-00331f62]{cursor:pointer}.class-filter[data-v-00331f62]{margin-bottom:-2rem;margin-top:-1rem}",""])}}]);