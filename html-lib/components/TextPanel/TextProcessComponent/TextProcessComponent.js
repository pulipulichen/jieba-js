module.exports = {
  prop: ['config'],
  mounted: function () {

  },  // mounted: function () {
  computed: {

  }, // computed: {
  methods: {
    processOutput: async function () {
      this.config.state.outputText = ''
      this.config.state.outputClasses = []
      this.config.state.outputTextWordVector = null
      if (this.config.state.jiebaInited === false
              && this.config.session.segmentationMethod === 'dictionary') {
        //console.log('要讀取了嗎？')
        let loaded = false
        
        return new Promise((resolve) => {
          //console.log('要讀取了嗎？')
          let _this = this
          
          $.getScript('require-jieba-js.js', function () {
            
            
            (async () => {
              
              if (loaded === true) {
                return false
              }
              loaded = true
  
              _this.jiebaInited = true
              //console.trace('jieba-js讀取完成，開始斷詞')
              await _this.processOutputInited()
              //console.log('jieba-js讀取完成，完成斷詞', _this.outputText)
              resolve(_this.outputText)
            })()
          })
        })
  
      } else {
        //console.log('jieba-js已經初始化，開始斷詞')
        await this.processOutputInited()
        //console.log('jieba-js已經初始化，完成斷詞')
        return this.outputText
      }
    },
    processOutputInited: async function () {
      this.config.state.processOutputWait = true
      var _text = this.config.session.inputText.trim()
      //console.log(_text)
  
      //let firstLine = ''
      
      //console.log(this.doRemoveHeader)
  
      //console.log(_text)
      //return
  
      let rule = this.config.session.segmentationMethod
      //console.log(this.parseSingleCharacter(_text))
  
      var _custom_dict = this.config.computed.configUserDictionaryArray
  
      var _text_array = _text.split('\n')
      var _result_array = []
      return new Promise((resolve, reject) => {
        //console.log('start promise')
        let next = (_result, others, i) => {
          if (typeof(others) === 'string') {
            let otherClass = others.trim()
            if (otherClass !== '' && this.config.state.outputClasses.indexOf(otherClass) === -1) {
              this.config.state.outputClasses.push(otherClass)
            }
          }
          
          if (i === 0 && this.config.session.doRemoveHeader === true) {
            _result_array.push(_result.join(''))
            i++
            return loop(i)
          }
  
          _result = _result.map(word => word.trim()).filter(word => word !== '')
  
          if (rule !== 'n-gram') {
            _result = this.filterStopWords(_result);
          }
  
          if (this.config.session.usePorterStemmer) {
            _result = _result.map(word => {
              if (this.utils.String.isEnglishNumberWord(word)) {
                if (this.config.session.useLowerCase === true) {
                  word = word.toLowerCase()
                }
  
                
  
                let afterWord = stemmer(word, false)
                if (word !== afterWord) {
                  word = afterWord + '-'
                }
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
  
            if (i === 0 && this.config.session.doRemoveHeader === true) {
              return next([line], false, i)
            } 
            
            let others = ''
            if (this.config.session.onlyFirstColumn) {
              let sepPos = line.indexOf(this.config.session.columnSeparator)
              //console.log(line, this.columnSeparator, sepPos)
              if (sepPos > 0) {
                others = line.slice(sepPos)
                line = line.slice(0, sepPos)
              }
            }
            
            if (this.config.session.removeHTML === true) {
              line = this.utils.String.stripHTMLTag(line)
              //console.log(line)
            }
            
            if (this.config.session.removeEnglish) {
              line = this.utils.string.filterEnglish(line)
            }
            if (this.removeNumber) {
              line = this.utils.string.filterNumber(line)
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
            } else if (rule === 'n-gram') {
              /*
              console.log(line)
              //  line = this.filterStopWordsFromText(line)
                console.log(line)
              }
              */
              let _result = this.processNGram(line)
              
              _result = _result.filter(r => {
                return (this.config.computed.configStopWordsArray.indexOf(r) === -1)
              })
              
              console.log(_result)
              next(_result, others, i)
            }
          } else {
            // 完成
            //console.log(_result_array)
            this.config.state.outputText = _result_array.join('\n')
            this.config.state.processOutputWait = false
            this.config.state.configChanged = false
            
            this.config.state.selectClasses = this.config.state.selectClasses.slice(0,0).concat(this.config.state.outputClasses)
            //console.log(this.outputClasses)
  
            //console.log('斷詞完成了')
            resolve(this.config.state.outputText)
          }
        } // let loop = (i) => {
  
        loop(0)
      })
    },
    filterWordRemap(text) {
      this.config.computed.configWordRemapArray.forEach((targetWord, replaceWord) => {
        text = text.split(targetWord).join(replaceWord)
      })
      return text
    },
    filterStopWords(result) {
      //console.log(result)
      return result.filter(word => {
        if (this.utils.String.isEnglishNumberWord(word)) {
          word = word.toLowerCase()
        }
        
        return (this.config.computed.configStopWordsArray.indexOf(word) === -1)
      })
    },
    processNGram(text) {
      text = text.trim()
      //console.log(text)
      let gram = this.config.session.nGramLength
      gram = parseInt(gram, 10)
      let output = []
      //console.log([gram, text.substr(0, 2), text.length - gram + 1])
  
      let temp = []
      this.utils.String.parseSingleCharacter(text).forEach(word => {
        if (this.utisl.String.isEnglishNumberWord(word) === false) {
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
      this.config.computed.configStopWordsArray.forEach(word => {
        text = text.split(word).join(' ')
      })
      return text
    },
  } // methods: {
}