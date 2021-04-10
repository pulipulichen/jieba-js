var appComputed = {
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
        //if (_config[_l].indexOf(',') === -1) {
        //  continue
        //}
        let _line = _config[_l]
        if (_line.indexOf(',') > -1) {
          _line = _line.split(",");
          _output.push([
            _line[0].trim(),
            parseInt(_line[1]),
            _line[2]
          ]);
        }
        else {
          _output.push([
            _line.trim(),
            999999,
            'x'
          ]);
        }
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
    },
    searchParams () {
      let output = {}
      const currentURL = new URL(location.href)
      for(let [key, value] of currentURL.searchParams.entries()) {
        output[key] = value
      }
      return output
    },
    outputTextForAPI () {
      let output = this.outputText.trim()
      if (this.doRemoveHeader && output.indexOf('\n') > -1) {
        output = output.slice(output.indexOf('\n') + 1)
      }
      
      if (this.onlyFirstColumn) {
        let tempOutput = []
        let lines = output.split('\n')
        for (let len = lines.length, i = len; i > 0; i--) {
          let line = lines[(len - i)]
          let pos = line.indexOf(this.columnSeparator)
          if (pos > -1) {
            let c = line.slice(pos).trim()
            if (this.selectClasses.indexOf(c) === -1) {
              continue
            }
            line = line.slice(0, pos)
          }
          tempOutput.push(line)
        }
        
        output = tempOutput.join('\n')
      }
      return output
    },
    inputTextTrim () {
      return this.inputText.trim()
    },
    inputTextTrimLines () {
      return this.inputTextTrim.split('\n')
    },
    isOneLine () {
      return (this.inputTextTrimLines.length === 1)
    },
    firstLine () {
      let line = this.inputTextTrimLines[0]
      
      if (this.onlyFirstColumn) {
        let pos = line.indexOf(this.columnSeparator)
        if (pos === -1) {
          return line
        }
        else {
          return line.slice(0, pos)
        }
      }
      else {
        return line
      }
    }
  }