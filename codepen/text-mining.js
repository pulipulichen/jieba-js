var _process_file = function(_input, _callback) {
    _loading_enable();
    var _panel = $(".file-process-framework");
  //------------------
  
  var _lines = _input.split("\n");
  //console.log(_input);
    
  var _attr_list = [];
  var _class_index;
  var _class_list = [];
  var _train_data = [];
  var _test_data = [];
  for (var _l = 0; _l < _lines.length; _l++) {
      var _fields = _lines[_l].split(",");
      var _line_fields = [];
      for (var _f = 0; _f < _fields.length; _f++) {
          var _value = _fields[_f].trim();
          //console.log(_value);
          
          if (_l === 0) {
              _attr_list.push(_value);
              if (_value === "class") {
                  _class_index = _f;
              }
          }
          else {
              if (_f !== _class_index) {
                  _value = "'" + _value + "'";
              }
              _line_fields.push(_value);
              if (_f === _class_index && _value !== "?" && $.inArray(_value, _class_list) === -1) {
                  _class_list.push(_value);
              }
          }
      }
      
      if (_line_fields.length > 0) {
          if (_fields[_class_index] !== "?") {
              _train_data.push(_line_fields);
          }
          else {
              _test_data.push(_line_fields);
          }
          
      }
  }
  
  var _loop = function (_data, _row_index, _col_index, _callback) {
      if (_row_index < _data.length) {
          if (_col_index < _data[_row_index].length && _col_index !== _class_index) {
              var _text = _data[_row_index][_col_index];
              _text = _text.substring(1, _text.length-1);
                call_jieba_cut(_text, function (_result) {
                    _data[_row_index][_col_index] = "'" + _result.join(" ") + "'";
                    
                    _col_index++;
                    _loop(_data, _row_index, _col_index, _callback);
                });
          }
          else {
              _col_index = 0;
              _row_index++;
              _loop(_data, _row_index, _col_index, _callback);
          }
      }
      else {
          _callback();
      }
  };
  
    
  
  var _build_result = function () {
    var _train_title = _panel.find(".filename").val();
    var _test_title = _panel.find(".test_filename").val();

    var _result = "@relation '" + _train_title + "'\n\n";
    var _test_result = "@relation '" + _test_title + "'\n\n";

    for (var _a = 0; _a < _attr_list.length; _a++) {
        var _attr = _attr_list[_a];
        if (_attr !== "class") {
            _result = _result + "@attribute " + _attr + " string\n";
            _test_result = _test_result + "@attribute " + _attr + " string\n";
        }
        else {
            _result = _result + "@attribute class {" + _class_list.join(", ") + "}\n";
            _test_result = _test_result + "@attribute class {" + _class_list.join(", ") + "}\n";
        }
    }

    _result = _result + "\n@data\n";
    _test_result = _test_result + "\n@data\n";

    for (var _d = 0; _d < _train_data.length; _d++) {
        _result = _result + _train_data[_d].join(",") + "\n";
    }
    for (var _d = 0; _d < _test_data.length; _d++) {
        _test_result = _test_result + _test_data[_d].join(",") + "\n";
    }

    _result = _result.trim();
    _test_result = _test_result.trim();

    _panel.find(".test_preview").val(_test_result);

    _loading_disable();
    if (typeof(_callback) === "function") {
        _callback(_result);
    }
  
  };    //var _build_result = function () {
  
  // --------------------
  
  if ($("#enable_toker:checked").length === 1) {
    _loop(_train_data, 0, 0, function () {
          _loop(_test_data, 0, 0, function () {
              _build_result();
          });
    });  
  }
  else {
      _build_result();
  }
  
  // --------------------
};

// ---------------------

var _loading_enable = function () {
    $("#preloader").show().fadeIn();
};

var _loading_disable = function () {
    $("#preloader").fadeOut().hide();
};

// ---------------------

var arrayMin = function (arr) {
  return arr.reduce(function (p, v) {
    return ( p < v ? p : v );
  });
};

var arrayMax = function (arr) {
  return arr.reduce(function (p, v) {
    return ( p > v ? p : v );
  });
};

var _float_to_fixed = function(_float, _fixed) {
	var _place = 1;
	for (var _i = 0; _i < _fixed; _i++) {
		_place = _place * 10;
	}
	return Math.round(_float * _place) / _place;
};

var _stat_avg = function(_ary) {
	var sum = _ary.reduce(function(a, b) { return a + b; });
	var avg = sum / _ary.length;
	return avg;
};

var _stat_stddev = function (_ary) {
   var i,j,total = 0, mean = 0, diffSqredArr = [];
   for(i=0;i<_ary.length;i+=1){
       total+=_ary[i];
   }
   mean = total/_ary.length;
   for(j=0;j<_ary.length;j+=1){
       diffSqredArr.push(Math.pow((_ary[j]-mean),2));
   }
   return (Math.sqrt(diffSqredArr.reduce(function(firstEl, nextEl){
            return firstEl + nextEl;
          })/_ary.length));
};

// -------------------------------------

var _change_to_fixed = function () {
	var _to_fixed = $("#decimal_places").val();
	_to_fixed = parseInt(_to_fixed, 10);
	
	var _tds = $(".stat-result td[data-ori-value]");
	for (var _i = 0; _i < _tds.length; _i++) {
		var _td = _tds.eq(_i);
		var _value = _td.data("ori-value");
		_value = parseFloat(_value, 10);
		_value = _float_to_fixed(_value, _to_fixed);
		_td.text(_value);
	}
};

// -------------------------------------

var _output_filename_surffix="_train_document";
var _output_filename_test_surffix="_test_document";
var _output_filename_ext=".arff";


// -------------------------------------

