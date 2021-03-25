var appWatch = {
    configChanged() {
      this.configChanged = true
    },
    segmentationMethod () {
      this.persist()
      this.outputText = ''
    },
    nGramLength () {
      this.persist()
      this.outputText = ''
    },
    configUserDictionary () {
      this.persist()
      this.outputText = ''
    },
    configWordRemap () {
      this.persist()
      this.outputText = ''
    },
    configStopWords () {
      this.persist()
      this.outputText = ''
    },
    usePorterStemmer () {
      this.persist()
      this.outputText = ''
    },
    removeEnglish () {
      this.persist()
      this.outputText = ''
    },
    removeNumber () {
      this.persist()
      this.outputText = ''
    },
    removeHTML () {
      this.persist()
      this.outputText = ''
    },
    useLowerCase () {
      this.persist()
      this.outputText = ''
    },
    inputFormat () {
      this.persist()
    },
    doRemoveHeader () {
      this.outputText = ''
    },
    onlyFirstColumn () {
      this.outputText = ''
    },
    columnSeparator () {
      this.outputText = ''
    },
    displayPanel () {
      if (this.outputText === '') {
        this.processOutput()
      }
    }
  }