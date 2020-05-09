$(() => {
  
  let data = {}
  let localStorageKey = 'puli-form-persist'
  
  $('.data-auto-save').change(function () {
    data[this.name] = this.value
    //console.log(data)
    localStorage.setItem(localStorageKey, JSON.stringify(data))
  })
  
  let itemFromLocalStorage = localStorage.getItem(localStorageKey)
  //console.log(itemFromLocalStorage)
  if (typeof(itemFromLocalStorage) === 'string'
          && itemFromLocalStorage !== '') {
    data = JSON.parse(itemFromLocalStorage)
    Object.keys(data).forEach((name) => {
      $(`.data-auto-save[name="${name}"]`).val(data[name])
    })
  }
})