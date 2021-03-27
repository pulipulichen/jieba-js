/* global postMessageAPI, XLSX */

var appMethods = {
  setupAPI() {
    postMessageAPI.addReceiveListener(async (data) => {
      //console.log('收到資料了', data)
      if (typeof (data) === 'string') {
        this.inputText = data
      } else {
        for (let key in data) {
          this[key] = data[key]
        }
      }

      return await this.processOutput()
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
  },
  processUploadTypeHTML(html) {
    if (html.indexOf('<article') > -1) {
      html = html.slice(html.indexOf('<article'), html.lastIndexOf('</article>') + 1)
      html = html.replace('<article', '<div')
              .replace('</article>', '</div>')
    } else if (html.indexOf('<body') > -1) {
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
  sleep: async function (ms) {
    if (typeof (ms) !== 'number') {
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
  s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i = 0; i < s.length; i++)
      view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
  },
  downloadConfiguration() {
    var wb = XLSX.utils.book_new();

    wb.SheetNames.push("Segmentation")
    wb.Sheets["Segmentation"] = XLSX.utils.aoa_to_sheet([
      ['field', 'value'],
      ['segmentationMethod', this.segmentationMethod],
      ['nGramLength', this.nGramLength],
      ['removeEnglish', this.removeEnglish],
      ['removeNumber', this.removeNumber],
      ['usePorterStemmer', this.usePorterStemmer],
    ])

    wb.SheetNames.push("UserDictionary")
    wb.Sheets["UserDictionary"] = XLSX.utils.aoa_to_sheet([['word', 'weight', 'pos']].concat(this.configUserDictionaryArray))

    wb.SheetNames.push("WordRemap")
    wb.Sheets["WordRemap"] = XLSX.utils.aoa_to_sheet([['from', 'to']].concat(this.configWordRemapArray.map(({targetWord, replaceWord}) => [targetWord, replaceWord])))

    wb.SheetNames.push("StopWords")
    wb.Sheets["StopWords"] = XLSX.utils.aoa_to_sheet([['stopword']].concat(this.configStopWordsArray.map(line => [line])))

    var wbout = XLSX.write(wb, {bookType: 'ods', type: 'binary'});
    let filename = 'jieba-js-config_' + (new Date()).mmddhhmm() + '.ods'
    saveAs(new Blob([this.s2ab(wbout)], {type: "application/octet-stream"}), filename);
  },
  setExampleUserDictionary() {
    if (this.configUserDictionaryExample !== this.configUserDictionary
            && this.configUserDictionary.trim() !== '') {
      if (window.confirm('Are you sure to replace existed content?') === false) {
        return false
      }
    } else {
      return false
    }
    this.configUserDictionary = this.configUserDictionaryExample
  },
  setExampleWordRemap() {
    if (this.configWordRemapExample !== this.configWordRemap
            && this.configWordRemap.trim() !== '') {
      if (window.confirm('Are you sure to replace existed content?') === false) {
        return false
      }
    } else {
      return false
    }
    this.configWordRemap = this.configWordRemapExample
  },
  setExampleStopWords() {
    if (this.configStopWordsExample !== this.configStopWords
            && this.configStopWords.trim() !== '') {
      if (window.confirm('Are you sure to replace existed content?') === false) {
        return false
      }
    } else {
      return false
    }
    this.configStopWords = this.configStopWordsExample
  },
  loadFullStopWordsOnMount: async function () {
    if (typeof(this.configStopWordsFile) !== 'string') {
      return false
    }
    else {
      return new Promise(resolve => {
        this.processOutputWait = true
        $.get('stop_words.txt', (stop_words) => {
          this.fullStopWords = stop_words
          this.configStopWords = this.fullStopWords
          this.processOutputWait = false
          resolve()
        })
      })
    }
  },
  loadFullStopWords() {
    if (!this.fullStopWords) {
      this.processOutputWait = true
      $.get('stop_words.txt', (stop_words) => {
        this.fullStopWords = stop_words
        this.loadFullStopWordsInited()
        this.processOutputWait = false
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
            && this.fullStopWords !== this.configStopWords
            && this.configStopWords.trim() !== '') {
      if (window.confirm('Are you sure to replace existed content?') === false) {
        return false
      }
    }
    this.configStopWords = this.fullStopWords
  },
  copyOutput() {
    this.$refs.outputCopyTextarea.select()
    document.execCommand("Copy")
  },
  saveAsText() {
    this.saveFile('txt')
  },
  saveAsSheet() {
    console.error('@TODO')
  },
  saveAsBagOfWords: async function () {
    let data = await this.getClassifyText()
    
    var wb = XLSX.utils.book_new();

    let sheetName = "bag-of-words"
    wb.SheetNames.push(sheetName)
    wb.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(data)
    
    var wbout = XLSX.write(wb, {bookType: 'ods', type: 'binary'});
    
    let appendFilename = '_seg' + (new Date()).mmddhhmm()
    var filename = this.inputFilename + appendFilename + ".ods"
    
    saveAs(new Blob([this.s2ab(wbout)], {type: "application/octet-stream"}), filename);
    
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
  drawWordCloud() {
    let url = 'https://pulipulichen.github.io/d3-cloud/index.html?api=1'
    //let url = 'http://localhost:8383/d3-cloud/index.html'
    //let url = 'http://pc.pulipuli.info:8383/d3-cloud/index.html'

    postMessageAPI.send(url, this.outputTextForAPI, {
      mode: 'popup',
      newWindow: true,
      features: 0.8
    })
  },
  analyzeText() {
    let url = 'https://pulipulichen.github.io/HTML5-Text-Analyzer/index.html?api=1'
    //let url = 'http://localhost:8383/HTML5-Text-Analyzer/index.html'
    //let url = 'http://pc.pulipuli.info:8383/HTML5-Text-Analyzer/index.html'

    postMessageAPI.send(url, this.outputTextForAPI, {
      mode: 'popup',
      newWindow: true,
      features: 0.8
    })
  },
  extractThemes() {
    let url = 'https://pulipulichen.github.io/lda.js/index.html?api=1'
    //let url = 'http://localhost:8383/lda/index.html?api=1'
    //let url = 'http://pc.pulipuli.info:8383/d3-cloud/index.html'

    postMessageAPI.send(url, this.outputTextForAPI, {
      mode: 'popup',
      newWindow: true,
      features: 0.8
    })
  },
  classifyText: async function() {
    //let url = 'http://localhost:8383/HTML-Simple-Classifier/index.html?api=1'
    //let url = 'http://localhost:8383/d3-cloud/index.html'
    //let url = 'http://pc.pulipuli.info:8383/d3-cloud/index.html'
    let url = 'https://pulipulichen.github.io/HTML-Simple-Classifier/index.html?api=1'
    this.processOutputWait = true
    let rawData = await this.getClassifyText()
    //console.log(rawData)
    
    postMessageAPI.send(url, {rawData}, {
      mode: 'popup',
      newWindow: true,
      features: 0.8
    })
    this.processOutputWait = false
  },
  getClassifyText: async function () {
    if (this.outputTextBagOfWords !== null) {
      return this.outputTextBagOfWords
    }
    
    let outputText = this.outputText
    let lines = outputText.split('\n')
    
    let className = 'class'
    if (this.doRemoveHeader === true) {
      let headerLine = lines.shift()
      className = headerLine.slice(headerLine.indexOf(this.columnSeparator) + 1)
    }
    
    // ---------------------------
    
    let bags = []
    let classList = []
    let words = {}
    
    console.log('getClassifyText', 'bags')
    
    for (let len = lines.length, i = len; i > 0; i--) {
      let line = lines[(len - i)]
      let lineClass = line.slice(line.indexOf(this.columnSeparator) + 1)
      classList.push(lineClass)
      
      let message = line.slice(0, line.indexOf(this.columnSeparator))
      let messageWords = message.split(' ')
      
      let bag = {}
      for (let wordsLen = messageWords.length, j = wordsLen; j > 0; j--) {
        let word = messageWords[(wordsLen - j)]
        if (typeof words[word] === 'undefined') {
          let pos = Object.keys(words).length
          words[word] = pos
        }
        
        if (!bag[word]) {
          bag[word] = 0
        }
        bag[word]++
        
        if (j % 10 === 5) {
          await this.sleep(0)
        }
      }
      
      bags.push(bag)
      
      if (i % 10 === 5) {
        console.log('getClassifyText', 'bags', ((len - i) / len))
        await this.sleep(0)
      }
    }
    
//    console.log(bags)
//    console.log(words)
    
    // ---------------------------
    
    console.log('getClassifyText', 'rawData', 'header')
    
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
    
    console.log('getClassifyText', 'rawData', 'bags')
    
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
        console.log('getClassifyText', 'rawData', ((len - i) / len))
        await this.sleep(0)
      }
    }
    
    this.outputTextBagOfWords = rawData
    
    return rawData
  },
  processOutput: async function () {
    this.outputText = ''
    this.outputTextBagOfWords = null
    if (this.jiebaInited === false
            && this.segmentationMethod === 'dictionary') {
      //console.log('要讀取了嗎？')
      return new Promise((resolve) => {
        //console.log('要讀取了嗎？')
        let _this = this
        $.getScript('require-jieba-js.js', function () {
          //console.log('OK')
          (async () => {

            _this.jiebaInited = true
            //console.log('jieba-js讀取完成，開始斷詞')
            await _this.processOutputInited()
            resolve(_this.outputText)
          })()
        })
      })

    } else {
      await this.processOutputInited()
      return this.outputText
    }
  },
  initInputOptions () {
    
    let initColumnSeparatorResult = this.initColumnSeparator()
    this.onlyFirstColumn = initColumnSeparatorResult
    
    //let trimText = this.inputText.trim()
    
    if (this.isOneLine === true) {
      this.doRemoveHeader = false
      return true
    }
    
    //let t = _text.trim()
    //firstLine = trimText.slice(0, trimText.indexOf('\n'))
    //console.log(firstLine.length, firstLine, trimText.indexOf('\n'))
    if (this.firstLine.length < 20) {
      this.doRemoveHeader = true
    }
    else {
      this.doRemoveHeader = false
    }
  },
  initColumnSeparator () {
    let candidates = [',', '\t']
    
    let result = {}
    candidates.forEach(c => {
      result[c] = true
    })
    let falseCounter = 0
    
    for (let i = this.inputTextTrimLines.length - 1; i > -1; i--) {
      let line = this.inputTextTrimLines[i]
      
      candidates.forEach(c => {
        if (result[c] === false) {
          return false
        }
        
        //console.log(c, line, line.split(c).length)
        if (line.split(c).length !== 2) {
          result[c] = false
          falseCounter++
        }
      })
      
      if (falseCounter === candidates.length) {
        this.columnSeparator = ''
        return false
      }
    }
    
    //console.log(result)
    for (let c in result) {
      if (result[c] === true) {
        this.columnSeparator = c
        return true
      }
    }
    this.columnSeparator = ''
    return false
  },
  processOutputInited: async function () {
    this.processOutputWait = true
    var _text = this.inputText.trim()
    //console.log(_text)

    //let firstLine = ''
    
    //console.log(this.doRemoveHeader)

    //console.log(_text)
    //return

    let rule = this.segmentationMethod
    //console.log(this.parseSingleCharacter(_text))

    var _custom_dict = this.configUserDictionaryArray

    var _text_array = _text.split('\n')
    var _result_array = []
    return new Promise((resolve, reject) => {
      //console.log('start promise')
      let next = (_result, others, i) => {
        if (i === 0 && this.doRemoveHeader === true) {
          _result_array.push(_result.join(''))
          i++
          return loop(i)
        }

        _result = _result.map(word => word.trim()).filter(word => word !== '')

        if (rule !== 'n-gram') {
          _result = this.filterStopWords(_result);
        }

        if (this.usePorterStemmer) {
          _result = _result.map(word => {
            if (this.isEnglishNumberWord(word)) {
              if (this.useLowerCase === true) {
                word = word.toLowerCase()
              }

              word = stemmer(word, false)
            }
            return word
          })
        }

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
        _result = _result.trim()
        _result = _result + others

        _result_array.push(_result)
        i++
        loop(i)
      }

      let loop = (i) => {
        //console.log('loop', i)
        if (i < _text_array.length) {
          let line = _text_array[i]

          if (i === 0 && this.doRemoveHeader === true) {
            return next([line], false, i)
          } 
          
          let others = ''
          if (this.onlyFirstColumn) {
            let sepPos = line.indexOf(this.columnSeparator)
            //console.log(line, this.columnSeparator, sepPos)
            if (sepPos > 0) {
              others = line.slice(sepPos)
              line = line.slice(0, sepPos)
            }
          }
          
          if (this.removeHTML === true) {
            line = this.stripHTMLTag(line)
          }
          
          if (this.removeEnglish) {
            line = this.filterEnglish(line)
          }
          if (this.removeNumber) {
            line = this.filterNumber(line)
          }
          line = this.filterWordRemap(line)

          if (rule === 'dictionary') {
            if ((line.startsWith('"') && line.endsWith('"'))
                    || (line.startsWith("'") && line.endsWith("'"))) {
              line = line.slice(1, -1).trim()
            }
            setTimeout(() => {
              //console.log('start', i, ((i / _text_array.length) * 100) )
              call_jieba_cut(line, _custom_dict, function (_result) {
                //console.log('end', i, )
                next(_result, others, i)
              });
            }, 0)
          } else {
            if (rule === 'n-gram') {
              line = this.filterStopWordsFromText(line)
            }
            let _result = this.processNGram(line)
            next(_result, others, i)
          }
        } else {
          // 完成
          //console.log(_result_array)
          this.outputText = _result_array.join('\n')
          this.processOutputWait = false
          this.configChanged = false


          //console.log('斷詞完成了')
          resolve(this.outputText)
        }
      } // let loop = (i) => {

      loop(0)
    })
  },
  filterWordRemap(text) {
    this.configWordRemapArray.forEach((targetWord, replaceWord) => {
      text = text.split(targetWord).join(replaceWord)
    })
    return text
  },
  filterStopWords(result) {
    //console.log(result)
    return result.filter(word => (this.configStopWordsArray.indexOf(word) === -1))
  },
  /**
   * @author https://stackoverflow.com/a/5002161/6645399
   * @param {type} str
   * @returns {string}
   */
  stripHTMLTag(str) {
    return str.replace(/<\/?[^>]+(>|$)/g, " ")
  },
  processNGram(text) {
    text = text.trim()
    //console.log(text)
    let gram = this.nGramLength
    gram = parseInt(gram, 10)
    let output = []
    //console.log([gram, text.substr(0, 2), text.length - gram + 1])

    let temp = []
    this.parseSingleCharacter(text).forEach(word => {
      if (this.isEnglishNumberWord(word) === false) {
        temp.push(word)

        if (temp.length === gram) {
          output.push(temp.join(''))
          temp.shift()
        }
      } else {
        if (temp.length === gram) {
          output.push(temp.join(''))
        }
        temp = []

        //if (this.usePorterStemmer) {
        //  word = stemmer(word, true)
        //}
        output.push(word)
      }
    })
    /*
     console.log(this.parseSingleCharacter(text))
     text.split(' ').forEach(part => {
     part = part.trim()
     if (part.length < gram) {
     output.push(part)
     }
     
     let partArray = this.parseSingleCharacter(part)
     for (let i = 0; i < partArray.length - gram + 1; i++) {
     let ngram = []
     for (let g = 0; g < gram; g++) {
     ngram.push(partArray[i+g])
     }
     output.push(ngram.join(''))
     }
     })
     */
    return output
  },
  filterStopWordsFromText(text) {
    this.configStopWordsArray.forEach(word => {
      text = text.split(word).join(' ')
    })
    return text
  },
  filterEnglish(text) {
    return text.replace(/[A-Za-z]/g, ' ')
  },
  filterNumber(text) {
    return text.replace(/\d/g, ' ')
  },
  isEnglishNumberWord(text) {
    var english = /^[A-Za-z0-9]*$/;
    return english.test(text)
  },
  parseSingleCharacter(text) {
    let output = []
    let word = ''
    let isMultiCharacter = false

    let regexPunctuations = /[.,\/#!$%\^&\*;:{}=\-_`~()。，、；：「」『』（）—？！…《》～〔〕［］・　]/
    let regexMultiChar = /^[A-Za-z0-9]+$/

    let addWord = () => {
      if (word !== '') {
        output.push(word)
        word = ''
        isMultiCharacter = false
      }
    }

    text.split("").forEach(c => {
      if (c === ' ') {
        // 略過空格和標點符號
        addWord()
        return false
      } else if (regexMultiChar.test(c)) {
        // 英數字的場合
        if (isMultiCharacter === false) {
          // 前一個字不是英數字的場合
          addWord()
          isMultiCharacter = true
        }
        word = word + c
      } else {
        // 不是英數字的場合
        if (isMultiCharacter === true) {
          // 前一個字是英數字的場合
          addWord()
        }
        output.push(c)
      }
    })
    return output
  },
  initTabls () {
    var data = [
  ['', 'Ford', 'Tesla', 'Toyota', 'Honda'],
  ['2017', 10, 11, 12, 13],
  ['2018', 20, 11, 14, 13],
  ['2019', 30, 15, 12, 13]
];

    new Handsontable(this.$refs.InputTable, {
      data: this.inputTable.splice(1),
      colHeaders: this.inputTable[0],
      rowHeaders: true,
      filters: true,
      dropdownMenu: true,
      minSpareRows: 1,
      contextMenu: true
    });
  }
}