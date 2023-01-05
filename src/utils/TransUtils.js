import PuliPostMessageAPI from './puli-post-message-api/puli-post-message-api.js'
let inited = false
let api

let url = 'https://pulipulichen.github.io/HTML-API-Transtration/index.html'

if (location.href.startsWith('http://localhost:8383/')) {
  url = 'http://localhost:8383/HTML-API-Transtration/index.html'
}
if (location.href.startsWith('http://127.0.0.1:5500/')) {
  // url = 'http://localhost:8000/index.html'
  url = 'http://127.0.0.1:5502/index.html'
}

export default {
  cache: {},
  generateKey (text,lang) {
    if (Array.isArray(text)) {
      text = JSON.stringify(text)
    }
    
    return lang + ':' + text
  },
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