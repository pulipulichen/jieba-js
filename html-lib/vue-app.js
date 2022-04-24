/* global XLSX */

let postMessageAPI = PuliPostMessageAPI({
  manuallyReady: true
})

var app = {
  el: '#app',
  data: appData,
  components: appComponents,
  computed: appComputed,
  mounted: appMount,
  watch: appWatch,
  methods: {
    ...appMethods,
    //...appMethodsInit,
    //...appMethodsUpload
  }
}

app = new Vue(app)