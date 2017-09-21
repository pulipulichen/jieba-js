var _process_file = function (_input, _callback) {
    _loading_enable();
    var _panel = $(".file-process-framework");
    //------------------

    var _is_numeric = true;

    var _lines = _input.trim().split("\n");
    
    var _class_field = $("#class_field").val().trim();
    var _string_fields = $("#string_fields").val().trim().split(",");
    var _date_fields = $("#date_fields").val().trim().split(",");
    var _timestamp_fields = $("#timestamp_fields").val().trim().split(",");
    var _is_timeseries_forecast_mode = false;
    //console.log(_input);

    var _attr_list = [];
    var _attr_type = {};
    var _norminal_list = {};
    var _class_index;
    var _class_list = [];
    var _train_data = [];
    var _test_data = [];
    var _date_attr_index = -1;
    var _timestamp_attr_index = -1;
    var _month_names = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    var _timeseries_periodics_custom_fields = {};
    
    var _toker = $('[name="toker"]:checked').val();
    for (var _l = 0; _l < _lines.length; _l++) {
        if (_l > 0 && _class_index === undefined) {
            alert('Class field "' + _class_field + '" not found.');
            _loading_disable();
            if (typeof (_callback) === "function") {
                _callback();
            }
            return;
        } 
        
        var _fields = _lines[_l].split(",");
        var _line_fields = [];
        
        for (var _f = 0; _f < _fields.length; _f++) {
            var _value = _fields[_f].trim();
            if ((_value.substr(0, 1) === '"' || _value.substr(0, 1) === "'")
                    && (_value.substr(_value.length - 1, 1) === '"' || _value.substr(_value.length - 1, 1) === "'")) {
                _value = _value.substr(1, _value.length - 1);
            }

            //console.log(_value);

            if (_l === 0) {
                _attr_list.push(_value);
                _attr_type[_value] = 'numeric';
                //if (_value === "class") {
                if (_value === _class_field) {
                    _class_index = _f;
                }
                //console.log(_value);
            }
            else {
                //console.log([isNaN(_value), _value]);
                if (_f !== _class_index && (isNaN(_value) === true && _value !== "?") ) {
                    
                    if (_value !== "?") {
                        _value = "'" + _value + "'";
                    }
                    
                    var _attr = _attr_list[_f];
                    //console.log(_attr);
                    if ($.inArray(_attr, _string_fields) > -1) {
                        _attr_type[_attr] = "string";
                    }
                    else if ($.inArray(_attr, _date_fields) > -1) {
                        _attr_type[_attr] = "date 'yyyy-MM-dd'";
                        _is_timeseries_forecast_mode = true;
                        _date_attr_index = _f;
                    }
                    else if ($.inArray(_attr, _timestamp_fields) > -1) {
                        _attr_type[_attr] = "date 'yyyy-MM-dd HH:mm:ss'";
                        _is_timeseries_forecast_mode = true;
                        _timestamp_attr_index = _f;
                    }
                    else {
                        _attr_type[_attr] = "nominal";
                        if ( typeof(_norminal_list[_attr]) === "undefined") {
                            _norminal_list[_attr] = [];
                        }
                        if ($.inArray(_value, _norminal_list[_attr]) === -1) {
                            _norminal_list[_attr].push(_value);
                        }
                    }
                    
                }
                _line_fields.push(_value);
                if (_f === _class_index && _value !== "?" && $.inArray(_value, _class_list) === -1) {
                    _class_list.push(_value);

                    //console.log([_value, isNaN(_value)]);
                    if (isNaN(_value)) {
                        _is_numeric = false;
                    }
                }
            }
        }   //  for (var _f = 0; _f < _fields.length; _f++) {

        if (_line_fields.length > 0) {
            //console.log(_fields[_class_index].trim());
            //console.log([_class_index], _fields);
            if (_fields[_class_index].trim() !== "?") {
                _train_data.push(_line_fields);
            }
            else {
                _test_data.push(_line_fields);
            }
            
            if (_is_timeseries_forecast_mode === true) {
                var _date;
                //var _next_date;
                
                //var _next_line_fields = [];
                //if (_l < _lines.length - 1) {
                //    _next_line_fields = _lines[(_l+1)].split(",");
                //}
                //else {
                //    _next_line_fields = _lines[(_l-1)].split(",");
                //}
                
                if (_date_attr_index > -1) {
                    _date = _line_fields[_date_attr_index].trim();
                    _date = new Date(_date);
                    
                    //_next_date = _next_line_fields[_date_attr_index].trim();
                    //_next_date = new Date(_next_date);
                    //var _interval_time = Math.abs(_next_date.getTime() - _date.getTime());
                    //console.log([_next_date.getTime(), _date.getTime()]);
                    //_next_date = new Date((_date.getTime() + _interval_time));
                    
                    //_date = '=' + _date.getFullYear() + ':' + _month_names[_date.getMonth()] + ':' + _date.getDate() + ':*:*:*:*:*:*:*/';
                    //_date = '>=' + _date.getFullYear() + ':' + _month_names[_date.getMonth()] + ':' + _date.getDate() + ':*:*:*:*:*:*:*' 
                    //        + ' <' +  _date.getFullYear() + ':' + _month_names[((_date.getMonth()+1)%12)] + ':' + _date.getDate() + ':*:*:*:*:*:*:*' + '/';
                    //_date = '<=' + _date.getFullYear() + ':' + _month_names[_date.getMonth()] + ':' + _date.getDate() + ':*:*:*:*:*:*:*/';
                    //_date = '=' + _date.getFullYear() + ':' + _month_names[_date.getMonth()] + ':' + '*' + ':*:*:*:*:*:*:*/';
                    //_date = '>=' + _date.getFullYear() + ':' + _month_names[_date.getMonth()] + ':' + _date.getDate() + ':*:*:*:*:*:*:*' 
                    //        + ' <' +  _next_date.getFullYear() + ':' + _month_names[_next_date.getMonth()] + ':' + _next_date.getDate() + ':*:*:*:*:*:*:*' + '/';
                    _date = '=' + _date.getFullYear() + ':' + _month_names[_date.getMonth()] + ':*:*:*:' + _date.getDate() + ':*:*:*:*/';
                }
                else if (_timestamp_attr_index > -1) {
                    _date = _line_fields[_timestamp_attr_index].trim();
                    _date = new Date(_date);
                    _date = '>=' + _date.getFullYear() + ':' + _month_names[_date.getMonth()] + ':' + _date.getDate() 
                            + ':*:*:*:*:' + _date.getHours() + ':' + _date.getMinutes() + ':' + _date.getSeconds() + '/';
                }
                for (var _t = 0; _t < _line_fields.length; _t++) {
                    if (_t === _timestamp_attr_index || _t === _date_attr_index || _t === _class_index) {
                        continue;
                    }
                    var _label = _line_fields[_t];
                    if (_label.substr(0,1) === "'") {
                        _label = _label.substr(1, _label.length-2);
                    }
                    var _attr_name = _attr_list[_t];
                    _date = _date + _label;
                    //console.log(_attr_name);
                    //console.log(_date);
                    
                    if (typeof(_timeseries_periodics_custom_fields[_attr_name]) === 'undefined') {
                        _timeseries_periodics_custom_fields[_attr_name] = [];
                    }
                    _timeseries_periodics_custom_fields[_attr_name].push(_date);
                }
                
            }
        }
    }
    
    var _title = "Weka Spreadsheet to ARFF (file process framework 20170401)";
    
    var _loop_wait = function (_data, _row_index, _col_index, _callback) {
        
        
        if (_row_index % 100 === 0) {
            try {
                //console.log([_row_index, _data.length, _col_index, _data[_row_index].length]);
                var _percent = Math.ceil(_row_index / _data.length * 100);
                var _percent_title = "(" + _percent + "%) " + _title;
                document.title = _percent_title;
            }
            catch (e) {}
            
            setTimeout(function () {    
                _loop(_data, _row_index, _col_index, _callback);
            }, 1);
        }
        else {
            _loop(_data, _row_index, _col_index, _callback);
        }
    };

    var _loop = function (_data, _row_index, _col_index, _callback) {
        if (_row_index < _data.length) {
            if (_col_index < _data[_row_index].length && _col_index !== _class_index) {
                var _text = _data[_row_index][_col_index];
                
                var _attr = _attr_list[_col_index];
                //console.log([_attr, _string_fields]);
                if ($.inArray(_attr, _string_fields) === -1) {
                    if (isNaN(_text) === true && _text !== '?') {
                        _text = _text.substring(1, _text.length - 1);
                        _text = "'" + _text + "'";
                    }
                    _data[_row_index][_col_index] = _text;

                    _col_index++;
                    _loop_wait(_data, _row_index, _col_index, _callback);
                    return;
                }
                else {
                    _text = _text.substring(1, _text.length - 1);
                    if (_toker === "radio_jieba") {
                        call_jieba_cut_join(_text, ' ', function (_result) {
                            _data[_row_index][_col_index] = "'" + _result + "'";

                            _col_index++;
                            _loop_wait(_data, _row_index, _col_index, _callback);
                        });
                    }
                    else {
                        var _result = _add_chinese_space(_text)
                        _data[_row_index][_col_index] = "'" + _result + "'";

                        _col_index++;
                        _loop_wait(_data, _row_index, _col_index, _callback);
                    }
                }
            }
            else {
                _col_index = 0;
                _row_index++;
                _loop_wait(_data, _row_index, _col_index, _callback);
            }
        }
        else {
            document.title = _title;
            _callback();
        }
    };



    var _build_result = function () {
        var _train_title = _panel.find(".filename").val();
        _train_title = _train_title.substr(0, _train_title.indexOf("."));
        var _test_title = _panel.find(".test_filename").val();
        _test_title = _test_title.substr(0, _test_title.indexOf("."));

        var _result = "@relation '" + _train_title + "'\n\n";
        var _test_result = "@relation '" + _test_title + "'\n\n";

        //console.log(_attr_list.length);
        for (var _a = 0; _a < _attr_list.length; _a++) {
            var _attr = _attr_list[_a];
            //if (_attr !== "class") {
            //console.log(_attr);
            if (_attr !== _class_field) {
            
                var _attr_setting = "@attribute " + _attr + " ";
                if (_attr_type[_attr] === "nominal") {
                    // 排序一下
                    var _array = JSON.parse(JSON.stringify(_norminal_list[_attr]));
                    _array = _array.sort();
                    _attr_setting = _attr_setting + "{" + _array.join(", ") + "}";
                }
                else {
                    _attr_setting = _attr_setting + _attr_type[_attr];
                }
                _attr_setting = _attr_setting + "\n";
                _result = _result + _attr_setting;
                _test_result = _test_result + _attr_setting;
            }
            else {
                if (_is_numeric === false) {
                    var _array = _class_list;
                    _array = _array.sort();
                    _result = _result + "@attribute " + _class_field + " {" + _array.join(", ") + "}\n";
                    _test_result = _test_result + "@attribute " + _class_field + " {" + _array.join(", ") + "}\n";
                }
                else {
                    _result = _result + "@attribute " + _class_field + " numeric\n";
                    _test_result = _test_result + "@attribute " + _class_field + " numeric\n";
                }
            }
        }

        _result = _result + "\n@data\n";
        _test_result = _test_result + "\n@data\n";

        //console.log(_train_data);
        for (var _d = 0; _d < _train_data.length; _d++) {
            _result = _result + _train_data[_d].join(",") + "\n";
        }
        for (var _d = 0; _d < _test_data.length; _d++) {
            _test_result = _test_result + _test_data[_d].join(",") + "\n";
        }

        _result = _result.trim();
        _test_result = _test_result.trim();

        _panel.find(".test_preview").val(_test_result);
        
        // --------------------------
        
        if (_is_timeseries_forecast_mode === true) {
           var _periodics_date = "time-series-periodics\n*pre-defined*:AM\n*pre-defined*:DayOfWeek\n*pre-defined*:DayOfMonth\n*pre-defined*:NumDaysInMonth\n*pre-defined*:Weekend\n*pre-defined*:Month\n*pre-defined*:Quarter"; 
           for (var _attr_name in _timeseries_periodics_custom_fields) {
               _periodics_date = _periodics_date + "\n*custom*:" + _attr_name + "\n" + _timeseries_periodics_custom_fields[_attr_name].join("\n");
           }
           _panel.find("#periodics_preview").val(_periodics_date);
        }
        
        if (_is_timeseries_forecast_mode === true) {
            $(".download-periodics-data-set").show();
            $(".periodics-filename-field").show();
            $(".periodics-content-field").show();
            
            $(".download-test-data-set").hide();
            $(".test-filename-field").hide();
            $(".test-content-field").hide();
        }
        else {
            $(".download-periodics-data-set").hide();
            $(".periodics-filename-field").hide();
            $(".periodics-content-field").hide();
            
            $(".download-test-data-set").show();
            $(".test-filename-field").show();
            $(".test-content-field").show();
        }
        
        // --------------------------

        _loading_disable();
        if (typeof (_callback) === "function") {
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

// -------------------

var _add_chinese_space = function(_content) {
    if( Object.prototype.toString.call( _content ) === '[object Array]' ) {
        var _new_content = [];
        for (var _i = 0; _i < _content.length; _i++) {
            _new_content.push(_add_chinese_space(_content[_i]));
        }
        return _new_content;
    }
    
    var _result = _content;
    
    _result = _result.replace(/([_]|[\W])/g,function (_matches, _contents, _offset, _s) {
        if (_matches[0].match(/[0-9\s]/)) {
            return _matches[0];
        }
        else {
            return " " + _matches[0] + " ";
        }
    });
    _result = _result.replace(/@[\x00-\x08\x0B\x0C\x0E-\x1F]@/g, ' '); // 避免Solr illegal characters
    _result = _result.replace(/\s+/g, ' ');
    _result = _result.trim();
    return _result;
};

//console.log(_add_chinese_space("您可以探家自 Google 地球和支援合作夥伴建立的套件合大量111景點視訊和影像的資111aaa源函數庫"));
//console.log(_add_chinese_space("這份編號是tc_130的心靈錯位器真是太cool了"));
//console.log(_add_chinese_space("這個布丁是在無聊的世界中找尋樂趣的一種不能吃的食物，喜愛動漫畫、遊戲、程式，以及跟世間脫節的生活步調。"));
//console.log(_add_chinese_space("  測   試    看   看   "));
//console.log(_add_chinese_space("2013-03-24_23230021"));

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
        return (p < v ? p : v);
    });
};

