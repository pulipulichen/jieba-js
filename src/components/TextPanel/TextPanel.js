import TextInputPanel from './TextInputPanel/TextInputPanel.vue'
import TextOutputPanel from './TextOutputPanel/TextOutputPanel.vue'
import TextProcessComponent from './TextProcessComponent/TextProcessComponent.vue'

export default {
  props: ['config', 'utils'],
  // mounted: function () {
    
  // },
  components: {
    //ProcessManager: httpVueLoader('./html-lib/components/TextPanel/ProcessManager/ProcessManager.vue'),
    TextInputPanel,
    TextProcessComponent,
    TextOutputPanel,
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
      setTimeout(() => {
        this.$refs.TextInputPanel.initInputOptions()
        this.$refs.TextProcessComponent.processOutput()
      }, 0)
    },
    processOutput () {
      this.$refs.TextProcessComponent.processOutput()
    }
  } // methods: {
}