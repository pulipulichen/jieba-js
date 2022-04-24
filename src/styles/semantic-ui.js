import $ from 'jquery'
////let $ = require('jquery')
//window.jQuery = window.$ = $

// Use Semantic UI original version
//require('./../vendors/semantic-ui/semantic.min.css')
//require('./../vendors/semantic-ui/semantic.min.js')

// Use Semantic UI NIWSF version
let SemanticUINIWSF = () => import(/* webpackChunkName: "vendors/semantic-ui-niwsf" */ './semantic-ui-niwsf/semantic-ui-niwsf-webpack.js')
SemanticUINIWSF()