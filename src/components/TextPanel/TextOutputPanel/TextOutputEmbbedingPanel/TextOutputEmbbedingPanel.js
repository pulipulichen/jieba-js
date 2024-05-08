
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import {saveAs} from 'file-saver'
import testEmbbeding from './testEmbbeding.js'

let TextOutputEmbbedingPanel = {
  props: ['config', 'utils'],
  data () {    
    //this.$i18n.locale = this.localConfig.locale
    return {
      cacheOutput: [],
      model: null
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
        this.cacheOutput = []
      }
    }
  },

  computed: {
    outputButtonDisabled () {
      return (this.cacheOutput.length === 0)
    },
    
    outputTextString () {
      if (this.cacheOutput.length === 0) {
        return ''
      }

      //console.log(this.config.state.outputTextWordVector)
      return Papa.unparse(this.cacheOutput, {
        delimiter: this.config.state.delimiter,
        skipEmptyLines: true,
      })
    },

    computedOutputClass () {
      if (this.cacheOutput.length > 0) {
        return 
      }
      return 'neet-init'
    },
    cacheOutputArray () {
      if (this.cacheOutput.length === 0) {
        return []
      }

      let output = [
        Object.keys(this.cacheOutput[0])
      ]

      this.cacheOutput.forEach(row => {
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
      this.$refs.outputTextarea.select()
      document.execCommand("Copy")
    },
    saveAsSheet: async function () {
      this.config.state.processOutputWait = true
      
      let appendFilename = '_embed_' + this.utils.Date.mmddhhmm()
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
      this.config.state.processOutputWait = true
      
      let appendFilename = '_embed_' + this.utils.Date.mmddhhmm()
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
    
    initOutput: async function () {
      if (this.cacheOutput.length === 0) { 
        await this.startProcess() 
      }
    },

    startProcess: async function (showWarning = true) {
      if (showWarning && window.confirm(`Process model requires a long time. Will you continue?`) === false) {
        return false
      }

      let cache = this.$parent.$refs.TextOutputTransPanel.cacheTrans

      if (cache.length === 0) {
        // console.log('go')
        await this.$parent.$refs.TextOutputTransPanel.startTrans(false)
        cache = this.$parent.$refs.TextOutputTransPanel.cacheTrans
        // console.log('go2', cache, cache.length)
        if (cache.length === 0) {
          return false
        }
      }

      this.config.state.processOutputWait = true

      //let e = await this.parseSentenceEmbedding('This is a pen.')
      //console.log(e)

      if (this.cacheOutput.length > 0) {
        return this.cacheOutput
      }

      

      for (let i = 0; i < cache.length; i++) {
        let row = cache[i]

        let text = this.getLineText(row)
        let textEmbedd = await this.parseSentenceEmbedding(text, 'en')
        //console.log(textEmbedd)
        //this.setLineText(cache, i, textTrans)
        let output = {}
        let className = cache[i][this.config.state.classColumnName]
        //delete cache[i][this.config.state.textColumnName]
        textEmbedd.forEach((t, j) => {
          output[this.config.state.textColumnName + j] = t
        })

        output[this.config.state.classColumnName] = className
        cache[i] = output
      }

      this.cacheOutput = cache

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
        rows[i][this.config.state.textColumnName] = lineText
      }
      else {
        rows[i] = lineText
      }
    },
    loadScript: async function (link) {
      if (Array.isArray(link)) {
        for (let i = 0; i < link.length; i++) {
          await this.loadScript(link[i])
        }
        return true
      }

      return new Promise(function (resolve, reject) {
        $.getScript(link, resolve)
      })
    },
    getModel: async function () {
      if (this.model) {
        return this.model
      }
      
      await this.loadScript([
        'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs',
        'https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder'
      ])

      return new Promise((resolve) => {
        // <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
        // <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder"></script>
        
        use.load().then(model => {
          this.model = model
          resolve(model)
        });
      })
    },
    parseSentenceEmbedding: async function (sentence) {
      if (this.config.development.debug.skipEmbbeding === true) {
        return testEmbbeding
      }

      let model = await this.getModel()
      
      return new Promise((resolve) => {
        model.embed(sentence).then(async (embeddings) => {
          // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
          // So in this example `embeddings` has the shape [2, 512].
          //embeddings.print(true /* verbose */);
          
          let array = await embeddings.arraySync()
          resolve(array[0])
        });
      })
    },
    getClassifyText () {
      //console.log('1111')
      return this.cacheOutputArray
    }
  }
}

export default TextOutputEmbbedingPanel