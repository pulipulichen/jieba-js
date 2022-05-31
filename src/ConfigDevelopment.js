export default {
  version: '20220530-2252',

  configStopWordsFile: `./stop_words.txt`,

  persistKey: 'jieba-js.' + location.href,

  debug: {
    startSegmentationOnLoad: false,
    skipJiebaJS: false,
    skipTrans: false,
    skipEmbbeding: false,
  }
}