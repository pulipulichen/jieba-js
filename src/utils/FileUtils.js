
export default {
  /**
   * 下載檔案
   * https://stackoverflow.com/a/18197341/6645399
   * @param {String} filename
   * @param {String} text
   * @returns {Boolean}
   */
  download: function (filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

    return true
  }
}