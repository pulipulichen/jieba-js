var appWatch = {
  displayPanel () {
    if (this.outputText === '') {
      this.processOutput()
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

Object.keys(appData.config.session).forEach(key => {
  appWatch[`config.session.${key}`] = function () {
    this.SessionManager.persist()

    if (watchResetOutputText.indexOf(key) > -1) {
      this.config.state.outputText = ''
    }

    if (key === 'displayPanel') {
      if (this.config.state.outputText.trim() === '' 
          && this.config.session.inputText.trim() !== '') {
        this.ProcessManager.processOutput()
      }
    }
  }
})

// var appWatch = {
//     configChanged() {
//       this.configChanged = true
//     },
//     segmentationMethod () {
//       this.persist()
//       this.outputText = ''
//     },
//     nGramLength () {
//       this.persist()
//       this.outputText = ''
//     },
//     configUserDictionary () {
//       this.persist()
//       this.outputText = ''
//     },
//     configWordRemap () {
//       this.persist()
//       this.outputText = ''
//     },
//     configStopWords () {
//       this.persist()
//       this.outputText = ''
//     },
//     usePorterStemmer () {
//       this.persist()
//       this.outputText = ''
//     },
//     removeEnglish () {
//       this.persist()
//       this.outputText = ''
//     },
//     removeNumber () {
//       this.persist()
//       this.outputText = ''
//     },
//     removeHTML () {
//       this.persist()
//       this.outputText = ''
//     },
//     useLowerCase () {
//       this.persist()
//       this.outputText = ''
//     },
//     inputFormat () {
//       this.persist()
//     },
//     doRemoveHeader () {
//       this.outputText = ''
//     },
//     onlyFirstColumn () {
//       this.outputText = ''
//     },
//     columnSeparator () {
//       this.outputText = ''
//     },
//     displayPanel () {
//       if (this.outputText === '') {
//         this.processOutput()
//       }
//     },
//     outputText () {
//       this.outputTextWordVector = null
//     }
//   }