var appWatch = {
  displayPanel () {
    if (this.config.state.outputText === '') {
      this.$refs.Index.$refs.TextPanel.processOutput()
    }
  },
  'config.state.outputText' () {
    this.config.state.outputTextTranslated = ``
    this.config.state.outputTextWordVector = []
  }
}

let watchResetOutputText = [
  'segmentationMethod',
  'nGramLength',
  'configUserDictionary',
  'configWordRemap',
  'configStopWords',
  'usePorterStemmer',
  'removeEnglish',
  'removeNumber',
  'removeHTML',
  'useLowerCase',
  'inputFormat',
  'doRemoveHeader',
  'onlyFirstColumn',
  'columnSeparator',
]

import ConfigSession from './ConfigSession.js'

Object.keys(ConfigSession).forEach(key => {
  
  appWatch[`config.session.${key}`] = async function () {
    //console.log(watchResetOutputText.indexOf(key))
    this.$refs.Index.persist((watchResetOutputText.indexOf(key) > -1))

    if (watchResetOutputText.indexOf(key) > -1) {
      this.config.state.outputTextRows = []
    }

    if (key === 'displayPanel' && 
        this.config.session.displayPanel === 'text') {
      if (this.config.state.outputTextRows.length === 0 && 
          this.config.session.inputText.trim() !== '') {
        while (!this.$refs.Index.$refs.TextPanel) {
          await this.utils.Async.sleep(500)
        }
        this.$refs.Index.$refs.TextPanel.processOutput()
      }
    }
  }
})

//console.log(appWatch)

export default appWatch