/* global postMessageAPI, XLSX */

var appMethodsInit = {
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
  loadConfigFile(evt) {
    //console.log(1);
    if (!window.FileReader)
      return; // Browser is not compatible

    this.processOutputWait = true
    var reader = new FileReader()
    let type = evt.target.files[0].type
    let filename = evt.target.files[0].name

    if (type !== 'application/vnd.oasis.opendocument.spreadsheet'
            || filename.endsWith('.ods') === false) {
      alert('Configuration file is invalid.')
      this.processOutputWait = false
      return false
    }

    reader.onload = async (evt) => {
      if (evt.target.readyState !== 2) {
        this.processOutputWait = false
        return;
      }
      if (evt.target.error) {
        alert('Error while reading file');
        this.processOutputWait = false
        return;
      }

      let result = evt.target.result

      await this.processUploadConfiguration(result)

      this.processOutputWait = false
    }


    reader.readAsBinaryString(evt.target.files[0])
  },
  loadExample () {
    /*
    $.get('./demo/master-thesis-abstract.csv', (result) => {
      this.inputFilename = 'master-thesis-abstract'
      this.inputText = result
      this.processOutputWait = false
      
      this.initInputOptions()
    })
    */
    window.open('./demo/master-thesis-abstract.csv', '_blank')
  },
  loadInputFile(evt) {
    //console.log(1);
    if (!window.FileReader)
      return; // Browser is not compatible

    this.processOutputWait = true
    var reader = new FileReader();
    let filename = evt.target.files[0].name
    let type = evt.target.files[0].type
    //console.log(type)
    if (filename.indexOf('.') > -1) {
      filename = filename.slice(0, filename.lastIndexOf('.'))
    }
    this.inputFilename = filename

    reader.onload = async (evt) => {
      if (evt.target.readyState !== 2) {
        this.processOutputWait = false
        return;
      }
      if (evt.target.error) {
        alert('Error while reading file');
        this.processOutputWait = false
        return;
      }

      let result = evt.target.result
      if (type === 'application/vnd.oasis.opendocument.spreadsheet'
              || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.inputText = await this.processUploadTypeSheet(result)
      } else if (type === 'application/vnd.oasis.opendocument.text') {
        this.inputText = await this.processUploadTypeODT(result)
      } else if (type === 'text/html') {
        this.inputText = this.processUploadTypeHTML(result)
      } else if (type === 'text/csv') {
        this.inputText = await this.processUploadTypeCSV(result)
      } else {
        this.inputText = result
      }
      this.$refs.inputFileUploadTrigger.value = ''
      this.processOutputWait = false
      
      this.initInputOptions()
    }

    if (type === 'application/vnd.oasis.opendocument.spreadsheet'
            || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      let size = evt.target.files[0].size
      console.log('size', size)
      if (size > 25000000) {
        window.alert('ODS/XLSX檔案大小請低於2.5MB。')
        this.processOutputWait = false
        return false
      }

      reader.readAsBinaryString(evt.target.files[0])
    } else {
      reader.readAsText(evt.target.files[0])
    }
  }
}