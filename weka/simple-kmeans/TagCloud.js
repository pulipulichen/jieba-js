TagCloud = {
  donwload: function (button, _i, count) {
    let data = []

    let td = $(button).parents('table:first').find('tbody > tr.good > td:eq(' + (_i-1) +  ') > div')
    td.children().each((i, span) => {
      span = $(span)
      let avg = span.attr('data-avg')
      eval('avg = ' + avg)
      let attr = span.text().trim()
      if (attr.indexOf(': ') > 0) {
        attr = attr.slice(attr.indexOf(': ') + 2).trim()
      }
      
      if (attr === '' || attr.startsWith('筆數')) {
        return
      }
      if (attr.endsWith('*')) {
        attr = attr.slice(0, -1)
      }
      data.push({
        'attr': attr,
        'freq': Math.ceil(avg * count)
      })
    })
    
    //console.log(data)
    data.sort(function (a, b) {
        return b.freq - a.freq;
    });
    //console.log(data)

    //console.log(data)
    let stringData = []
    
    data.forEach(item => {
      stringData.push(item.freq + '\t' + item.attr)
    })
    
    _download_file(stringData.join('\n'), 'TagCloud-cluster' + _i + '.txt', 'txt')
  },
  
}