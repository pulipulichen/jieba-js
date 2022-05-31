export default {
  data: function () {
    return {
      cacheOutputForAPI: null
    }
  },
  props: ['config', 'utils'],
  // mounted: function () {

  // },  // mounted: function () {
  computed: {
    outputButtonDisabled () {
      return (this.config.state.outputTextRows.length === 0)
    },
    outputTextForAPI () {
      /*
      let output = this.config.state.outputText.trim()
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
      */
      let output = []

      this.config.state.outputTextRowsJoined.forEach(row => {
        let text = this.$parent.getLineText(row)
        let className = this.$parent.getLineClass(row)
        
        if (!className || 
          this.config.state.selectClasses.indexOf(className) > -1) {
          output.push(text)
        }
      })

      return output.join('\n')
    },
  }, // computed: {
  watch: {
    'config.state.outputTextRowsJoined' () {
      this.cacheOutputForAPI = null
    }
  },
  methods: {
    getOutputTextForAPI: async function () {
      if (this.cacheOutputForAPI) {
        return this.cacheOutputForAPI
      }
      let output = []

      let rows = this.config.state.outputTextRowsJoined
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i]

        let text = this.$parent.getLineText(row)
        let className = this.$parent.getLineClass(row)
        
        if (!className || 
          this.config.state.selectClasses.indexOf(className) > -1) {
          output.push(text)
        }

        if (i % 100 === 99) {
          await this.utils.Async.sleep(10)
        }
      }

      this.cacheOutputForAPI = output.join('\n')
      // console.log(this.cacheOutputForAPI)
      return this.cacheOutputForAPI
    },
    drawWordCloud: async function () {
      this.config.state.processOutputWait = true
      let url = 'https://pulipulichen.github.io/d3-cloud/index.html?api=1'
      //let url = 'http://localhost:8383/d3-cloud/index.html'
      //let url = 'http://pc.pulipuli.info:8383/d3-cloud/index.html'
  
      let text = await this.getOutputTextForAPI()
      // console.log(text)
      this.utils.postMessageAPI.send(url, text, {
        mode: 'popup',
        newWindow: true,
        features: 0.8
      })
      this.config.state.processOutputWait = false
    },
    analyzeText: async function () {
      this.config.state.processOutputWait = true
      let url = 'https://pulipulichen.github.io/HTML5-Text-Analyzer/index.html?api=1'
      //let url = 'http://localhost:8383/HTML5-Text-Analyzer/index.html'
      //let url = 'http://pc.pulipuli.info:8383/HTML5-Text-Analyzer/index.html'
  
      let text = await this.getOutputTextForAPI()
      this.utils.postMessageAPI.send(url, text, {
        mode: 'popup',
        newWindow: true,
        features: 0.8
      })
      this.config.state.processOutputWait = false
    },
    extractThemes: async function () {
      this.config.state.processOutputWait = true

      let url = 'https://pulipulichen.github.io/lda.js/index.html?api=1'
      //let url = 'http://localhost:8383/lda/index.html?api=1'
      //let url = 'http://pc.pulipuli.info:8383/d3-cloud/index.html'
  
      let configTopicNumber = undefined
      if (this.config.state.selectClasses.length > 1) {
        configTopicNumber = this.config.state.selectClasses
      }
  
      let text = await this.getOutputTextForAPI()
      this.utils.postMessageAPI.send(url, {
        inputText: text,
        configTopicNumber: configTopicNumber,
      }, {
        mode: 'popup',
        newWindow: true,
        features: 0.8
      })

      this.config.state.processOutputWait = false
    },
    classifyText: async function() {
      //let url = 'http://localhost:8383/HTML-Simple-Classifier/index.html?api=1'
      //let url = 'http://localhost:8383/d3-cloud/index.html'
      //let url = 'http://pc.pulipuli.info:8383/d3-cloud/index.html'
      let url = 'https://pulipulichen.github.io/HTML-Simple-Classifier/index.html?api=1'
      this.config.state.processOutputWait = true
      let rawData = await this.$parent.getClassifyText()
      //console.log(rawData)
      
      this.utils.postMessageAPI.send(url, {rawData}, {
        mode: 'popup',
        newWindow: true,
        features: 0.8
      })
      this.config.state.processOutputWait = false
    }
  } // methods: {
}