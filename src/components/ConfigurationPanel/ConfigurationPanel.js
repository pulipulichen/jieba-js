import jQuery from 'jquery'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'

export default {
  props: ['config', 'utils'],
  mounted: async function () {
    this.initExample()

    await this.loadFullStopWordsOnMount()
  },  // mounted: function () {
  // computed: {
    
  // },  // computed: {
  methods: {
    initExample () {
      this.config.state.configUserDictionaryExample = this.config.session.configUserDictionary
      this.config.state.configWordRemapExample = this.config.session.configWordRemap
      this.config.state.configStopWordsExample = this.config.session.configStopWords
    },
    downloadConfiguration() {
      
      let wb = XLSX.utils.book_new();
  
      wb.SheetNames.push("Segmentation")
      wb.Sheets["Segmentation"] = this.utils.Sheet.aoa_to_sheet([
        ['field', 'value'],
        ['segmentationMethod', this.config.session.segmentationMethod],
        ['nGramLength', this.config.session.nGramLength],
        ['removeEnglish', this.config.session.removeEnglish],
        ['removeNumber', this.config.session.removeNumber],
        ['usePorterStemmer', this.config.session.usePorterStemmer],
      ])
  
      wb.SheetNames.push("UserDictionary")
      wb.Sheets["UserDictionary"] = this.utils.Sheet.aoa_to_sheet([['word', 'weight', 'pos']].concat(this.config.computed.configUserDictionaryArray))
  
      wb.SheetNames.push("WordRemap")
      wb.Sheets["WordRemap"] = this.utils.Sheet.aoa_to_sheet([['from', 'to']].concat(this.config.computed.configWordRemapArray.map(({targetWord, replaceWord}) => [targetWord, replaceWord])))
  
      wb.SheetNames.push("StopWords")
      wb.Sheets["StopWords"] = this.utils.Sheet.aoa_to_sheet([['stopword']].concat(this.config.computed.configStopWordsArray.map(line => [line])))
  
      let wbout = XLSX.write(wb, {bookType: 'ods', type: 'binary'});
      let filename = 'jieba-js-config_' + (new Date()).mmddhhmm() + '.ods'
      
      FileSaver.saveAs(new Blob([this.utils.Sheet.s2ab(wbout)], {type: "application/octet-stream"}), filename);
    },
    loadFullStopWords() {
      
      if (!this.config.state.fullStopWords) {
        this.config.state.processOutputWait = true
        
        jQuery.get('stop_words.txt', (stop_words) => {
          this.config.state.fullStopWords = stop_words
          this.loadFullStopWordsInited()
          this.config.state.processOutputWait = false
        })
      } else {
        this.loadFullStopWordsInited()
      }
    },
    loadFullStopWordsInited(doConfirm) {
      if (doConfirm === undefined) {
        doConfirm = true
      }
      if (doConfirm === true
              && this.config.state.fullStopWords !== this.config.session.configStopWords
              && this.config.session.configStopWords
              && this.config.session.configStopWords.trim() !== '') {
        if (window.confirm('Are you sure to replace existed content?') === false) {
          return false
        }
      }
      this.config.session.configStopWords = this.config.state.fullStopWords
    },
    processUploadConfiguration: async function (input) {
      var workbook = await XLSX.readAsync(input, {type: 'binary'});
  
      var result = [];
      for (let i in workbook.SheetNames) {
        let sheetName = workbook.SheetNames[i]
  
        var json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
        if (sheetName === 'Segmentation') {
          json.forEach(({key, value}) => {
            this[key] = value
          })
        } else if (sheetName === 'UserDictionary') {
          this.configUserDictionary = json.map(({word, weight, pos}) => [word, weight, pos].join(',')).join('\n')
        } else if (sheetName === 'WordRemap') {
          this.configWordRemap = json.map(({from, to}) => [from, to].join(',')).join('\n')
        } else if (sheetName === 'StopWords') {
          this.configStopWords = json.map(({stopword}) => stopword).join('\n')
        }
        //result.push(csv.trim())
      }
  
    },
    setExampleUserDictionary() {
      if (this.config.state.configUserDictionaryExample !== this.config.session.configUserDictionary
              && this.config.session.configUserDictionary.trim() !== '') {
        if (window.confirm('Are you sure to replace existed content?') === false) {
          return false
        }
      } else {
        return false
      }
      this.config.session.configUserDictionary = this.config.state.configUserDictionaryExample
    },
    setExampleWordRemap() {
      if (this.config.state.configWordRemapExample !== this.config.session.configWordRemap
              && this.config.session.configWordRemap.trim() !== '') {
        if (window.confirm('Are you sure to replace existed content?') === false) {
          return false
        }
      } else {
        return false
      }
      this.config.session.configWordRemap = this.config.state.configWordRemapExample
    },
    setExampleStopWords() {
      if (this.config.state.configStopWordsExample !== this.config.session.configStopWords
              && this.config.session.configStopWords.trim() !== '') {
        if (window.confirm('Are you sure to replace existed content?') === false) {
          return false
        }
      } else {
        return false
      }
      this.config.session.configStopWords = this.config.state.configStopWordsExample
    },
    loadFullStopWordsOnMount: async function () {
      if (typeof(this.config.development.configStopWordsFile) !== 'string') {
        return false
      }
      else {
        return new Promise(resolve => {
          this.config.state.processOutputWait = true
          jQuery.get('stop_words.txt', (stop_words) => {
            this.config.state.fullStopWords = stop_words
            this.config.session.configStopWords = this.fullStopWords
            this.config.state.processOutputWait = false
            resolve()
          })
        })
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
  } // methods: {
}