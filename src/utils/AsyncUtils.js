export default {
  sleep: function (ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}