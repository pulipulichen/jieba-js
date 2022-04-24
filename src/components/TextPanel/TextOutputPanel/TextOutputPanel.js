import TextOutputExportPanel from './TextOutputExportPanel/TextOutputExportPanel.vue'

export default {
  props: ['config', 'utils'],
  components: {
    TextOutputExportPanel
  },
  // mounted: function () {

  // },  // mounted: function () {
  computed: {
    outputButtonDisabled () {
      return (this.config.state.outputText.trim() === '')
    },
    outputTextWordVectorString () {
      let vector = this.config.state.outputTextWordVector
      if (!vector || vector === '') {
        return ''
      }

      var wb = XLSX.utils.book_new();

      wb.SheetNames.push("data")

      let ws = this.aoa_to_sheet(vector)
      //console.log(ws)
      wb.Sheets["data"] = ws

      //var wbout = XLSX.write(wb, {bookType: 'ods', bookSST: true, type: 'base64'});
      //let filename = 'jieba-js-config_' + (new Date()).mmddhhmm() + '.ods'
      //saveAs(new Blob([this.s2ab(wbout)], {type: "application/octet-stream"}), filename);

      let csv = XLSX.write(wb, {bookType:'csv', bookSST:true, type: 'string'})
      console.log(csv)
      return csv
    },
  }, // computed: {
  methods: {

    saveAsText() {
      this.saveFile('txt')
    },
    copyOutput() {
    
      this.$refs.outputCopyTextarea.select()
      document.execCommand("Copy")
    },
    copyOutputWordVector() {
      this.$refs.outputCopyTextarea.select()
      document.execCommand("Copy")
    },
    saveAsSheet() {
      console.error('@TODO')
    },
    saveAsWordVector: async function () {
      this.config.state.processOutputWait = true
      console.log('saveAsBagOfWords', 1)
      await this.sleep(0)
      let data = await this.getClassifyText()
      console.log('saveAsBagOfWords', 2)
  //    data = [
  //      ['a', 'b'],
  //      [1, 2],
  //    ]
  //    console.log(data)
  
      //console.log('saveAsBagOfWords', 2)
      let appendFilename = '_seg' + (new Date()).mmddhhmm()
      var filename = this.inputFilename + appendFilename + ".ods"
  //    
  //    var wb = XLSX.utils.book_new();
  //    console.log('saveAsBagOfWords', 3, data)
      /*
      let sheetName = "bag-of-words"
      wb.SheetNames.push(sheetName)
      wb.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(data)
      console.log('saveAsBagOfWords', 4)
      await this.sleep(0)
      var wbout = XLSX.write(wb, {bookType: 'csv', type: 'base64'});
      await this.sleep(0)
      console.log('saveAsBagOfWords', 5)
      this.processOutputWait = false
      */
  
      /*
      let dataString = data.map(line => line.join(',')).join('\n')
      console.log('saveAsBagOfWords', 3, dataString.length)
      //return false
      this.downloadStringFile(dataString, 'text/csv', filename);
      */
      var wb = XLSX.utils.book_new();
  
      wb.SheetNames.push("data")
  
      let ws = this.aoa_to_sheet(data)
      //console.log(ws)
      wb.Sheets["data"] = ws
  
      //var wbout = XLSX.write(wb, {bookType: 'ods', bookSST: true, type: 'base64'});
      //let filename = 'jieba-js-config_' + (new Date()).mmddhhmm() + '.ods'
      //saveAs(new Blob([this.s2ab(wbout)], {type: "application/octet-stream"}), filename);
  
      XLSX.writeFile(wb, filename);
  
      this.processOutputWait = false
      //await this.sleep(0)
      /*
      let ext = 'csv'
      let appendFilename = '_seg' + (new Date()).mmddhhmm()
  
      var _file_name = this.inputFilename + appendFilename + "." + ext
      var _file_content = ''
      for (let len = data.length, i = len; i > 0; i--) {
        let index = (len - i)
        data[index] = data[index].join(',')
        if (i % 10 === 5) {
          await this.sleep(0)
        }
      }
      _file_content = data.join('\n')
      
      if (_file_content === "") {
        return;
      }
  
      var _character_encoding = "utf-8";
  
      let mime = 'plain'
      if (ext === 'csv') {
        mime = 'csv'
      }
  
      // ------------
  
      var blob = new Blob([_file_content], {type: "text/html;charset=" + _character_encoding})
      saveAs(blob, _file_name)
      */
    },
    getClassifyText: async function () {
      //console.log(this.outputTextWordVector, typeof(this.outputTextWordVector))
      if (this.config.state.outputTextWordVector !== null) {
        return this.config.state.outputTextWordVector
      }
      
      let outputText = this.outputText
      let lines = outputText.split('\n')
      
      let className = 'class'
      if (this.config.session.doRemoveHeader === true) {
        let headerLine = lines.shift()
        className = headerLine.slice(headerLine.indexOf(this.config.session.columnSeparator) + 1)
      }
      
      // ---------------------------
      
      let bags = []
      let classList = []
      let words = {}
      
      //console.log('getClassifyText', 'bags')
      
      for (let len = lines.length, i = len; i > 0; i--) {
        let line = lines[(len - i)]
        let lineClass = line.slice(line.indexOf(this.config.session.columnSeparator) + 1)
        if (this.config.state.selectClasses.indexOf(lineClass.trim()) === -1) {
          continue
        }
        
        classList.push(lineClass)
        
        let message = line.slice(0, line.indexOf(this.config.session.columnSeparator))
        let messageWords = message.split(' ')
        
        let bag = {}
        for (let wordsLen = messageWords.length, j = wordsLen; j > 0; j--) {
          let word = messageWords[(wordsLen - j)]
          if (word.startsWith('_') === false) {
            word = '_' + word
          }
          if (typeof words[word] === 'undefined') {
            let pos = Object.keys(words).length
            words[word] = pos
          }
          
          if (!bag[word]) {
            bag[word] = 0
          }
  
          if (this.config.session.wordVectorModel === 'TermFrequency') {
            bag[word]++
          }
          else if (this.config.session.wordVectorModel === 'BagOfWords') {
            bag[word] = 1
          }
          
          
          if (j % 10 === 5) {
            await this.utils.Async.sleep(0)
          }
        }
        
        bags.push(bag)
        
        if (i % 10 === 5) {
          //console.log('getClassifyText', 'bags', ((len - i) / len))
          await this.utils.Async.sleep(0)
        }
      }
      
  //    console.log(bags)
  //    console.log(words)
      
      // ---------------------------
      
      //console.log('getClassifyText', 'rawData', 'header')
      
      let rawData = []
      
      let headers = Object.keys(words)
      let headersLength = headers.length
      let sortedHeaders = Array(headersLength)
      for (let len = headersLength, i = len; i > 0; i--) {
        let word = headers[(len - i)]
        let headerPos = words[word]
        sortedHeaders[headerPos] = word
      }
      
      sortedHeaders.push(className)
      rawData.push(sortedHeaders)
      
      // ----------------------------
      
      //console.log('getClassifyText', 'rawData', 'bags')
      
      for (let len = bags.length, i = len; i > 0; i--) {
        let rowIndex = (len - i)
        let bag = bags[rowIndex]
        
        let row = Array(headersLength).fill(0)
        Object.keys(bag).forEach(word => {
          let index = words[word]
          row[index] = bag[word]
        })
        
        row.push(classList[rowIndex])
        rawData.push(row)
        
        if (i % 10 === 5) {
          //console.log('getClassifyText', 'rawData', ((len - i) / len))
          await this.sleep(0)
        }
      }
      
      
      // ----------------------
      // 清理一個乾淨的資料
  //    let temp = []
  //    for (let len = rawData.length, i = len; i > 0; i--) {
  //      temp.push(rawData[(len - i)])
  //    }
  //    rawData = temp
      
      // ----------------------
      
      console.log(rawData)
      this.config.state.outputTextWordVector = rawData
      
      return rawData
    },
    saveFile(ext) {
      let appendFilename = '_seg' + (new Date()).mmddhhmm()
  
      var _file_name = this.inputFilename + appendFilename + "." + ext
      var _file_content = this.outputText
      if (_file_content === "") {
        return;
      }
  
      var _character_encoding = "utf-8";
  
      let mime = 'plain'
      if (ext === 'csv') {
        mime = 'csv'
      }
  
      // ------------
  
      var blob = new Blob([_file_content], {type: "text/html;charset=" + _character_encoding})
      saveAs(blob, _file_name)
    },
  } // methods: {
}