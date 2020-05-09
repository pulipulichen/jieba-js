/* global XLSX */

let postMessageAPI = PuliPostMessageAPI()

var app = new Vue({
  el: '#app',
  data: {
    inputFilename: `Raw Text`,
    inputText: `這個布丁 是在無聊的世界中找尋樂趣的一種不能吃的食物，
喜愛動漫畫、遊戲、coding，以及跟世間脫節的生活步調。`,
    outputText: `布丁 是 在 無聊的世界 中 找尋樂趣 的 一種 不能 吃 的 食物
喜愛 動漫畫 遊戲 coding 以及 跟 世間 脫節 的 生活 步調`,
    //step: 2,
    segmentationMethod: 'dictionary',
    nGramLength: 2,
    configUserDictionary: `找尋樂趣,9999999,n
無聊的世界,9999999,n`,
    configUserDictionaryExample: '',
    configWordRemap: `食物,甜點`,
    configWordRemapExample: '',
    configStopWords: `這個
，
、
。`,
    configStopWordsExample: '',
    usePorterStemmer: true,
    jiebaInited: false,
    processOutputWait: false,
    //displayPanel: 'text',
    displayPanel: 'configuration',
    persistKey: 'jieba-js.' + location.href
  },
  computed: {
    configWordRemapArray () {
      let output = this.configWordRemap.trim().split("\n")
      output = output.map(line => line.trim())
              .filter(line => (line.indexOf(',') > -1 && line !== '') )
              .map(line => {
                let targetWord = line.slice(0, line.indexOf(',')).trim()
                let replaceWord = line.slice(line.indexOf(',') + 1).trim()
                return {
                  targetWord,
                  replaceWord
                }
              })
      return output
    },
    configUserDictionaryArray () {
      var _config = this.configUserDictionary.trim().split("\n")
      var _output = [];
      for (var _l in _config) {
        if (_config[_l].indexOf(',') === -1) {
          continue
        }
        var _line = _config[_l].split(",");
        _output.push([
          _line[0].trim(),
          parseInt(_line[1]),
          _line[2]
        ]);
      }
      //console.log(_output)
      return _output;
    },
    configStopWordsArray () {
      return this.configStopWords.trim().split("\n")
              .map(line => line.trim())
              .filter(line => (line !== '') )
    },
    outputButtonDisabled () {
      return (this.outputText.trim() === '')
    }
  },
  mounted () {
    this.configUserDictionaryExample = this.configUserDictionary
    this.configWordRemapExample = this.configWordRemap
    this.configStopWordsExample = this.configStopWords
    
    //console.log(stemmer("hopefully", true), stemmer("loves", true))
    
    this.loadPersistedData()
    
    setTimeout(() => {
      //this.processOutput()
    }, 1000)
  },
  watch: {
    segmentationMethod () {
      this.persist()
    },
    nGramLength () {
      this.persist()
    },
    configUserDictionary () {
      this.persist()
    },
    configWordRemap () {
      this.persist()
    },
    configStopWords () {
      this.persist()
    },
    usePorterStemmer () {
      this.persist()
    },
  },
  methods: {
    persist () {
      let key = this.persistKey
      let data = {
        segmentationMethod: this.segmentationMethod,
        nGramLength: this.nGramLength,
        configUserDictionary: this.configUserDictionary,
        configWordRemap: this.configWordRemap,
        configStopWords: this.configStopWords,
        usePorterStemmer: this.usePorterStemmer
      }
      localStorage.setItem(key, JSON.stringify(data))
    },
    loadPersistedData () {
      let dataString = localStorage.getItem(this.persistKey)
      if (dataString) {
        let data = JSON.parse(dataString)
        for (let key in data) {
          this[key] = data[key]
        }
      }
    },
    loadInputFile (evt) {
      //console.log(1);
      if(!window.FileReader) return; // Browser is not compatible

      this.processOutputWait = true
      var reader = new FileReader();
      let filename = evt.target.files[0].name
      let type = evt.target.files[0].type
      console.log(type)
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
        }
        else if (type === 'application/vnd.oasis.opendocument.text') {
          this.inputText = await this.processUploadTypeODT(result)
        }
        else if (type === 'text/html') {
          this.inputText = this.processUploadTypeHTML(result)
        }
        else if (type === 'text/csv') {
          this.inputText = await this.processUploadTypeCSV(result)
        }
        else {
          this.inputText = result
        }
        this.$refs.inputFileUploadTrigger.value = ''
        this.processOutputWait = false
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
    },
    processUploadTypeHTML (html) {
      if (html.indexOf('<article') > -1) {
        html = html.slice(html.indexOf('<article'), html.lastIndexOf('</article>') + 1)
        html = html.replace('<article', '<div')
          .replace('</article>', '</div>')
      }
      else if (html.indexOf('<body') > -1) {
        html = html.slice(html.indexOf('<body'), html.lastIndexOf('</body>') + 1)
        html = html.replace('<body', '<div')
          .replace('</body>', '</div>')
      }
      
      let $html = $(html)
      $html.find('script').remove()
      html = $html.text()

      html = html.split('\n')
              .map(line => line.trim())
              .filter(line => line !== '')
              .join('\n')
      return html
    },
    processUploadTypeSheet: async function (input) {
      var workbook = await XLSX.readAsync(input, {type: 'binary'});
      
      var result = [];
      for (let i in workbook.SheetNames) {
        let sheetName = workbook.SheetNames[i]

        var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName], {
          FS: ' ',
          blankrows: false
        });
        
        //console.log(csv)
        result.push(csv.trim())
      }
      
      result = result.join('\n')
      result = result.split('\n').map(line => line.trim()).filter(line => (line !== '')).join('\n')

      return result
    },
    sleep: async function (ms) {
      if (typeof(ms) !== 'number') {
        ms = 1
      }

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, ms)
      })
    },
    processUploadTypeCSV: async function (input) {
      var workbook = await XLSX.readAsync(input, {type: 'string'});
      
      var result = [];
      for (let i in workbook.SheetNames) {
        let sheetName = workbook.SheetNames[i]

        var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName], {
          FS: ' ',
          blankrows: false
        });
        
        //console.log(csv)
        result.push(csv.trim())
      }
      
      result = result.join('\n')
      result = result.split('\n').map(line => line.trim()).filter(line => (line !== '')).join('\n')

      return result
    },
    processUploadTypeODT: async function (odt) {
      try {
        let html = new ODTDocument(odt).getHTML()
        return this.processUploadTypeHTML(html)
      } catch (e) {
        alert("Couldn't parse odt file.");
        throw e;
      }
    },
    computedStepClass: function (stepID) {
      return {
        'completed': (this.step > stepID),
        'active': (this.step === stepID)
      }
    },
    downloadConfiguration () {
      console.error('@TODO')
    },
    setExampleUserDictionary () {
      if (this.configUserDictionaryExample !== this.configUserDictionary) {
        if (window.confirm('Are you sure to replace existed content?') === false) {
          return false
        }
      }
      else {
        return false
      }
      this.configUserDictionary = this.configUserDictionaryExample
    },
    setExampleWordRemap () {
      if (this.configWordRemapExample !== this.configWordRemap) {
        if (window.confirm('Are you sure to replace existed content?') === false) {
          return false
        }
      }
      else {
        return false
      }
      this.configWordRemap = this.configWordRemapExample
    },
    setExampleStopWords () {
      if (this.configStopWordsExample !== this.configStopWords) {
        if (window.confirm('Are you sure to replace existed content?') === false) {
          return false
        }
      }
      else {
        return false
      }
      this.configStopWords = this.configStopWordsExample
    },
    copyOutput () {
      this.$refs.outputCopyTextarea.select()
      document.execCommand("Copy")
    },
    saveAsText () {
      this.saveFile('txt')
    },
    saveAsSheet () {
      console.error('@TODO')
    },
    saveFile (ext) {
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
    drawWordCloud () {
      let url = '//pulipulichen.github.io/d3-cloud/index.html'
      //let url = 'http://localhost:8383/d3-cloud/index.html'
      //let url = 'http://pc.pulipuli.info:8383/d3-cloud/index.html'
      
      postMessageAPI.send(url, this.outputText, {
        mode: 'popup'
      })
    },
    analyzeText () {
      let url = '//pulipulichen.github.io/HTML5-Text-Analyzer/index.html'
      //let url = 'http://localhost:8383/HTML5-Text-Analyzer/index.html'
      //let url = 'http://pc.pulipuli.info:8383/HTML5-Text-Analyzer/index.html'
      
      postMessageAPI.send(url, this.outputText, {
        mode: 'popup',
        newWindow: true
      })
    },
    extractThemes () {
      console.error('@TODO')
    },
    processOutput () {
      this.outputText = ''
      if (this.jiebaInited === false
              && this.segmentationMethod === 'dictionary') {
        $.getScript('require-jieba-js.js', () => {
          //console.log('OK')
          this.jiebaInited = true
          this.processOutputInited()
        })
      }
      else {
        this.processOutputInited()
      }
    },
    processOutputInited: async function () {
      this.processOutputWait = true
      var _text = this.inputText
      _text = this.filterWordRemap(_text)

      this.outputText
      
      let rule = this.segmentationMethod
      //if (rule === 'n-gram') {
      //  _text = this.filterStopWords(_text)
      //}

      var _custom_dict = this.configUserDictionaryArray

      var _text_array = _text.split('\n')
      var _result_array = []
      return new Promise((resolve, reject) => {
        //console.log('start promise')
        let next = (_result, i) => {
          _result = this.filterStopWords(_result);

          _result = _result.join(" ");
          while (_result.indexOf("  ") > -1) {
            _result = _result.replace(/  /g, ' ');
          }
          _result = _result.replace(/ \n /g, "\n");
          _result = _result.replace(/ \t /g, " ");
          _result = _result.replace(/\t/g, " ");
          _result = _result.replace(/ \' /g, "'");
          _result = _result.replace(/\' /g, "'");
          if (_result.startsWith('" ')) {
            _result = _result.slice(2)
          }
          _result = _result.trim();

          _result_array.push(_result)
          i++
          loop(i)
        }

        let loop = (i) => {
          //console.log('loop', i)
          if (i < _text_array.length) {
            if (rule === 'dictionary') {
              let line = _text_array[i]
              if ((line.startsWith('"') && line.endsWith('"'))
                      || (line.startsWith("'") && line.endsWith("'"))) {
                line = line.slice(1, -1).trim()
              }
              call_jieba_cut(line, _custom_dict, function (_result) {
                next(_result, i)
              });
            } else {
              let _result = this.processNGram(_text_array[i])
              next(_result, i)
            }
          } else {
            // 完成
            //console.log(_result_array)
            this.outputText = _result_array.join('\n')
            this.processOutputWait = false
            resolve(true)
          }
        }

        loop(0)
      })
    },
    filterWordRemap (text) {
      this.configWordRemapArray.forEach((targetWord, replaceWord) => {
        text = text.split(targetWord).join(replaceWord)
      })
      return text
    },
    filterStopWords (result) {
      //console.log(result)
      return result.filter(word => (this.configStopWordsArray.indexOf(word) === -1))
    },
    processNGram (text) {
      text = text.trim()
      //console.log(text)
      let gram = this.nGramLength
      gram = parseInt(gram, 10)
      let output = []
      //console.log([gram, text.substr(0, 2), text.length - gram + 1])

      text.split(' ').forEach(part => {
        part = part.trim()
        if (part.length < gram) {
          output.push(part)
        }
        for (let i = 0; i < part.length - gram + 1; i++) {
          output.push(part.substr(i, gram))
        }
      })

      return output
    }
  }
})