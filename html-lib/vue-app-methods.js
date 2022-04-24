/* global postMessageAPI, XLSX */

var appMethods = {
  setupAPI() {
    postMessageAPI.addReceiveListener(async (data) => {
      console.log('收到資料了', data)
      if (typeof (data) === 'string') {
        this.inputText = data
      } else {
        for (let key in data) {
          this[key] = data[key]
        }
      }
      console.log('開始準備處理')
      let result = await this.processOutput()
      console.log(result)
      return result
    })
    //console.log('設定好了')
  },
  persist() {
    this.configChanged = true
    let key = this.persistKey
    let data = {
      segmentationMethod: this.segmentationMethod,
      nGramLength: this.nGramLength,
      configUserDictionary: this.configUserDictionary,
      configWordRemap: this.configWordRemap,
      configStopWords: this.configStopWords,
      usePorterStemmer: this.usePorterStemmer,
      removeEnglish: this.removeEnglish,
      removeNumber: this.removeNumber,
      removeHTML: this.removeHTML,
      useLowerCase: this.useLowerCase,
      inputFormat: this.inputFormat,
    }
    localStorage.setItem(key, JSON.stringify(data))
  },
  loadPersistedData() {
    let dataString = localStorage.getItem(this.persistKey)
    if (dataString) {
      let data = JSON.parse(dataString)
      for (let key in data) {
        this[key] = data[key]
      }
    }
  },
}