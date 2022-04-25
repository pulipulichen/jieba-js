export default {
  outputTextRows: [],
  outputTextRowsJoined: [],
  outputText: ``,
  outputTextTranslated: ``,
  outputTextWordVector: [],
  outputClasses: [],
  selectClasses: [],

  configUserDictionaryExample: '',
  configWordRemapExample: '',
  configStopWordsExample: '',
  fullStopWords: null,

  jiebaInited: false,
  processOutputWait: false,
  
  configChanged: false,
  columnNames: [],
  textColumnName: 'message',
  classColumnName: 'class',
  delimiter: '\t'
}