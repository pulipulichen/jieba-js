import {saveAs} from 'file-saver'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'

import TextOutputSegPanel from './TextOutputSegPanel/TextOutputSegPanel.vue'
import TextOutputWordVectorPanel from './TextOutputWordVectorPanel/TextOutputWordVectorPanel.vue'
import TextOutputTransPanel from './TextOutputTransPanel/TextOutputTransPanel.vue'
import TextOutputEmbbedingPanel from './TextOutputEmbbedingPanel/TextOutputEmbbedingPanel.vue'

export default {
  props: ['config', 'utils'],
  components: {
    TextOutputSegPanel,
    TextOutputWordVectorPanel,
    TextOutputTransPanel,
    TextOutputEmbbedingPanel
  },
  // mounted: function () {

  // },  // mounted: function () {
  computed: {
    
    // outputTextWordVectorString () {
    //   let vector = this.config.state.outputTextWordVector
    //   if (!vector || vector === '') {
    //     return ''
    //   }

    //   var wb = XLSX.utils.book_new();

    //   wb.SheetNames.push("data")

    //   let ws = this.utils.Sheet.aoa_to_sheet(vector)
    //   //console.log(ws)
    //   wb.Sheets["data"] = ws

    //   //var wbout = XLSX.write(wb, {bookType: 'ods', bookSST: true, type: 'base64'});
    //   //let filename = 'jieba-js-config_' + (new Date()).mmddhhmm() + '.ods'
    //   //saveAs(new Blob([this.s2ab(wbout)], {type: "application/octet-stream"}), filename);

    //   let csv = XLSX.write(wb, {bookType:'csv', bookSST:true, type: 'string'})
    //   console.log(csv)
    //   return csv
    // },
    computedLeftOutputColumnClassName () {
      if (this.config.session.wordVectorModel === 'Embbeding') {
        return 'six wide column'
      }
      return 'eight wide column'
    },
    outputButtonDisabled () {
      return (this.config.state.outputTextRows.length === 0)
    },
    
    computedRightOutputColumnClassName () {
      if (this.config.session.wordVectorModel === 'Embbeding') {
        return 'five wide column'
      }
      return 'eight wide column'
    }
  }, // computed: {
  methods: {
    getClassifyText: async function () {
      
      if (this.config.session.wordVectorModel !== 'Embbeding') {
        let result = await this.$refs.TextOutputWordVectorPanel.getClassifyText()
        //console.log(result)
        return result
      }
      else if (this.config.session.wordVectorModel === 'Embbeding') {
        
        await this.$refs.TextOutputTransPanel.startTrans()
        
        await this.$refs.TextOutputEmbbedingPanel.startProcess()
        //console.log('aasas')
        let result = this.$refs.TextOutputEmbbedingPanel.getClassifyText()
        //return false
        //console.log(result)
        setTimeout(() => {
          this.config.state.processOutputWait = false
        }, 0)

        return result

        //return this.$refs.TextOutputWordVectorPanel.getClassifyText()
      }
    },
    getLineText (line) {
      return this.$parent.getLineText(line)
    },
    getLineClass (line) {
      return this.$parent.getLineClass(line)
    }
    
  } // methods: {
}