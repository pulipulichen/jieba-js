/* global Node */
import $ from 'jquery'
import loadingSVG from './images/loading.svg'
import PanelMenu from './PanelMenu/PanelMenu.vue'

import postMessageAPI from './vendors/puli-post-message-api/puli-post-message-api.js'

let Index = {
  props: ['config', 'utils'],
  data () {    
    this.$i18n.locale = this.config.locale
    //console.log(this.config.saveToCloud)
    return {
      loadingSVG,
    }
  },
  components: {
    PanelMenu,
    ConfigurationPanel: () => import(/* webpackChunkName: "vendors/ConfigurationPanel" */ './ConfigurationPanel/ConfigurationPanel.vue'),
    TextPanel: () => import(/* webpackChunkName: "vendors/TextPanel" */ './TextPanel/TextPanel.vue'),
  },
  computed: {
    searchParams () {
      let output = {}
      const currentURL = new URL(location.href)
      for(let [key, value] of currentURL.searchParams.entries()) {
        output[key] = value
      }
      return output
    },
  },
  async mounted () {
    
    this.setupAPI()



    //console.log(stemmer("hopefully", true), stemmer("loves", true))

    this.loadPersistedData()
    postMessageAPI.ready()

  //  if (this.inputFormat === 'table') {
  //    this.initTabls()
  //  }

    //console.log(this.searchParams.api)
    if (!this.searchParams.api) {
      if (this.config.development.debug.startSegmentationOnLoad === false) {
        return false
      }
      
      setTimeout(async () => {
        //this.initInputOptions()
        //this.processOutput()
        while (!this.$refs.TextPanel) {
          await this.utils.Async.sleep(500)
        }

        //console.log(this.$refs)
        this.$refs.TextPanel.initProcessOutput()
      }, 100)
    }
  },
  methods: {
    setupAPI() {
      postMessageAPI.addReceiveListener(async (data) => {
        console.log('收到資料了', data)
        if (typeof (data) === 'string') {
          this.inputText = data
        } else {
          for (let key in data) {
            this[key] = data[key]
          }
        }
        console.log('開始準備處理')
        let result = await this.processOutput()
        console.log(result)
        return result
      })
      //console.log('設定好了')
    },
    persist() {
      this.configChanged = true
      let key = this.persistKey
      let data = {
        segmentationMethod: this.segmentationMethod,
        nGramLength: this.nGramLength,
        configUserDictionary: this.configUserDictionary,
        configWordRemap: this.configWordRemap,
        configStopWords: this.configStopWords,
        usePorterStemmer: this.usePorterStemmer,
        removeEnglish: this.removeEnglish,
        removeNumber: this.removeNumber,
        removeHTML: this.removeHTML,
        useLowerCase: this.useLowerCase,
        inputFormat: this.inputFormat,
      }
      localStorage.setItem(key, JSON.stringify(data))
    },
    loadPersistedData() {
      let dataString = localStorage.getItem(this.persistKey)
      if (dataString) {
        let data = JSON.parse(dataString)
        for (let key in data) {
          this[key] = data[key]
        }
      }
    },
  }
}

export default Index