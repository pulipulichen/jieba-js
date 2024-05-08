
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import {saveAs} from 'file-saver'

let TextOutputTransPanel = {
  props: ['config', 'utils'],
  data () {    
    //this.$i18n.locale = this.localConfig.locale
    return {
      cacheTrans: []
    }
  },
  // watch: {
  //   'localConfig.locale'() {
  //     this.$i18n.locale = this.localConfig.locale;
  //   },
  // },
  watch: {
    'config.state.outputTextRows' () {
      if (this.config.state.outputTextRows.length === 0) {
        this.cacheTrans = []
      }
    }
  },

  computed: {
    outputButtonDisabled () {
      return (this.cacheTrans.length === 0)
    },
    
    outputTextTransString () {
      //console.log(this.config.state.outputTextWordVector)
      return Papa.unparse(this.cacheTrans, {
        delimiter: this.config.state.delimiter,
        skipEmptyLines: true,
      })
    },

    computedOutputClass () {
      if (this.cacheTrans.length > 0) {
        return 
      }
      return 'neet-init'
    },
    cacheOutputArray () {
      let output = [
        this.config.state.columnNames
      ]

      this.cacheTrans.forEach(row => {
        let line = Object.keys(row).map(key => row[key])
        output.push(line)
      })

      return output
    }
  },
  // mounted() {
    
  // }, 
  methods: {
    copy() {
      this.$refs.outputTransTextarea.select()
      document.execCommand("Copy")
    },
    saveAsSheet: async function () {
      this.config.state.processOutputWait = true
      
      let appendFilename = '_trans_' + this.utils.Date.mmddhhmm()
      var filename = this.config.session.inputFilename + appendFilename + ".ods"

      var wb = XLSX.utils.book_new();
  
      wb.SheetNames.push("data")
  
      let ws = this.utils.Sheet.aoa_to_sheet(this.cacheOutputArray)
      //console.log(ws)
      wb.Sheets["data"] = ws
  
      //var wbout = XLSX.write(wb, {bookType: 'ods', bookSST: true, type: 'base64'});
      //let filename = 'jieba-js-config_' + (new Date()).mmddhhmm() + '.ods'
      //saveAs(new Blob([this.s2ab(wbout)], {type: "application/octet-stream"}), filename);
  
      XLSX.writeFile(wb, filename);
  
      this.config.state.processOutputWait = false
    },
    saveAsSheetCSV: async function () {
      this.config.state.processOutputWait = true // ok
       
      let appendFilename = '_trans_' + this.utils.Date.mmddhhmm()
      var filename = this.config.session.inputFilename + appendFilename + ".csv"

      var wb = XLSX.utils.book_new();
  
      wb.SheetNames.push("data")
  
      let ws = this.utils.Sheet.aoa_to_sheet(this.cacheOutputArray)
      //console.log(ws)
      wb.Sheets["data"] = ws
  
      //var wbout = XLSX.write(wb, {bookType: 'ods', bookSST: true, type: 'base64'});
      //let filename = 'jieba-js-config_' + (new Date()).mmddhhmm() + '.ods'
      //saveAs(new Blob([this.s2ab(wbout)], {type: "application/octet-stream"}), filename);
  
      XLSX.writeFile(wb, filename);
  
      this.config.state.processOutputWait = false
    },
    
    initOutputTrans: async function () {
      if (this.cacheTrans.length === 0) { 
        await this.startTrans() 
      }
    },

    startTrans: async function (showWarning = true) {
      if (showWarning && window.confirm(`Process model requires a long time. Will you continue?`) === false) {
        return false
      }

      if (this.config.state.outputTextRows.length === 0) { 
        await this.$parent.$parent.$refs.TextProcessComponent.processOutput()
      }

      this.config.state.processOutputWait = true
      console.log(this.cacheTrans)
      if (this.cacheTrans.length > 0) {
        return this.cacheTrans
      }

      // console.log(this.config.state.outputTextRowsJoined)
      let input = await this.$parent.$parent.$refs.TextProcessComponent.parseJSONArray()
      // let input = this.config.state.outputTextRowsJoined
      let cache = [].concat(input)
      // console.log(input)
      // console.log(this.config.state.outputTextRowsJoined)

      for (let i = 0; i < cache.length; i++) {
        let row = cache[i]

        let text = this.getLineText(row)
        let textTrans
        if (this.config.development.debug.skipTrans === false) {
          // console.log(text)
          textTrans = await this.utils.Trans.trans(text, 'en') 
        }
        else {
          textTrans = 'This is a pen.'
        }
        
        this.setLineText(cache, i, textTrans)
      }

      this.cacheTrans = cache

      this.config.state.processOutputWait = false
    },
    getLineText (line) {
      if (this.config.state.textColumnName && 
        line[this.config.state.textColumnName]) {
        return line[this.config.state.textColumnName]
      }
      return line
    },
    setLineText (rows, i, lineText) {
      //console.log(lineText)
      if (this.config.state.textColumnName && 
        rows[i][this.config.state.textColumnName]) {
        let temp = {
          ...rows[i]
        }
        temp[this.config.state.textColumnName] = lineText
        rows[i] = temp
      }
      else {
        rows[i] = lineText
      }
    },
  }
}

export default TextOutputTransPanel