/* global postMessageAPI */

var appMount = async function () {
  this.config.computed = this.$refs.ComputedManager

  this.setupAPI()



  //console.log(stemmer("hopefully", true), stemmer("loves", true))

  this.loadPersistedData()
  postMessageAPI.ready()

//  if (this.inputFormat === 'table') {
//    this.initTabls()
//  }

  //console.log(this.searchParams.api)
  if (!this.searchParams.api) {
    if (this.config.development.debug.startSegmentationOnLoad === false) {
      return false
    }
    
    setTimeout(() => {
      //this.initInputOptions()
      //this.processOutput()
      console.log(this.$refs.TextPanel)
      this.$refs.TextPanel.initProcessOutput()
    }, 100)
  }
}