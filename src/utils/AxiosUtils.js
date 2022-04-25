import axios from 'axios'

export default {
  get: async function (url) {
    let options = {}
    if (url.endsWith('.ods') || url.endsWith('.xlsx')) {
      options = {
        responseType: 'arraybuffer', // Important
        headers: {
            'Content-Type': 'application/gzip'
        }
      }
    }
    let result = await axios.get(url, options)
    return result.data
  }
}