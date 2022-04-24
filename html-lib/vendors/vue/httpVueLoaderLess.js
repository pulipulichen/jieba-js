/* global httpVueLoader, less */

httpVueLoader.langProcessor.less = function (lessText) {
  return new Promise(function (resolve, reject) {
    less.render(lessText, {}, function (err, css) {
      if (err)
        reject(err);
      resolve(css.css);
    });
  })
}