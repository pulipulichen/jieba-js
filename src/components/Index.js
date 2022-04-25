/* global Node */
import $, { data } from 'jquery'
import loadingSVG from './images/loading.svg'
import PanelMenu from './PanelMenu/PanelMenu.vue'

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
    this.utils.postMessageAPI.ready()

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
      this.utils.postMessageAPI.addReceiveListener(async (data) => {
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
    persist(needReset) {
      if (this.inited === false) {
        return false
      }

      if (needReset) {
        this.configChanged = true
      }
      
      //console.log('ok')

      let key = this.config.development.persistKey
      let data = this.config.session

      //console.log(data)
      localStorage.setItem(key, JSON.stringify(data))
    },
    loadPersistedData() {
      let dataString = localStorage.getItem(this.config.development.persistKey)
      //console.log(dataString)
      if (dataString) {
        let data = JSON.parse(dataString)
        for (let key in data) {
          //console.log(key, data[key])
          this.config.session[key] = data[key]
        }
      }
    },
  }
}

export default Index