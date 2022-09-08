export default {
  props: ['config'],
  // mounted: function () {

  // },  // mounted: function () {
  computed: {
    configUserDictionaryArray () {
      var _config = this.config.session.configUserDictionary.trim().split("\n")

      _config = _config.concat(this.configWordRemapArray.map(c => c.replaceWord))

      var _output = [];
      for (var _l in _config) {
        //if (_config[_l].indexOf(',') === -1) {
        //  continue
        //}
        let _line = _config[_l]
        if (_line.indexOf(',') > -1) {
          _line = _line.split(",");
          _output.push([
            _line[0].trim(),
            parseInt(_line[1]),
            _line[2]
          ]);
        }
        else {
          _output.push([
            _line.trim(),
            999999,
            'n'
          ]);
        }
      }
      // console.log(_output)
      return _output;
    },
    configWordRemapArray () {
      let output = this.config.session.configWordRemap.trim().split("\n")
      output = output.map(line => line.trim())
              .filter(line => (line.indexOf(',') > -1 && line !== '') )
              .map(line => {
                let targetWord = line.slice(0, line.indexOf(',')).trim()
                let replaceWord = line.slice(line.indexOf(',') + 1).trim()
                return {
                  targetWord,
                  replaceWord
                }
              })
      return output
    },
    
    configStopWordsArray () {
      if (!this.config.session.configStopWords) {
        return []
      }

      return this.config.session.configStopWords.trim().split("\n")
              .map(line => line.trim())
              .filter(line => (line !== '') )
    },
  }, // computed: {
  // methods: {

  // } // methods: {
}