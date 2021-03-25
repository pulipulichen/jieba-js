/* global postMessageAPI */

var appMount = async function () {
  this.setupAPI()

  this.configUserDictionaryExample = this.configUserDictionary
  this.configWordRemapExample = this.configWordRemap
  this.configStopWordsExample = this.configStopWords

  //console.log(stemmer("hopefully", true), stemmer("loves", true))

  this.loadPersistedData()
  postMessageAPI.ready()
  await this.loadFullStopWordsOnMount()

//  if (this.inputFormat === 'table') {
//    this.initTabls()
//  }

  //console.log(this.searchParams.api)
  if (!this.searchParams.api) {
    if (this.debug.startSegmentationOnLoad === false) {
      return false
    }
    
    setTimeout(() => {
      this.initInputOptions()
      this.processOutput()
    }, 0)
  }
}