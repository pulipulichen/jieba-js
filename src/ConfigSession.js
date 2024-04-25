export default {
  inputFilename: `Raw Text`,
  inputText: `
message\tclass
這個<strong>布丁</strong> 是在食物的世界中  https://blog.pulipuli.info  找尋code跟找尋樂趣的1998種不能吃的codes，\t分類A
喜愛動漫畫、遊戲、Coding、遊戲，以及ABCDV跟世間脫節的🍮生活步調。\t分類B`,
  inputTable: [
    ['message'],
    ['這個<strong>布丁</strong> 是在食物的世界中 https://blog.pulipuli.info 找尋code跟找尋樂趣的1998種不能吃的codes，'],
    ['喜愛動漫畫、遊戲、Coding，以及ABCDV跟世間脫節的🍮生活步調。']
  ],
  inputFormat: 'text', // text || table

  segmentationMethod: 'dictionary',
  //segmentationMethod: 'n-gram',
  nGramLength: 2,
  configUserDictionary: `找尋樂趣
無聊的世界`,
  configWordRemap: `食物,甜點
🍮,布丁`,
  configStopWords: null,

  removeEnglish: false,
  removeNumber: false,
  removeHTML: false,
  removeEmoji: true,
  
  usePorterStemmer: true,
  useLowerCase: true,

  displayPanel: 'text',

  doRemoveHeader: true,

  onlyFirstColumn: true,
  columnSeparator: ",",

  wordVectorModel: 'TermFrequency', // BagOfWords
  minTermFrequency: 1,
  topN: 1000,
}