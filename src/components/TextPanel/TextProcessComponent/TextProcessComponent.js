import jQuery from 'jquery'
import {stemmer} from 'stemmer'
import Papa from 'papaparse'

export default  {
  props: ['config', 'utils'],
  data: function () {
    return {
      columnSeparator: '\t'
    }
  },
  // mounted: function () {

  // },  // mounted: function () {
  // computed: {

  // }, // computed: {
  watched: {
    'config.state.outputTextRows' () {
      if (this.config.state.outputTextRows.length === 0) {
        this.config.state.outputTextRowsJoined = []
      }
    }
  },
  methods: {
    processOutput: async function () {
      this.config.state.outputText = ''
      this.config.state.outputClasses = []
      this.config.state.outputTextWordVector = []

      if (this.config.session.segmentationMethod === 'dictionary' && 
        this.config.state.jiebaInited === false) {
          await this.initJieba()
      } 

      //console.log('jieba-js已經初始化，開始斷詞')
      let result = await this.processOutputInited()
      //console.log('jieba-js已經初始化，完成斷詞')
      // let result = this.config.state.outputText
      // console.log({result})
      // console.log(result)
      // await this.$parent.processWordVectorModel()


      return result
    },
    initJieba: function () {
      if (this.config.state.jiebaInited === true) {
        return true
      }
      let loaded = false
      //console.log(this.config.development.debug.skipJiebaJS)
      if (this.config.development.debug.skipJiebaJS === true) {
        this.config.state.jiebaInited = true
        return true
      }

      // if ($('script[src="require-jieba-js.js"]').length > 0) {
      //   return true
      // }

      return new Promise((resolve) => {
        //console.log('要讀取了嗎？')
        //let _this = this
        
        jQuery.getScript('require-jieba-js.js', () => {
          
          (async () => {
            
            if (loaded === true) {
              return false
            }
            loaded = true

            this.config.state.jiebaInited = true
            //console.trace('jieba-js讀取完成，開始斷詞')
            //await _this.processOutputInited()
            //console.log('jieba-js讀取完成，完成斷詞', _this.outputText)
            resolve(true)
          })()
        })
      })
    },
    processOutputInited: async function () {
      
      this.config.state.processOutputWait = true
      //var _text = this.config.session.inputText.trim()
      
      let rows = await this.parseJSONArray()
      // console.log(rows)
      
      this.parseColumnNames(rows)

      let rowsJoined = []
      
  
      let rule = this.config.session.segmentationMethod
      //console.log(this.parseSingleCharacter(_text))
      // console.log(rows)
      //var _text_array = _text.split('\n')
      //var _result_array = []
      for (let i = 0; i < rows.length; i++) {
        // 以下是Loop的範圍

        let line = rows[i]

        let lineText = this.getLineText(line)
        lineText = this.filterWordRemap(lineText)
        // console.log(lineText)
        lineText = this.processTextRemove(lineText)
        

        let lineTextArray
        if (rule === 'dictionary') {
          lineTextArray = await this.processTextJieba(lineText)
        } else if (rule === 'n-gram') {
          lineTextArray = this.processNGram(lineText)
        }

        if (this.config.session.usePorterStemmer) {
          lineTextArray = this.filterStemmer(lineTextArray)
        }

        //lineTextArray = this.filterEmptyWords(lineTextArray)

        this.setLineText(rows, i, lineTextArray)

        rowsJoined[i] = {
          ...line
        }
        this.setLineText(rowsJoined, i, this.joinWithSpace(lineTextArray))

        this.parseLineClass(line)
      }

      // console.log(rowsJoined)

      //this.config.state.outputText = await this.rowToCSV(rows)
      this.config.state.outputTextRows = rows
      //console.log(rows)
      this.config.state.outputTextRowsJoined = rowsJoined
      this.config.state.processOutputWait = false
      this.config.state.configChanged = false
      
      this.selectAllClasses()
      //console.log(this.outputClasses)
      // console.log({rowsJoined})
      //console.log('斷詞完成了')
      return rowsJoined

      // return new Promise((resolve, reject) => {
      //   //console.log('start promise')
      //   let next = (_result, others, i) => {
      //     if (typeof(others) === 'string') {
      //       let otherClass = others.trim()
      //       //console.log(otherClass)
      //       if (otherClass !== '' && this.config.state.outputClasses.indexOf(otherClass) === -1) {
      //         this.config.state.outputClasses.push(otherClass)
      //         //console.log(this.config.state.outputClasses)
      //       }
      //     }
          
      //     if (i === 0 && this.config.session.doRemoveHeader === true) {
      //       _result_array.push(_result.join(''))
      //       i++
      //       return loop(i)
      //     }
  
      //     _result = _result.map(word => word.trim()).filter(word => word !== '')
  
      //     if (rule !== 'n-gram') {
      //       _result = this.filterStopWords(_result);
      //     }
  
      //     if (this.config.session.usePorterStemmer) {
      //       _result = _result.map(word => {
      //         if (this.utils.String.isEnglishNumberWord(word)) {
      //           if (this.config.session.useLowerCase === true) {
      //             word = word.toLowerCase()
      //           }
  
      //           let afterWord = stemmer(word, false)
      //           if (word !== afterWord) {
      //             word = afterWord + '-'
      //           }
      //         }
      //         return word
      //       })
      //     }
  
      //     _result = _result.join(" ");
      //     while (_result.indexOf("  ") > -1) {
      //       _result = _result.replace(/  /g, ' ');
      //     }
      //     _result = _result.replace(/ \n /g, "\n");
      //     _result = _result.replace(/ \t /g, " ");
      //     _result = _result.replace(/\t/g, " ");
      //     _result = _result.replace(/ \' /g, "'");
      //     _result = _result.replace(/\' /g, "'");
      //     if (_result.startsWith('" ')) {
      //       _result = _result.slice(2)
      //     }
      //     _result = _result.trim()
      //     _result = _result + others
  
      //     _result_array.push(_result)
      //     i++
      //     loop(i)
      //   }
  
      //   let loop = (i) => {
      //     //console.log('loop', i)
      //     if (i < _text_array.length) {
      //       let line = _text_array[i]
  
      //       if (i === 0 && this.config.session.doRemoveHeader === true) {
      //         return next([line], false, i)
      //       } 
            
      //       let others = ''
      //       if (this.config.session.onlyFirstColumn) {
      //         let sepPos = line.indexOf(this.config.session.columnSeparator)
      //         if (sepPos > -1) {
      //           others = line.slice(sepPos + 1).trim()
      //           line = line.slice(0, sepPos)
      //         }
      //         //console.log(others)
      //       }
            
      //       if (this.config.session.removeHTML === true) {
      //         line = this.utils.String.stripHTMLTag(line)
      //         //console.log(line)
      //       }
            
      //       if (this.config.session.removeEnglish) {
      //         line = this.utils.string.filterEnglish(line)
      //       }
      //       if (this.removeNumber) {
      //         line = this.utils.string.filterNumber(line)
      //       }
      //       line = this.filterWordRemap(line)
  
      //       if (rule === 'dictionary') {
      //         if ((line.startsWith('"') && line.endsWith('"')) || 
      //           (line.startsWith("'") && line.endsWith("'"))) {
      //           line = line.slice(1, -1).trim()
      //         }
      //         setTimeout(() => {
      //           //console.log('start', i, ((i / _text_array.length) * 100) )
      //           call_jieba_cut(line, _custom_dict, function (_result) {
      //             //console.log('end', i, )
      //             next(_result, others, i)
      //           });
      //         }, 0)
      //       } else if (rule === 'n-gram') {
      //         /*
      //         console.log(line)
      //         //  line = this.filterStopWordsFromText(line)
      //           console.log(line)
      //         }
      //         */
      //         let _result = this.processNGram(line)
              
      //         _result = _result.filter(r => {
      //           return (this.config.computed.configStopWordsArray.indexOf(r) === -1)
      //         })
              
      //         console.log(_result)
      //         next(_result, others, i)
      //       }
      //     } else {
      //       // 完成
      //       //console.log(_result_array)
      //       this.config.state.outputText = _result_array.join('\n')
      //       this.config.state.processOutputWait = false
      //       this.config.state.configChanged = false
            
      //       this.config.state.selectClasses = this.config.state.selectClasses.slice(0,0).concat(this.config.state.outputClasses)
      //       //console.log(this.outputClasses)
  
      //       //console.log('斷詞完成了')
      //       resolve(this.config.state.outputText)
      //     }
      //   } // let loop = (i) => {
  
      //   loop(0)
      // })
    },
    parseJSONArray: async function () {
      let csv = this.config.session.inputText.trim()
      let delimiter
      return new Promise((resolve, reject) => {
        let result = []
        //console.log(csv)
        let options = {
          header: this.config.session.doRemoveHeader,
          worker: true,
          skipEmptyLines: true,
        	step: function(results) {
            if (!delimiter) {
              delimiter = results.meta.delimiter
            }
        		//console.log("Row:", results);
            result.push(results.data)
        	}, 
          complete: () => {
            //console.log(result)
            this.config.state.delimiter = delimiter
            resolve(result)
          }
        }


        Papa.parse(csv, options);
      })
    },
    filterWordRemap(text) {
      //console.log(this.config.computed.configWordRemapArray)
      let configWordRemapArray = this.config.computed.configWordRemapArray
      for (let i = 0; i < configWordRemapArray.length; i++) {
        let {targetWord, replaceWord} = configWordRemapArray[i]
        text = text.split(targetWord).join(replaceWord)
      }
      // .forEach((targetWord, replaceWord) => {
      //   console.log(targetWord, replaceWord)
        
      // })
      //console.log(text)
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
        if (this.utils.String.isEnglishNumberWord(word) === false) {
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
          if (word.trim() === '' || 
            this.config.computed.configStopWordsArray.indexOf(word) > -1) {
            return false
          }

          output.push(word.trim())
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
    filterStemmer (lineTextArray) {
      return lineTextArray.map(word => {
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
    },
    joinWithSpace (_result) {
      _result = JSON.parse(JSON.stringify(_result))
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

      return _result
    },
    parseColumnNames (rows) {
      if (rows.length === 0) {
        this.config.state.columnNames = []
        this.config.state.classColumnName = null
        return true
      }

      let names = Object.keys(rows[0])
      this.config.state.columnNames = names
      this.config.state.textColumnName = names[0]
      if (names.length > 0) {
        this.config.state.classColumnName = names[1]
      }
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
    processTextRemove (line) {
      if (this.config.session.removeHTML === true) {
        line = this.utils.String.stripHTMLTag(line)
        //console.log(line)
      }

      if (this.config.session.removeEmoji === true) {
        line = this.utils.String.removeEmojis(line, ' ')
        //console.log(line)
      }
      
      if (this.config.session.removeEnglish) {
        line = this.utils.String.filterEnglish(line)
      }
      if (this.config.session.removeNumber) {
        line = this.utils.String.filterNumber(line)
      }

      return line
    },
    processTextJieba (line) {
      if (this.config.development.debug.skipJiebaJS === true) {
        //console.log(line)
//         return `message	class
// 這個 布丁 是 在 無聊的世界 中 找尋 code 的 1998 種 不能 吃 的 code- ，	分類A
// 喜愛 動漫畫 、 遊戲 、 code- 、 遊戲 ， 以及 abcdv 跟 世間 脫節 的 生活 步調 。	分類B`
        return '這個 布丁 是 在 無聊的世界 中 找尋 code 的 1998 種 不能 吃 的 code- ，'.split(' ')
      }

      return new Promise(resolve => {
        call_jieba_cut(line, this.config.computed.configUserDictionaryArray, (result) => {
          result = this.filterStopWords(result)
          result = this.filterEmptyWords(result)
          //console.log(result)
          resolve(result)
        })
      })
    },
    filterEmptyWords (result) {
      return result.filter(r => r.trim() !== '')
    },
    parseLineClass (line) {

      if (this.config.state.classColumnName && 
        line[this.config.state.classColumnName]) {
        let className = line[this.config.state.classColumnName]

        if (this.config.state.outputClasses.indexOf(className) === -1) {
          this.config.state.outputClasses.push(className)
          //console.log(this.config.state.outputClasses)
        }
        return true
        //return line[this.config.state.textColumnName]
      }
      return false
    },
    rowToCSV (rows) {
      /*
      //console.log(rows)
      return new Promise((resolve, reject) => {
        let result = []
        let options = {
          //header: this.config.session.doRemoveHeader,
          worker: true,
        	step: function(results) {
        		console.log("Row:", results.data);
            //result.push(results.data)
        	}, 
          complete: function (result) {
            //console.log(result)
            resolve(result)
          }
        }


        Papa.unparse(rows, options);
      })
      */
      return Papa.unparse(rows, {
        delimiter: this.config.state.delimiter,
        skipEmptyLines: true,
      })
    },
    selectAllClasses () {
      this.config.state.selectClasses = this.config.state.selectClasses.slice(0,0).concat(this.config.state.outputClasses)
    }
  } // methods: {
}