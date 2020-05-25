var appData = {
    inputFilename: `Raw Text`,
    inputText: `message
這個<strong>布丁</strong> 是在無聊的世界中找尋code的1998種不能吃的codes，
喜愛動漫畫、遊戲、Coding，以及ABCDV跟世間脫節的生活步調。`,
    outputText: ``,
    //step: 2,
    //segmentationMethod: 'dictionary',
    segmentationMethod: 'n-gram',
    nGramLength: 2,
    configUserDictionary: `找尋樂趣,9999999,n
無聊的世界,9999999,n`,
    configUserDictionaryExample: '',
    configWordRemap: `食物,甜點`,
    configWordRemapExample: '',
    configStopWords: `這個
，
、
。`,
    configStopWordsExample: '',
    fullStopWords: null,
    removeEnglish: false,
    removeNumber: false,
    removeHTML: true,
    usePorterStemmer: true,
    useLowerCase: true,
    jiebaInited: false,
    processOutputWait: false,
    displayPanel: 'text',
    //displayPanel: 'configuration',
    persistKey: 'jieba-js.' + location.href,
    configChanged: false,
    doRemoveHeader: false,
  }