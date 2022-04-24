export default {
  props: ['config', 'utils'],
  // mounted: function () {
  //   setTimeout(() => {
  //     this.initInputOptions()
  //     this.processOutput()
  //   }, 0)
  // },
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
    loadExample() {
      /*
      $.get('./demo/master-thesis-abstract.csv', (result) => {
        this.inputFilename = 'master-thesis-abstract'
        this.inputText = result
        this.processOutputWait = false
        
        this.initInputOptions()
      })
      */
      window.open('./demo/master-thesis-abstract.csv', '_blank')
    },
    loadInputFile(evt) {
      //console.log(1);loadInputFile
      if (!window.FileReader)
        return; // Browser is not compatible
  
      this.processOutputWait = true
      var reader = new FileReader();
      let filename = evt.target.files[0].name
      let type = evt.target.files[0].type
      //console.log(type)
      if (filename.indexOf('.') > -1) {
        filename = filename.slice(0, filename.lastIndexOf('.'))
      }
      this.inputFilename = filename
  
      reader.onload = async (evt) => {
        if (evt.target.readyState !== 2) {
          this.processOutputWait = false
          return;
        }
        if (evt.target.error) {
          alert('Error while reading file');
          this.processOutputWait = false
          return;
        }
  
        let result = evt.target.result
        if (type === 'application/vnd.oasis.opendocument.spreadsheet'
                || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.inputText = await this.processUploadTypeSheet(result)
        } else if (type === 'application/vnd.oasis.opendocument.text') {
          this.inputText = await this.processUploadTypeODT(result)
        } else if (type === 'text/html') {
          this.inputText = this.processUploadTypeHTML(result)
        } else if (type === 'text/csv') {
          this.inputText = await this.processUploadTypeCSV(result)
        } else {
          this.inputText = result
        }
        this.$refs.inputFileUploadTrigger.value = ''
        this.processOutputWait = false
        
        this.initInputOptions()
      }
  
      if (type === 'application/vnd.oasis.opendocument.spreadsheet'
              || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        let size = evt.target.files[0].size
        console.log('size', size)
        if (size > 25000000) {
          window.alert('ODS/XLSX檔案大小請低於2.5MB。')
          this.processOutputWait = false
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
  
      let $html = $(html)
      $html.find('script').remove()
      html = $html.text()
  
      html = html.split('\n')
              .map(line => line.trim())
              .filter(line => line !== '')
              .join('\n')
      return html
    },
    processUploadTypeSheet: async function (input) {
      var workbook = await XLSX.readAsync(input, {type: 'binary'});
  
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
      var workbook = await XLSX.readAsync(input, {type: 'string'});
  
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
      this.onlyFirstColumn = initColumnSeparatorResult
      
      //let trimText = this.inputText.trim()
      
      if (this.isOneLine === true) {
        this.doRemoveHeader = false
        return true
      }
      
      //let t = _text.trim()
      //firstLine = trimText.slice(0, trimText.indexOf('\n'))
      //console.log(firstLine.length, firstLine, trimText.indexOf('\n'))
      if (this.firstLine.length < 20) {
        this.doRemoveHeader = true
      }
      else {
        this.doRemoveHeader = false
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
          this.columnSeparator = ''
          return false
        }
      }
      
      //console.log(result)
      for (let c in result) {
        if (result[c] === true) {
          this.columnSeparator = c
          return true
        }
      }
      this.columnSeparator = ''
      return false
    },
  } // methods: {
}