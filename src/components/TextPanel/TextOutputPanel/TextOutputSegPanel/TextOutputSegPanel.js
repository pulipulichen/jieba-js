import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import {saveAs} from 'file-saver'

let TextOutputSegPanel = {
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
    'config.state.outputTextRows' () {
      if (this.config.state.outputTextRows.length === 0) {
        this.config.state.outputTextRowsJoined = []
      }
      
    }
  },
  computed: {
    outputButtonDisabled () {
      return (this.config.state.outputTextRows.length === 0)
    },
    
    outputText () {
      // console.log(this.config.state.outputTextRowsJoined)

      let output = Papa.unparse(this.config.state.outputTextRowsJoined, {
        delimiter: this.config.state.delimiter,
        skipEmptyLines: true,
      })

      // console.log(output)
      // console.log(this.config.session.doRemoveHeader, output.startsWith('0\r\n'), output.slice(0, 3), (this.config.session.doRemoveHeader === false && output.startsWith('0\r\n')))

      if (this.config.session.doRemoveHeader === false && output.startsWith('0\r\n') ) {
          output = output.slice(3)
      }

      // console.log(output)
      return output
    },
    computedOutputTextClass () {
      if (this.config.state.outputTextRows.length > 0) {
        return
      }
      return 'neet-init'
    },
    outputODSArray () {
      let output = [
        this.config.state.columnNames
      ]

      this.config.state.outputTextRowsJoined.forEach((row, i) => {
        // console.log(i, row)
        let line = Object.keys(row).map(key => row[key])
        output.push(line)
      })

      return output
    },
  },
  // mounted() {
    
  // },
  methods: {
    copyOutput() {
    
      this.$refs.outputCopyTextarea.select()
      document.execCommand("Copy")
    },
    saveAsText() {
      this.saveFile('txt')
    },
    saveFile(ext) {
      let appendFilename = '_seg' + this.utils.Date.mmddhhmm()
  
      var _file_name = this.config.session.inputFilename + appendFilename + "." + ext
      //console.log(_file_name)
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
    saveOutputODS () {
      this.config.state.processOutputWait = true
      
      let appendFilename =  this.utils.Date.mmddhhmm()
      var filename = this.config.session.inputFilename + appendFilename + ".ods"

      var wb = XLSX.utils.book_new();
  
      wb.SheetNames.push("data")
  
      console.log(this.outputODSArray)

      let ws = this.utils.Sheet.aoa_to_sheet(this.outputODSArray)
      //console.log(ws)
      wb.Sheets["data"] = ws
  
      //var wbout = XLSX.write(wb, {bookType: 'ods', bookSST: true, type: 'base64'});
      //let filename = 'jieba-js-config_' + (new Date()).mmddhhmm() + '.ods'
      //saveAs(new Blob([this.s2ab(wbout)], {type: "application/octet-stream"}), filename);
  
      XLSX.writeFile(wb, filename);
  
      this.config.state.processOutputWait = false
    },
    saveOutputCSV () {
      this.config.state.processOutputWait = true
      
      let appendFilename =  this.utils.Date.mmddhhmm()
      var filename = this.config.session.inputFilename + appendFilename + ".csv"

      var wb = XLSX.utils.book_new();
  
      wb.SheetNames.push("data")
  
      let ws = this.utils.Sheet.aoa_to_sheet(this.outputODSArray)
      //console.log(ws)
      wb.Sheets["data"] = ws
  
      //var wbout = XLSX.write(wb, {bookType: 'ods', bookSST: true, type: 'base64'});
      //let filename = 'jieba-js-config_' + (new Date()).mmddhhmm() + '.ods'
      //saveAs(new Blob([this.s2ab(wbout)], {type: "application/octet-stream"}), filename);
  
      XLSX.writeFile(wb, filename);
  
      this.config.state.processOutputWait = false
    },
    initOutputText () {
      if (this.config.state.outputTextRows.length === 0) { 
        this.$parent.$parent.$refs.TextProcessComponent.processOutput()
      }
    },
  }
}

export default TextOutputSegPanel