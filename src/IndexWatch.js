var appWatch = {
  displayPanel () {
    if (this.outputText === '') {
      this.$refs.Index.$refs.TextPanel.processOutput()
    }
  },
  'config.state.outputText' () {
    this.config.state.outputTextTranslated = ``
    this.config.state.outputTextWordVector = ``
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
    this.$refs.Index.persist()

    if (watchResetOutputText.indexOf(key) > -1) {
      this.config.state.outputText = ''
    }

    if (key === 'displayPanel'
      && this.config.session.displayPanel === 'text') {
      if (this.config.state.outputText.trim() === '' && 
          this.config.session.inputText.trim() !== '') {
        while (!this.$refs.Index.$refs.TextPanel) {
          await this.utils.Async.sleep(500)
        }
        this.$refs.Index.$refs.TextPanel.processOutput()
      }
    }
  }
})

export default appWatch