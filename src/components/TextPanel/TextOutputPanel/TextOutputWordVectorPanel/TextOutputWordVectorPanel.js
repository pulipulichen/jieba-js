
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import {saveAs} from 'file-saver'

let TextOutputWordVectorPanel = {
  props: ['config', 'utils'],
  data () {    
    //this.$i18n.locale = this.localConfig.locale
    return {
    }
  },
  // watch: {
  //   'localConfig.locale'() {
  //     this.$i18n.locale = this.localConfig.locale;
  //   },
  // },
  watch: {
    'config.session.wordVectorModel' () {
      this.config.state.outputTextWordVector = []
    },
    'config.state.outputTextRows' () {
      if (this.config.state.outputTextRows.length === 0) {
        this.config.state.outputTextWordVector = []
      }
    }
  },
  computed: {
    outputButtonDisabled () {
      return (this.config.state.outputTextRows.length === 0)
    },
    
    outputTextWordVectorString () {
      //console.log(this.config.state.outputTextWordVector)
      return Papa.unparse(this.config.state.outputTextWordVector, {
        delimiter: this.config.state.delimiter,
        skipEmptyLines: true,
      })
    },

    computedOutputWordVectorClass () {
      if (this.config.state.outputTextWordVector.length > 0) {
        return 
      }
      return 'neet-init'
    },
    
  },
  // mounted() {
    
  // },
  methods: {
    copyOutputWordVector() {
      this.$refs.outputWordVectorCopyTextarea.select()
      document.execCommand("Copy")
    },
    saveAsWordVector: async function () {
      this.config.state.processOutputWait = true
      //console.log('saveAsBagOfWords', 1)
      await this.utils.Async.sleep(0)
      let data = await this.getClassifyText()
      //console.log(data)
      //console.log('saveAsBagOfWords', 2)
  //    data = [
  //      ['a', 'b'],
  //      [1, 2],
  //    ]
  //    console.log(data)
  
      //console.log('saveAsBagOfWords', 2)
      let appendFilename = '_seg' + this.utils.Date.mmddhhmm()
      var filename = this.config.session.inputFilename + appendFilename + ".ods"
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
  
      let ws = this.utils.Sheet.aoa_to_sheet(data)
      //console.log(ws)
      wb.Sheets["data"] = ws
  
      //var wbout = XLSX.write(wb, {bookType: 'ods', bookSST: true, type: 'base64'});
      //let filename = 'jieba-js-config_' + (new Date()).mmddhhmm() + '.ods'
      //saveAs(new Blob([this.s2ab(wbout)], {type: "application/octet-stream"}), filename);
  
      XLSX.writeFile(wb, filename);
  
      this.config.state.processOutputWait = false
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
      if (this.config.state.outputTextWordVector.length > 0) {
        return this.config.state.outputTextWordVector
      }
      
      if (window.confirm(`Process model requires a long time. Will you continue?`) === false) {
        return false
      }

      this.config.state.processOutputWait = true

      let lines = this.config.state.outputTextRows
      //console.log(lines)
      //let lines = outputText.split('\n')
      
      //let classColumnName = this.config.state.classColumnName
      // if (this.config.session.doRemoveHeader === true) {
      //   let headerLine = lines.shift()

      //   let setPos = headerLine.indexOf(this.config.session.columnSeparator)
      //   if (setPos === -1) {
      //     setPos = headerLine.indexOf('\t')
      //   }

      //   className = headerLine.slice(setPos + 1)
      // }
      
      // ---------------------------
      
      let bags = []
      let classList = []
      let words = {}
      
      //console.log('getClassifyText', 'bags')
      //console.log(lines)

      for (let len = lines.length, i = len; i > 0; i--) {
        // let line = lines[(len - i)]

        // let setPos = line.indexOf(this.config.session.columnSeparator)
        // if (setPos === -1) {
        //   setPos = line.indexOf('\t')
        // }

        // let lineClass = null
        // if (setPos > -1) {
        //   lineClass = line.slice(line.indexOf(setPos) + 1).trim()
        // }

        // console.log(this.config.state.selectClasses, lineClass, setPos)
        // if (this.config.state.selectClasses.indexOf(lineClass) === -1) {
        //   continue
        // }
                
        // let message
        // if (setPos > -1) {
        //   message = line.slice(0, setPos).trim()
        // }
        let line = lines[(len - i)]
        //console.log(lines[i])
        let className = this.$parent.getLineClass(line)
        classList.push(className)
        let messageWords = this.$parent.getLineText(line)

        //let messageWords = message.split(' ')
        //console.log(messageWords)
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
      } // for (let len = lines.length, i = len; i > 0; i--) {
      
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
      
      sortedHeaders.push(this.config.state.classColumnName)
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
          await this.utils.Async.sleep(0)
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
      
      //console.log(rawData)
      //console.log(rawData)
      this.config.state.outputTextWordVector = rawData
      
      this.config.state.processOutputWait = false

      return rawData
    },
    
    
    
    initOutputWordVector () {
      // console.log(this.config.state.outputTextWordVector.length)
      if (this.config.state.outputTextWordVector.length === 0) { 
        this.getClassifyText() 
      }
    }
  }
}

export default TextOutputWordVectorPanel