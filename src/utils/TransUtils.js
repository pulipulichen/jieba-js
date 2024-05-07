import PuliPostMessageAPI from './puli-post-message-api/puli-post-message-api.js'
let inited = false
let api

let url = 'https://pulipulichen.github.io/HTML-API-Transtration/index.html'

if (location.href.startsWith('http://localhost:8383/')) {
  url = 'http://localhost:8383/HTML-API-Transtration/index.html'
}
else if (location.href.startsWith('http://127.0.0.1:5500/')) {
  // url = 'http://localhost:8000/index.html'
  url = 'http://127.0.0.1:5502/index.html'
}
else if (location.href.startsWith('http://127.0.0.1:5502/')) {
  // url = 'http://localhost:8000/index.html'
  url = 'http://127.0.0.1:5500/index.html'
}

// if (location.href.startsWith('https://dangerous-lizard-99.telebit.io/')) {
//   // url = 'http://localhost:8000/index.html'
//   url = 'http://127.0.0.1:5500/index.html'
// }

export default {
  cache: {},
  generateKey (text,lang) {
    if (Array.isArray(text)) {
      text = JSON.stringify(text)
    }
    
    return lang + ':' + text
  },
  nonEnglishPattern: /[\u00C0-\u02AF\u0370-\u03FF\u0400-\u04FF\u0500-\u052F\u0591-\u05F4\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u1E00-\u1EFF\u1F00-\u1FFF\u2000-\u206F\u2070-\u209F\u20A0-\u20CF\u20D0-\u20FF\u2100-\u214F\u2150-\u218F\u2190-\u21FF\u2200-\u22FF\u2300-\u23FF\u2400-\u243F\u2440-\u245F\u2460-\u24FF\u2500-\u257F\u2580-\u259F\u25A0-\u25FF\u2600-\u26FF\u2700-\u27BF\u2800-\u28FF\u2E80-\u2EFF\u2F00-\u2FDF\u2FF0-\u2FFF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31A0-\u31BF\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA4D0-\uA4FF\uA500-\uA63F\uA640-\uA69F\uA6A0-\uA6FF\uA700-\uA71F\uA720-\uA7FF\uA800-\uA82F\uA830-\uA83F\uA840-\uA87F\uA880-\uA8DF\uA8E0-\uA8FF\uA900-\uA92F\uA930-\uA95F\uA960-\uA97F\uA980-\uA9DF\uA9E0-\uA9FF\uAA00-\uAA5F\uAA60-\uAA7F\uAA80-\uAADF\uAAE0-\uAAFF\uAB00-\uAB2F\uAB30-\uAB6F\uAB70-\uABBF\uABC0-\uABFF\uAC00-\uD7AF\uD7B0-\uD7FF\uF900-\uFAFF\uFB00-\uFB4F\uFB50-\uFDFF\uFE00-\uFE0F\uFE10-\uFE1F\uFE20-\uFE2F\uFE30-\uFE4F\uFE50-\uFE6F\uFE70-\uFEFF\uFF00-\uFFEF\uFF80-\uFFEF]/,

  /**
   * 
   * @param {type} text
   * @param {type} lang zh-TW
   * @returns {result}
   */
  trans: async function (text, lang = 'en') {
    if (!text) {
      return false
    }

    if (lang === 'en') {
      let tempText = text
      if (Array.isArray(tempText)) {
        tempText = tempText.join(' ')
      }
      if (this.nonEnglishPattern.test(tempText) === false) {
        return text
      }
    }
    
    if (Array.isArray(text) && (typeof(text[0]) !== 'string' || text[0].trim() === '')) {
      return false
    } 
    else if (typeof(text) === 'string' && text.trim() === '') {
      return false
    }
    
    if (typeof(text) === 'string') {
      text = text.trim()
    }
    else if (Array.isArray(text)) {
      text = text.map(t => t.trim())
    }
      
    let key = this.generateKey(text, lang)
    if (this.cache[key]) {
      return this.cache[key]
    }
    
    this.initTrans()
    
    //console.log(data)
    let data = {
      text,
      lang
    }
    
    //console.log(data)
    //console.log(url)
    let result = await api.send(url, data, {debug: false})
    
    this.cache[key] = result
    //console.log(result)
    return result
  },
  transZHTW: async function (text) {
    return await this.trans(text, 'zh-TW')
  },
  initTrans () {
    if (inited === true) {
      return true
    }

    api = PuliPostMessageAPI
    inited = true
  }
}