var _load_file = function(evt) {
    //console.log(1);
    if(!window.FileReader) return; // Browser is not compatible

    var _panel = $(".file-process-framework");
    
    _panel.find(".loading").removeClass("hide");

    var reader = new FileReader();
    var _result;

    var _original_file_name = evt.target.files[0].name;
    var _pos = _original_file_name.lastIndexOf(".");
    var _file_name = _original_file_name.substr(0, _pos)
        + _output_filename_surffix
        + _original_file_name.substring(_pos, _original_file_name.length);
    _file_name = _file_name + _output_filename_ext;
    var _test_file_name = _original_file_name.substr(0, _pos)
        + _output_filename_test_surffix
        + _original_file_name.substring(_pos, _original_file_name.length);
    _test_file_name = _test_file_name + _output_filename_ext;
    
    _panel.find(".filename").val(_file_name);
    _panel.find(".test_filename").val(_test_file_name);
    
    reader.onload = function(evt) {
        if(evt.target.readyState !== 2) return;
        if(evt.target.error) {
            alert('Error while reading file');
            return;
        }

        //filecontent = evt.target.result;

        //document.forms['myform'].elements['text'].value = evt.target.result;
        _result =  evt.target.result;

        _process_file(_result, function (_result) {
            _panel.find(".preview").val(_result);
                        
            $(".file-process-framework .myfile").val("");
            $(".file-process-framework .loading").addClass("hide");
            _panel.find(".display-result").show();
            _panel.find(".display-result .encoding").show();

            var _auto_download = (_panel.find('[name="autodownload"]:checked').length === 1);
            if (_auto_download === true) {
                _panel.find(".download-file").click();
            }
            
            //_download_file(_result, _file_name, "txt");
        });
    };


    //console.log(_file_name);

    reader.readAsText(evt.target.files[0]);
};

var _load_textarea = function(evt) {
    var _panel = $(".file-process-framework");
    
    // --------------------------

    var _result = _panel.find(".input-mode.textarea").val();
    if (_result.trim() === "") {
        return;
    }

    // ---------------------------
    
    _panel.find(".loading").removeClass("hide");

    // ---------------------------
    var d = new Date();
    var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
  
    var local = new Date(utc);
    var _file_date = local.toJSON().slice(0,19).replace(/:/g, "-");
    var _file_name = "train_document_" + _file_date + _output_filename_ext;
    var _test_file_name = "test_document_" + _file_date + _output_filename_ext;

    _panel.find(".filename").val(_file_name);
    _panel.find(".test_filename").val(_test_file_name);
    
    // ---------------------------

    _process_file(_result, function (_result) {
        _panel.find(".preview").val(_result);

        _panel.find(".loading").addClass("hide");
        _panel.find(".display-result").show();
        _panel.find(".display-result .encoding").hide();

        var _auto_download = (_panel.find('[name="autodownload"]:checked').length === 1);
        if (_auto_download === true) {
            _panel.find(".download-file").click();
        }
    });
};

var _download_file_button = function () {
    var _panel = $(".file-process-framework");
    
    var _file_name = _panel.find(".filename").val();
    var _data = _panel.find(".preview").val();
    
    _download_file(_data, _file_name, "csv");
};


var _download_file = function (data, filename, type) {
    var a = document.createElement("a"),
        file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }

}

// ------------------------
// ----------------------------

var _copy_table = function () {
	var _button = $(this);
	
	var _table = $($(this).data("copy-table"));
	var _tr_coll = _table.find("tr");
	
	var _text = "";
	for (var _r = 0; _r < _tr_coll.length; _r++) {
		if (_r > 0) {
			_text = _text + "\n";
		}
		
		var _tr = _tr_coll.eq(_r);
		var _td_coll = _tr.find("td");
		if (_td_coll.length === 0) {
			_td_coll = _tr.find("th");
		}
		for (var _c = 0; _c < _td_coll.length; _c++) {
			var _td = _td_coll.eq(_c);
			var _value = _td.text();
			
			if (_c > 0) {
				_text = _text + "\t";
			}
			_text = _text + _value.trim();
		}
	}
	
	_copy_to_clipboard(_text);
};

var _copy_csv_table = function () {
	var _button = $(this);
	
	var _text = $("#preview").val().replace(/,/g , "\t");
	
	_copy_to_clipboard(_text);
};

var _copy_to_clipboard = function(_content) {
	//console.log(_content);
	var _button = $('<button type="button" id="clipboard_button"></button>')
		.attr("data-clipboard-text", _content)
		.hide()
		.appendTo("body");
		
	var clipboard = new Clipboard('#clipboard_button');
	
	_button.click();
	_button.remove();
};

// -----------------------

var _change_show_fulldata = function () {
	
	var _show = ($("#show_fulldata:checked").length === 1);
	//console.log([$("#show_fulldata").attr("checked"), _show]);

	var _cells = $(".stat-result .fulldata");
	if (_show) {
		_cells.show();
	}
	else {
		_cells.hide();
	}
};

var _change_show_std = function () {
	var _show = ($("#show_std:checked").length === 1);

	var _cells = $(".stat-result tr.std-tr");
	if (_show) {
		_cells.show();
	}
	else {
		_cells.hide();
	}
};

// -----------------------

$(function () {
  var _panel = $(".file-process-framework");
  _panel.find(".input-mode.textarea").change(_load_textarea);
  _panel.find(".myfile").change(_load_file);
  _panel.find(".download-file").click(_download_file_button);
  
  $('.menu .item').tab();
  $("button.copy-table").click(_copy_table);
  $("button.copy-csv").click(_copy_csv_table);
  $("#decimal_places").change(_change_to_fixed);
  
  $("#show_fulldata").change(_change_show_fulldata);
  $("#show_std").change(_change_show_std);
  
  // 20170108 測試用
  //_load_textarea();
});