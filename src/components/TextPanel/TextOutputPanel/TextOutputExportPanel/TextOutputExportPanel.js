export default {
  props: ['config', 'utils'],
  // mounted: function () {

  // },  // mounted: function () {
  computed: {
    outputButtonDisabled () {
      return (this.config.state.outputText.trim() === '')
    },
    outputTextForAPI () {
      let output = this.config.session.outputText.trim()
      if (this.config.session.doRemoveHeader && output.indexOf('\n') > -1) {
        output = output.slice(output.indexOf('\n') + 1)
      }
      
      if (this.config.session.onlyFirstColumn) {
        let tempOutput = []
        let lines = output.split('\n')
        for (let len = lines.length, i = len; i > 0; i--) {
          let line = lines[(len - i)]
          let pos = line.indexOf(this.config.session.columnSeparator)
          if (pos > -1) {
            let c = line.slice(pos).trim()
            if (this.config.state.selectClasses.indexOf(c) === -1) {
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
  }, // computed: {
  methods: {
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
  
      let configTopicNumber = undefined
      if (this.config.state.selectClasses.length > 1) {
        configTopicNumber = this.config.state.selectClasses
      }
  
      postMessageAPI.send(url, {
        inputText: this.outputTextForAPI,
        configTopicNumber: configTopicNumber,
      }, {
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
  } // methods: {
}