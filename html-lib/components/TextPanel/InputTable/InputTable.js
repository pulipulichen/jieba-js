module.exports = {
  prop: ['config'],
  mounted: function () {

  },  // mounted: function () {
  computed: {

  }, // computed: {
  methods: {
    initTables () {
      var data = [
    ['', 'Ford', 'Tesla', 'Toyota', 'Honda'],
    ['2017', 10, 11, 12, 13],
    ['2018', 20, 11, 14, 13],
    ['2019', 30, 15, 12, 13]
  ];
  
      new Handsontable(this.$refs.InputTable, {
        data: this.inputTable.splice(1),
        colHeaders: this.inputTable[0],
        rowHeaders: true,
        filters: true,
        dropdownMenu: true,
        minSpareRows: 1,
        contextMenu: true
      });
    }
  } // methods: {
}