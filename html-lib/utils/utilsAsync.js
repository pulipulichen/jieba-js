var vueAppDataUtilsAsync = {
  sleep: async function (ms) {
    if (typeof (ms) !== 'number') {
      ms = 1
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, ms)
    })
  },
}