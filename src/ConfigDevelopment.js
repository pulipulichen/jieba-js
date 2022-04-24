export default {
  version: '20220424-1948',

  configStopWordsFile: `./stop_words.txt`,

  persistKey: 'jieba-js.' + location.href,

  debug: {
    startSegmentationOnLoad: true,
  }
}