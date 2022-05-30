export default {
  filterEnglish(text) {
    return text.replace(/[A-Za-z]/g, ' ')
  },
  filterNumber(text) {
    return text.replace(/[0-9]/g, ' ')
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

  /**
   * @author https://stackoverflow.com/a/5002161/6645399
   * @param {type} str
   * @returns {string}
   */
   stripHTMLTag(str) {
    if (typeof(str) !== 'string') {
      return ''
    }

    str = str.replace(/<\/?[^>]+(>|$)/g, " ")
    
    while (str.indexOf('  ') > -1) {
      str = str.replace(/  /g, " ")
    }
    
    return str
  },
}