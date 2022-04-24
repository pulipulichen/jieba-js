module.exports = {
  prop: ['config'],
  // mounted: function () {
    
  // },
  components: {
    //ProcessManager: httpVueLoader('./html-lib/components/TextPanel/ProcessManager/ProcessManager.vue'),
    TextInputPanel: httpVueLoader('./html-lib/components/TextPanel/TextInputPanel/TextInputPanel.vue'),
    TextProcessComponent: httpVueLoader('./html-lib/components/TextPanel/TextProcessComponent/TextProcessComponent.vue'),
    TextOutputPanel: httpVueLoader('./html-lib/components/TextPanel/TextOutputPanel/TextOutputPanel.vue'),
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
    }
  } // methods: {
}