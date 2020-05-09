$(function () {
  var _form = $("form");
  var _submit_button = _form.find('button#trigger');
  _submit_button.click(function () {
    var _text = $("#input").val().trim();
    _text = filterWordRemap(_text)

    $("#output").val("");
    //console.log(_text);
    var _submit = $(this).find("button#trigger");
    _submit.attr("disabled", "disabled");
    _submit.html("處理中...");
    $("body").css("cursor", "wait");

    let rule = $('[name="token_rule"]:checked').val()
    if (rule === 'n-gram') {
      _text = filterStopWords(_text)
    }

    var _custom_dict = _load_custom_dict();
    //console.log(_custom_dict);

    // ---------------------------

    /*
     call_jieba_cut(_text, _custom_dict, function (_result) {
     _result = _filter_stop_words(_result);
     
     _result = _result.join(" ");
     while (_result.indexOf("  ") > -1) {
     _result = _result.replace(/  /g, ' ');
     }
     _result = _result.replace(/ \n /g, "\n");
     _result = _result.replace(/ \t /g, "\t");
     _result = _result.replace(/ \' /g, "'");
     _result = _result.replace(/\' /g, "'");
     _result = _result.trim();
     $("#output").val(_result);
     _submit.removeAttr("disabled");
     _submit.html("開始斷詞");
     $("body").css("cursor", "default");
     });
     */

    var _text_array = _text.split('\n')
    var _result_array = []

    let next = (_result, i) => {
      //console.log(_result)
      _result = _filter_stop_words(_result);

      _result = _result.join(" ");
      while (_result.indexOf("  ") > -1) {
        _result = _result.replace(/  /g, ' ');
      }
      _result = _result.replace(/ \n /g, "\n");
      _result = _result.replace(/ \t /g, " ");
      _result = _result.replace(/\t/g, " ");
      _result = _result.replace(/ \' /g, "'");
      _result = _result.replace(/\' /g, "'");
      if (_result.startsWith('" ')) {
        _result = _result.slice(2)
      }
      _result = _result.trim();

      _result_array.push(_result)
      i++
      loop(i)
    }

    let loop = (i) => {
      if (i < _text_array.length) {
        if (rule === 'dictionary') {
          let line = _text_array[i]
          if ((line.startsWith('"') && line.endsWith('"'))
                  || (line.startsWith("'") && line.endsWith("'"))) {
            line = line.slice(1, -1).trim()
          }
          call_jieba_cut(line, _custom_dict, function (_result) {
            next(_result, i)
          });
        } else {
          let _result = processNGram(_text_array[i])
          next(_result, i)
        }
      } else {
        $("#output").val(_result_array.join('\n'));
        _submit.removeAttr("disabled");
        _submit.html("開始斷詞");
        $("body").css("cursor", "default");
      }
    }

    loop(0)

    return false;
  });

  /*
   _load_file("user_dict.txt", "user_dict", function () {
   _load_file("stop_words.txt", "stop_words", function () {
   setTimeout(function () {
   //_submit_button.click();
   }, 0);
   });
   });
   */

   setTimeout(() => {
     _submit_button.click(); // 網頁讀取時即開始執行斷詞
   }, 1000)
});

let processNGram = (text) => {
  text = text.trim()
  //console.log(text)
  let gram = $('.n-gram-number').val()
  gram = parseInt(gram, 10)
  let output = []
  //console.log([gram, text.substr(0, 2), text.length - gram + 1])

  text.split(' ').forEach(part => {
    part = part.trim()
    if (part.length < gram) {
      output.push(part)
    }
    for (let i = 0; i < part.length - gram + 1; i++) {
      output.push(part.substr(i, gram))
    }
  })


  return output
}

let filterWordRemap = (text) => {
  $("#word_remap").val().trim().split("\n").forEach(line => {
    line = line.trim()
    if (line.indexOf(',') === -1) {
      return
    }
    let targetWord = line.slice(0, line.indexOf(',')).trim()
    let replaceWord = line.slice(line.indexOf(',') + 1).trim()
    text = text.split(targetWord).join(replaceWord)
  })
  return text
}

let filterStopWords = (text) => {
  $("#stop_words").val().trim().split("\n").forEach(line => {
    line = line.trim()
    text = text.split(line).join('')
  })
  return text
}

var _load_file = function (_url, _textarea_id, _callback) {
  $.get(_url, function (_result) {
    $("#" + _textarea_id).val(_result);
    if (typeof (_callback) === "function") {
      _callback();
    }
  });
};

var _load_custom_dict = function () {
  var _config = $("#user_dict").val().trim().split("\n");
  var _output = [];
  for (var _l in _config) {
    if (_config[_l].indexOf(',') === -1) {
      continue
    }
    var _line = _config[_l].split(",");
    _output.push([
      _line[0].trim(),
      parseInt(_line[1]),
      _line[2]
    ]);
  }
  //console.log(_output)
  return _output;
};

var _filter_stop_words = function (_result) {
  var _stopwords = $("#stop_words").val().trim().split("\n");
  for (var _s in _stopwords) {
    _stopwords[_s] = _stopwords[_s].trim();
  }

  var _output = [];
  for (var _r in _result) {
    var _word = _result[_r].trim();
    if (_stopwords.indexOf(_word) === -1) {
      _output.push(_word);
    }
  }
  return _output;
};

var _download_file = function (_textarea_id) {
  var _file_name = _textarea_id + ".txt";
  var _file_content = $("#" + _textarea_id).val().trim();
  if (_file_content === "") {
    return;
  }

  var _character_encoding = "utf-8";

  // ------------

  var blob = new Blob([_file_content], {type: "text/html;charset=" + _character_encoding});
  saveAs(blob, _file_name);
};