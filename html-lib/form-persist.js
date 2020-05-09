$(() => {
  
  let data = {}
  let localStorageKey = 'puli-form-persist.' + location.href + '.'
  
  $('.data-auto-save[name],.data-auto-save[id]').change(function () {
    let name = this.name
    if (!name) {
      name = '#' + this.id
    }
    if (!name) {
      return false
    }
    
    let type = this.type
    // console.log(type)
    
    if (this.type === 'checkbox' || this.type === 'radio') {
      data[name] = this.checked
    }
    else {
      data[name] = this.value
    }
    
    localStorage.setItem(localStorageKey, JSON.stringify(data))
  })
  
  let itemFromLocalStorage = localStorage.getItem(localStorageKey)
  //console.log(itemFromLocalStorage)
  if (typeof(itemFromLocalStorage) === 'string'
          && itemFromLocalStorage !== '') {
    data = JSON.parse(itemFromLocalStorage)
    Object.keys(data).forEach((name) => {
      let input
      if (name.startsWith('#')) {
        input = $(`${name}`)
      }
      else {
        input = $(`.data-auto-save[name="${name}"]`)
      }
      
      let type = input.attr('type')
      if (type === 'checkbox' || type === 'radio') {
        input.attr('checked', data[name])
      }
      else {
        input.val(data[name])
      }
    })
  }
})