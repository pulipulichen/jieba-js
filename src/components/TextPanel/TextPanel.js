import TextInputPanel from './TextInputPanel/TextInputPanel.vue'
import TextOutputPanel from './TextOutputPanel/TextOutputPanel.vue'
import TextProcessComponent from './TextProcessComponent/TextProcessComponent.vue'
import TextOutputExportPanel from './TextOutputExportPanel/TextOutputExportPanel.vue'

export default {
  props: ['config', 'utils'],
  // mounted: function () {
    
  // },
  components: {
    //ProcessManager: httpVueLoader('./html-lib/components/TextPanel/ProcessManager/ProcessManager.vue'),
    TextInputPanel,
    TextProcessComponent,
    TextOutputPanel,
    TextOutputExportPanel
    //InputTable: httpVueLoader('./html-lib/components/TextPanel/InputTable/InputTable.vue'),
  },
  computed: {
    
    // computedStepClass: function (stepID) {
    //   return {
    //     'completed': (this.step > stepID),
    //     'active': (this.step === stepID)
    //   }
    // },
  },
  methods: {
    initProcessOutput () {
      //return false
      setTimeout(async () => {
        this.$refs.TextInputPanel.initInputOptions()
        await this.$refs.TextProcessComponent.processOutput()

        // if (this.config.session.wordVectorModel === 'Embbeding') {
        //   await this.$refs.TextOutputPanel.$refs.TextOutputTransPanel.startTrans()
        //   await this.$refs.TextOutputPanel.$refs.TextOutputEmbbedingPanel.startProcess()
        // }
        // else {
        //   await this.$refs.TextOutputPanel.getClassifyText()
        // }
        
      }, 0)
    },
    processOutput () {
      return this.$refs.TextProcessComponent.processOutput()
    },
    processWordVectorModel: async function () {
      await this.utils.Async.sleep(0)
      await this.$refs.TextOutputPanel.getClassifyText()
      //console.log(this.config.state.processOutputWait)
      //this.config.state.processOutputWait = false
    },
    getLineText (line) {
      if (this.config.state.textColumnName && 
        line[this.config.state.textColumnName]) {
        //console.log(line[this.config.state.textColumnName])
        return line[this.config.state.textColumnName]
      }
      return line
    },
    getLineClass (line) {

      if (this.config.state.classColumnName && 
        line[this.config.state.classColumnName]) {
        let className = line[this.config.state.classColumnName]

        return className
        //return line[this.config.state.textColumnName]
      }
      return undefined
    },
    getClassifyText: async function () {
      return await this.$refs.TextOutputPanel.getClassifyText()
    }
  } // methods: {
}