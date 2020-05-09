var app = new Vue({
  el: '#app',
  data: {
    inputText: `這個布丁 是在無聊的世界中找尋樂趣的一種不能吃的食物，
喜愛動漫畫、遊戲、coding，以及跟世間脫節的生活步調。`,
    outputText: ``,
    step: 2,
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
    processOutputWait: false
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
    }
  },
  mounted () {
    this.configUserDictionaryExample = this.configUserDictionary
    this.configWordRemapExample = this.configWordRemap
    this.configStopWordsExample = this.configStopWords
    
    //console.log(stemmer("hopefully", true), stemmer("loves", true))
    
    setTimeout(() => {
      this.processOutput()
    }, 1000)
  },
  methods: {
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
      console.error('@TODO')
    },
    saveAsText () {
      console.error('@TODO')
    },
    saveAsSheet () {
      console.error('@TODO')
    },
    drawWordCloud () {
      console.error('@TODO')
    },
    extractThemes () {
      console.error('@TODO')
    },
    processOutput () {
      this.step = 2
      
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