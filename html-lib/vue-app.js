var app = new Vue({
  el: '#app',
  data: {
    step: 0,
    message: 'Hello Vue!'
  },
  methods: {
    computedStepClass: function (stepID) {
      return {
        'completed': (this.step > stepID),
        'active': (this.step === stepID)
      }
    }
  }
})