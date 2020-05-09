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
    usePorterStemmer: true
  },
  mounted () {
    this.configUserDictionaryExample = this.configUserDictionary
    this.configWordRemapExample = this.configWordRemap
    this.configStopWordsExample = this.configStopWords
    
    //console.log(stemmer("hopefully", true), stemmer("loves", true))
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
    }
  }
})