var arrayMax = function (arr) {
    return arr.reduce(function (p, v) {
        return (p > v ? p : v);
    });
};

var _float_to_fixed = function (_float, _fixed) {
    var _place = 1;
    for (var _i = 0; _i < _fixed; _i++) {
        _place = _place * 10;
    }
    return Math.round(_float * _place) / _place;
};

var _stat_avg = function (_ary) {
    var sum = _ary.reduce(function (a, b) {
        return a + b;
    });
    var avg = sum / _ary.length;
    return avg;
};

var _stat_stddev = function (_ary) {
    var i, j, total = 0, mean = 0, diffSqredArr = [];
    for (i = 0; i < _ary.length; i += 1) {
        total += _ary[i];
    }
    mean = total / _ary.length;
    for (j = 0; j < _ary.length; j += 1) {
        diffSqredArr.push(Math.pow((_ary[j] - mean), 2));
    }
    return (Math.sqrt(diffSqredArr.reduce(function (firstEl, nextEl) {
        return firstEl + nextEl;
    }) / _ary.length));
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

var _output_filename_surffix = "_train_set";
var _output_filename_test_surffix = "_test_set";
var _output_filename_periodics_surffix = "_periodics_set";
var _output_filename_ext = ".arff";
var _output_filename_periodics_ext = ".periodics";


// -------------------------------------

var _load_file = function (evt) {
    //console.log(1);
    if (!window.FileReader)
        return; // Browser is not compatible

    var _panel = $(".file-process-framework");

    _panel.find(".loading").removeClass("hide");

    var reader = new FileReader();
    var _result;

    var _original_file_name = evt.target.files[0].name;
    var _pos = _original_file_name.indexOf(".");
    var _file_name = "train_set-" + _original_file_name.substr(0, _pos)
            //+ _output_filename_surffix
            //+ _original_file_name.substring(_pos, _original_file_name.length);
    _file_name = _file_name + _output_filename_ext;
    var _test_file_name = "test_set-" + _original_file_name.substr(0, _pos)
            //+ _output_filename_test_surffix
            //+ _original_file_name.substring(_pos, _original_file_name.length);
    _test_file_name = _test_file_name + _output_filename_ext;
    var _periodics_file_name = "periodics_set-" + _original_file_name.substr(0, _pos)
            //+ _output_filename_test_surffix
            //+ _original_file_name.substring(_pos, _original_file_name.length);
    _periodics_file_name = _periodics_file_name + _output_filename_periodics_ext;
    
    var _file_type = _original_file_name.substring(_original_file_name.lastIndexOf(".")+1, _original_file_name.length).toLowerCase();
    //console.log(_file_type);

    _panel.find(".filename").val(_file_name);
    _panel.find(".test_filename").val(_test_file_name);
    _panel.find(".periodics_filename").val(_periodics_file_name);
    
    reader.onload = function (evt) {
        if (evt.target.readyState !== 2)
            return;
        if (evt.target.error) {
            alert('Error while reading file');
            return;
        }

        //filecontent = evt.target.result;

        //document.forms['myform'].elements['text'].value = evt.target.result;
        _result = evt.target.result;
        
        if (_file_type !== "csv") {
            var workbook = XLSX.read(_result, {type: 'binary'});
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            var _worksheet_json = XLSX.utils.sheet_to_json(worksheet);
            //console.log(_worksheet_json);
            
            var _csv = [];
            
            var _attr_list = [];
            for (var _col in _worksheet_json) {
                for (var _row in _worksheet_json[_col]) {
                    _attr_list.push(_row);
                }
                break;
            }
            _csv.push(_attr_list.join(","));
            
            for (var _col in _worksheet_json) {
                var _line = [];
                for (var _row in _worksheet_json[_col]) {
                    var _cell = _worksheet_json[_col][_row];
                    _cell = _cell.replace(",", " ");
                    if (_cell.indexOf(",") > -1) {
                        console.log(_cell);
                    }
                    _cell = _cell.replace("\n", " ");
                    _line.push(_cell);
                }
                _csv.push(_line.join(","));
            }
            
            
            _csv = _csv.join("\n");
            //var _csv = XLSX.utils.sheet_to_csv(worksheet);
            //console.log(_csv);
            _result = _csv;
        }
        
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

    if (_file_type !== "csv") {
        reader.readAsBinaryString(evt.target.files[0]);
    }
    else {
        reader.readAsText(evt.target.files[0]);
    }
};

var _load_textarea = function (evt) {
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
    //var _file_date = local.toJSON().slice(0, 19).replace(/:/g, "-");
    var time = new Date();
    var _file_date = ("0" + time.getHours()).slice(-2)
            + ("0" + time.getMinutes()).slice(-2);
    var _file_name = "train_set-" + _file_date + _output_filename_ext;
    var _test_file_name = "test_set-" + _file_date + _output_filename_ext;

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

    _download_file(_data, _file_name, "arff");
};

var _download_test_file_button = function () {
    var _panel = $(".file-process-framework");

    var _file_name = _panel.find(".test_filename").val();
    var _data = _panel.find(".test_preview").val();

    _download_file(_data, _file_name, "arff");
};

var _download_periodics_file_button = function () {
    var _panel = $(".file-process-framework");

    var _file_name = _panel.find(".periodics_filename").val();
    var _data = _panel.find(".periodics_preview").val();

    _download_file(_data, _file_name, "periodics");
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
        setTimeout(function () {
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

    var _text = $("#preview").val().replace(/,/g, "\t");

    _copy_to_clipboard(_text);
};

var _copy_to_clipboard = function (_content) {
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
    _panel.find(".download-test-file").click(_download_test_file_button);
    _panel.find(".download-periodics-file").click(_download_periodics_file_button);

    $('.menu .item').tab();
    $("button.copy-table").click(_copy_table);
    $("button.copy-csv").click(_copy_csv_table);
    $("#decimal_places").change(_change_to_fixed);

    $("#show_fulldata").change(_change_show_fulldata);
    $("#show_std").change(_change_show_std);

    // 20170108 測試用
    //_load_textarea();
});