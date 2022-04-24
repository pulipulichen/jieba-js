/* global postMessageAPI, XLSX */

var appMethodsUpload = {
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
  processUploadConfiguration: async function (input) {
    var workbook = await XLSX.readAsync(input, {type: 'binary'});

    var result = [];
    for (let i in workbook.SheetNames) {
      let sheetName = workbook.SheetNames[i]

      var json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
      if (sheetName === 'Segmentation') {
        json.forEach(({key, value}) => {
          this[key] = value
        })
      } else if (sheetName === 'UserDictionary') {
        this.configUserDictionary = json.map(({word, weight, pos}) => [word, weight, pos].join(',')).join('\n')
      } else if (sheetName === 'WordRemap') {
        this.configWordRemap = json.map(({from, to}) => [from, to].join(',')).join('\n')
      } else if (sheetName === 'StopWords') {
        this.configStopWords = json.map(({stopword}) => stopword).join('\n')
      }
      //result.push(csv.trim())
    }

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
  }
}