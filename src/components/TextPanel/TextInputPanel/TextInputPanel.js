import * as XLSX from 'xlsx'
import $ from 'jquery'

export default {
  props: ['config', 'utils'],
  data: function () {
    return {
      examples: [
        'master-thesis-abstract.csv',
        'qa-pet-fruit10.ods',
        'QA-Library.ods',
        'QA-HumanBank.ods',
        'QA-OnlineShopping.ods',
        'qa-pet-fruit.csv',
        'qa-pet-fruit-unsupervised_sort.csv',
        'qa-pet-fruit-unknown.csv',
        '2a-thesis- raw - data.csv',
      ]
    }
  },
  mounted: function () {
  //   setTimeout(() => {
  //     this.initInputOptions()
  //     this.processOutput()
  //   }, 0)
    this.initDropdown()
  },
  watch: {
    'config.session.inputText' () {
      this.config.state.outputTextRows = []
    }
  },
  computed: {
    
    inputTextTrim () {
      return this.config.session.inputText.trim()
    },
    inputTextTrimLines () {
      return this.inputTextTrim.split('\n')
    },
    isOneLine () {
      return (this.inputTextTrimLines.length === 1)
    },
    firstLine () {
      let line = this.inputTextTrimLines[0]
      
      if (this.config.session.onlyFirstColumn) {
        let pos = line.indexOf(this.config.session.columnSeparator)
        if (pos === -1) {
          return line
        }
        else {
          return line.slice(0, pos)
        }
      }
      else {
        return line
      }
    },
  }, // computed: {
  methods: {
    loadExample: async function () {
      /*
      $.get('./demo/master-thesis-abstract.csv', (result) => {
        this.inputFilename = 'master-thesis-abstract'
        this.inputText = result
        this.processOutputWait = false
        
        this.initInputOptions()
      })
      */
      //window.open('./demo/master-thesis-abstract.csv', '_blank')
      let filename = this.$refs.Dropdown.value
      if (filename === '') {
        return false
      }

      let url = './demo/' + filename

      let data = await this.utils.Axios.get(url)
      //console.log(data)
      if (url.endsWith('.csv')) {
        this.config.session.inputText = data.trim()
      }
      else {
        this.config.session.inputText = await this.processUploadTypeSheet(data)
      }
      if (filename.indexOf('.') > -1) {
        filename = filename.slice(0, filename.lastIndexOf('.'))
      }
      this.config.session.inputFilename = filename
    },
    initDropdown: async function () {
      while (!this.$refs.Dropdown) {
        await this.utils.Async.sleep()
      }
      setTimeout(() => {
        $(this.$refs.Dropdown).dropdown()
      }, 0)
    },
    downloadExample () {
      //let filename = $(this.$refs.Dropdown).dropdown('get value')
      let filename = this.$refs.Dropdown.value
      if (filename === '') {
        return false
      }

      //console.log(this.$refs.Dropdown.value)
      
      setTimeout(() => {
        //this.$refs.Dropdown.value = ''
        //$(this.$refs.Dropdown).dropdown('set value', '')
        //this.$refs.Dropdown.value = ''
        $(this.$refs.Dropdown).dropdown('set value', '')
        $('#inputFilename').focus().blur()
      }, 100)
        

      window.open('./demo/' + filename, '_blank')
    },
    loadInputFile(evt) {
      //console.log(1);loadInputFile
      if (!window.FileReader)
        return; // Browser is not compatible
  
      this.config.state.processOutputWait = true
      var reader = new FileReader();
      let filename = evt.target.files[0].name
      let type = evt.target.files[0].type
      //console.log(type)
      if (filename.indexOf('.') > -1) {
        filename = filename.slice(0, filename.lastIndexOf('.'))
      }
      this.config.session.inputFilename = filename
  
      reader.onload = async (evt) => {
        if (evt.target.readyState !== 2) {
          this.config.state.processOutputWait = false
          return;
        }
        if (evt.target.error) {
          alert('Error while reading file');
          this.config.state.processOutputWait = false
          return;
        }
  
        let result = evt.target.result
        if (type === 'application/vnd.oasis.opendocument.spreadsheet'
                || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.config.session.inputText = await this.processUploadTypeSheet(result)
        } else if (type === 'application/vnd.oasis.opendocument.text') {
          this.config.session.inputText = await this.processUploadTypeODT(result)
        } else if (type === 'text/html') {
          this.config.session.inputText = this.processUploadTypeHTML(result)
        } else if (type === 'text/csv') {
          this.config.session.inputText = await this.processUploadTypeCSV(result)
        } else {
          this.config.session.inputText = result
        }
        this.$refs.inputFileUploadTrigger.value = ''
        this.config.state.processOutputWait = false
        
        this.initInputOptions()

        //console.log(this.config.session.inputText)
      }
  
      if (type === 'application/vnd.oasis.opendocument.spreadsheet'
              || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        let size = evt.target.files[0].size
        console.log('size', size)
        if (size > 25000000) {
          window.alert('ODS/XLSX檔案大小請低於2.5MB。')
          this.config.state.processOutputWait = false
          return false
        }
  
        reader.readAsBinaryString(evt.target.files[0])
      } else {
        reader.readAsText(evt.target.files[0])
      }
    },
    processUploadTypeHTML(html) {
      if (html.indexOf('<article') > -1) {
        html = html.slice(html.indexOf('<article'), html.lastIndexOf('</article>') + 1)
        html = html.replace('<article', '<div')
                .replace('</article>', '</div>')
      } else if (html.indexOf('<body') > -1) {
        html = html.slice(html.indexOf('<body'), html.lastIndexOf('</body>') + 1)
        html = html.replace('<body', '<div')
                .replace('</body>', '</div>')
      }
  
      let $html = jquery(html)
      $html.find('script').remove()
      html = $html.text()
  
      html = html.split('\n')
              .map(line => line.trim())
              .filter(line => line !== '')
              .join('\n')
      return html
    },
    processUploadTypeSheet: async function (input) {
      var workbook = XLSX.read(input, {type: 'binary'});
  
      var result = [];
      for (let i in workbook.SheetNames) {
        let sheetName = workbook.SheetNames[i]
  
        var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName], {
          FS: '\t',
          blankrows: false
        });
  
        //console.log(csv)
        result.push(csv.trim())
      }
  
      result = result.join('\n')
      result = result.split('\n').map(line => line.trim()).filter(line => (line !== '')).join('\n')
  
      return result
    },
    processUploadTypeCSV: async function (input) {
      return input
      /*
      var workbook = XLSX.read(input, {type: 'string'})
      //console.log(workbook)
  
      var result = [];
      for (let i in workbook.SheetNames) {
        let sheetName = workbook.SheetNames[i]
  
        var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName], {
          FS: ' ',
          blankrows: false
        });
  
        //console.log(csv)
        result.push(csv.trim())
      }
  
      result = result.join('\n')
      result = result.split('\n').map(line => line.trim()).filter(line => (line !== '')).join('\n')
      
      return result
      */
    },
    processUploadTypeODT: async function (odt) {
      try {
        let html = new ODTDocument(odt).getHTML()
        return this.processUploadTypeHTML(html)
      } catch (e) {
        alert("Couldn't parse odt file.");
        throw e;
      }
    },

  
    initInputOptions () {
      
      let initColumnSeparatorResult = this.initColumnSeparator()
      this.config.session.onlyFirstColumn = initColumnSeparatorResult
      
      //let trimText = this.inputText.trim()
      
      if (this.isOneLine === true) {
        this.config.session.doRemoveHeader = false
        return true
      }
      
      //let t = _text.trim()
      //firstLine = trimText.slice(0, trimText.indexOf('\n'))
      //console.log(firstLine.length, firstLine, trimText.indexOf('\n'))
      if (this.firstLine.length < 20) {
        this.config.session.doRemoveHeader = true
      }
      else {
        this.config.session.doRemoveHeader = false
      }
    },
    initColumnSeparator () {
      let candidates = [',', '\t']
      
      let result = {}
      candidates.forEach(c => {
        result[c] = true
      })
      let falseCounter = 0
      
      for (let i = this.inputTextTrimLines.length - 1; i > -1; i--) {
        let line = this.inputTextTrimLines[i]
        
        candidates.forEach(c => {
          if (result[c] === false) {
            return false
          }
          
          //console.log(c, line, line.split(c).length)
          if (line.split(c).length !== 2) {
            result[c] = false
            falseCounter++
          }
        })
        
        if (falseCounter === candidates.length) {
          this.config.session.columnSeparator = ''
          return false
        }
      }
      
      //console.log(result)
      for (let c in result) {
        if (result[c] === true) {
          this.config.session.columnSeparator = c
          return true
        }
      }
      this.config.session.columnSeparator = ''
      return false
    },
  } // methods: {
}