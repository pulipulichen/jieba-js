/* global XLSX */

let postMessageAPI = PuliPostMessageAPI({
  manuallyReady: true
})

var app = {
  el: '#app',
  data: appData,
  computed: appComputed,
  mounted: appMount,
  watch: appWatch,
  methods: appMethods
}

app = new Vue(app)