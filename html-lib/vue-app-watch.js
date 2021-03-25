var appWatch = {
    configChanged() {
      this.configChanged = true
    },
    segmentationMethod () {
      this.persist()
    },
    nGramLength () {
      this.persist()
    },
    configUserDictionary () {
      this.persist()
    },
    configWordRemap () {
      this.persist()
    },
    configStopWords () {
      this.persist()
    },
    usePorterStemmer () {
      this.persist()
    },
    removeEnglish () {
      this.persist()
    },
    removeNumber () {
      this.persist()
    },
    removeHTML () {
      this.persist()
    },
    useLowerCase () {
      this.persist()
    },
    inputFormat () {
      this.persist()
    }
  }