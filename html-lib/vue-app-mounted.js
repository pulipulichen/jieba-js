var appMount = function () {
    this.setupAPI()
    
    this.configUserDictionaryExample = this.configUserDictionary
    this.configWordRemapExample = this.configWordRemap
    this.configStopWordsExample = this.configStopWords
    
    //console.log(stemmer("hopefully", true), stemmer("loves", true))
    
    this.loadPersistedData()
    postMessageAPI.ready()
    
    //console.log(this.searchParams.api)
    if (!this.searchParams.api) {
      setTimeout(() => {
        this.processOutput()
      }, 0)
    }
  }