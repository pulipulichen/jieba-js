var configSession = {
  inputFilename: `Raw Text`,
  inputText: `
message\tclass
這個<strong>布丁</strong> 是在無聊的世界中找尋code的1998種不能吃的codes，\t分類A
喜愛動漫畫、遊戲、Coding、遊戲，以及ABCDV跟世間脫節的生活步調。\t分類B`,
  inputTable: [
    ['message'],
    ['這個<strong>布丁</strong> 是在無聊的世界中找尋code的1998種不能吃的codes，'],
    ['喜愛動漫畫、遊戲、Coding，以及ABCDV跟世間脫節的生活步調。']
  ],
  inputFormat: 'text', // text || table

  segmentationMethod: 'dictionary',
  //segmentationMethod: 'n-gram',
  nGramLength: 2,
  configUserDictionary: `找尋樂趣,9999999,n
無聊的世界,9999999,n`,
  configWordRemap: `食物,甜點`,
  configStopWords: null,

  removeEnglish: false,
  removeNumber: false,
  removeHTML: true,
  usePorterStemmer: true,
  useLowerCase: true,

  displayPanel: 'text',

  doRemoveHeader: false,

  onlyFirstColumn: true,
  columnSeparator: ",",

  wordVectorModel: 'TermFrequency', // BagOfWords
}