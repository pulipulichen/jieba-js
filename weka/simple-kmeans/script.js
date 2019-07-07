var DICT = {
        'Attributes': '變項',
        'Full Data and Avg.': '全部資料',
        'Cluster 1': '第',
        'Cluster 2': '群',
        'Larger than Avg.': '大於全部資料均值',
        'Smaller than Avg.': '小於全部資料均值',
        'Cluster': '分群',
        'Count': '筆數',
        'SSE_TH': '計算分群品質'
};

var _process_file = function(_input, _callback) {

    //------------------
    
    _input = _input.replace(/'\\'/g, "");
    _input = _input.replace(/\\''/g, "");
    //_input = _input.replace(new RegExp("\''", 'g'), "");
    //console.log(_input);
    //_input = _input.replace("\\''", "");

    var _needle = "\n@data\n";
    var _pos =    _input.indexOf(_needle);
    if (_pos === -1) {
      _pos = _input.indexOf("@data") - 1;
    }
    //console.log(_pos);
    var _result;
    var _arff_mode = true;
    if (_pos > -1) {
        _result = _input.substring(_pos + _needle.length, _input.length).trim();
    }
    else {
        _arff_mode = false;
        _result = _input.substring(_input.indexOf("\n")+1, _input.length).trim();
    }
    
    // -----------------
    var _attr_list = [];
    var _attr_values = [];
    if (_arff_mode === true) {
        var _attr_input = _input.substr(0, _pos);
        var _lines = _attr_input.split("\n");
        var _attr_needle = "@attribute ";
        for (var _i = 0; _i < _lines.length; _i++) {
            var _line = _lines[_i];
            if (_line.indexOf(_attr_needle) === 0) {
                    var _fields = _line.split(" ");
                    var _attr = _fields[1];
                    _attr_list.push(_attr);
                    var _values = _fields[2].slice(1, -1).split(',')
                    _attr_values.push(_values)
            }
        }
        //console.log(_attr_list);
        
        if (_result.startsWith('{') && _result.endsWith('}')) {
          //console.log('aaa')
          let output = []
          _result.split('\n').forEach(line => {
            let fields = new Array(_attr_list.length)
            
            line.trim().slice(1, -1).split(',').forEach(field => {
              let pos = field.indexOf(' ')
              let i = field.slice(0, pos)
              i = parseInt(i, 10)
              let value = field.slice(pos+1)
              fields[i] = value
            })
            
            for (let i = 0; i < _attr_list.length; i++) {
              if (typeof(fields[i]) === 'undefined') {
                fields[i] = _attr_values[i][0]
              }
            }
            output.push(fields.join(','))
          })
          _result = output.join('\n')
        }
    }
    else {
        var _attr_line = _input.substr(0, _input.indexOf("\n")).trim();
        _attr_list = _attr_line.split(",");
    }
    _result = _attr_list.join(",") + "\n" + _result;
    _draw_stat_table(_result);
        
    if (typeof(_callback) === "function") {
        _callback(_result);
    }
                
};


// ----------------------------

var _is_array = function (_obj) {
        return (typeof(_obj) === "object" 
                        && Object.prototype.toString.call( _obj ) === '[object Array]');
};

// ----------------------------


var FULL_DATA;
var CLUSTER_DATA;
var TO_FIXED;

// ---------------------

var _draw_stat_abs_table = function () {
        var _stat_table = $(".stat-result");
        var _abs_table = $(".stat-result-abstract");
        
        var _thead_tr = _stat_table.find("thead tr").clone();
        _thead_tr.find("th:first").html(DICT["Cluster"]);
        _thead_tr.find("th:eq(1)").remove();
        //_thead_tr.find("th:last").remove();
        _abs_table.find("thead").empty().append(_thead_tr);
        
        
        // -------------------
        var _good = [];
        var _bad = [];
        
        // -------------------
        var _avg_tr_list = _stat_table.find("tbody tr.compare-data");
        for (var _r = 0; _r < _avg_tr_list.length; _r++) {
                var _attr = _avg_tr_list.eq(_r).find("th:first").text();
                if (_attr.indexOf("(Avg.)") > -1) {
                    _attr = _attr.substr(0, _attr.length-7).trim();
                }
                var _td_list = _avg_tr_list.eq(_r).find("td:not(.sse):not(.freq-list)");
                for (var _d = 1; _d < _td_list.length; _d++) {
                        var _cluster = _d-1;
                        
                        var _avg = _avg_tr_list.eq(_r).find(`td:eq(${_d})`).text();
                        eval('_avg = ' + _avg)
                        
                        if (typeof(_good[_cluster]) === "undefined") {
                            _good[_cluster] = [];
                        }
                        if (typeof(_bad[_cluster]) === "undefined") {
                            _bad[_cluster] = [];
                        }
                        
                        var _set_attr = _attr;
                        var _td = _td_list.eq(_d);
                        if (_td.hasClass("freq")) {
                                continue;
                        }
                        
                        if (_td.hasClass("smallest") || _td.hasClass("largest")) {
                            _set_attr = _set_attr + "*";
                        }
                        if (_td.hasClass("smallest")) {
                            _set_attr = '<span class="smallest">' + _set_attr + '</span>';
                        }
                        if (_td.hasClass("largest")) {
                            _set_attr = '<span class="largest">' + _set_attr + '</span>';
                        }
                        
                        _set_attr = `<span data-avg="${_avg}">${_set_attr}</span>`
                        
                        if (_td.hasClass("small") || _td.hasClass("x-small") || _td.hasClass("xx-small")) {
                            _bad[_cluster].push(_set_attr);
                        }
                        if (_td.hasClass("large") || _td.hasClass("x-large") || _td.hasClass("xx-large")) {
                            _good[_cluster].push(_set_attr);
                        }
                }
        }
        
        // ----------------------------------------
        
        var _good_tr = _abs_table.find("tr.good").empty();
        _good_tr.append("<th>" + DICT["Larger than Avg."] + "</th>");
        for (var _i = 0; _i < _good.length; _i++) {
                var _value = _good[_i].join("<br />");
                _good_tr.append('<td><div>' + _value + '</div></td>');
        }
        
        var _bad_tr = _abs_table.find("tr.bad").empty();
        _bad_tr.append("<th>" + DICT["Smaller than Avg."] + "</th>");
        for (var _i = 0; _i < _bad.length; _i++) {
                var _value = _bad[_i].join("<br />");
                _bad_tr.append('<td><div>' + _value + '</div></td>');
        }
        
        //setTimeout(() => {
          _abs_table.find('thead tr th:not(:first)').each((_i, th) => {
            //console.log($('table.stat-result:first tr.compare-data:first td:eq(' + (_i+1) + ')').length)
            let count = $('table.stat-result:first tr.compare-data:first td:eq(' + (_i+1) + ')').text()
            let button = $('<button type="button" onclick="TagCloud.donwload(this, ' + (_i+1) + ', ' + count + ')">下載</button>').appendTo($(th))
          })
        //}, 1000)
};

// ---------------------

var _calc_cluster_score = function () {
        // https://www.quora.com/How-can-we-choose-a-good-K-for-K-means-clustering
        var _full_data = FULL_DATA;
        var _cluster_data = CLUSTER_DATA;
        var _to_fixed = TO_FIXED;
        
        var _attr_sse = 0;
        for (var _attr in _full_data) {
                if ($('[name="sse"][value="' + _attr + '"]:checked').length === 0) {
                        continue;
                }
                
                var _full_data_attr = _full_data[_attr];
                
                //console.log(_full_data_attr);
                var _cluster_data_attr = [];
                for (var _i = 0; _i < _cluster_data.length; _i++) {
                        _cluster_data_attr[_i] = _cluster_data[_i][_attr];
                }
                
                if (_is_array(_full_data_attr) === true) {
                        // 如果是數字
                        //console.log(_cluster_data_attr);
                        _attr_sse = _attr_sse + _calc_cluster_score_numeric(_full_data_attr, _cluster_data_attr);
                }
                else {
                        // 如果是類別
                        //console.log(_attr);
                        _attr_sse = _attr_sse + _calc_cluster_score_nominal(_full_data_attr, _cluster_data_attr);
                        // 2.322701673495139
                }
        }
        
        var _result = _attr_sse;
        $("#cluster_score")
                        .attr("data-ori-value", _result)
                        .html(_result);
};

var _calc_cluster_score_numeric = function (_full_data_attr, _cluster_data_attr) {
        var _max = arrayMax(_full_data_attr);
        var _min = arrayMin(_full_data_attr);
        
        var _sse = 0;
        for (var _i = 0; _i < _cluster_data_attr.length; _i++) {
                var _center = _stat_avg(_cluster_data_attr[_i]);
                _center = _normalize_numeric_data(_center, _max, _min);
                //console.log(_center);
                for (var _j = 0; _j < _cluster_data_attr[_i].length; _j++) {
                        var _data = _cluster_data_attr[_i][_j];
                        _data = _normalize_numeric_data(_data, _max, _min);
                        _sse = _sse + (_center - _data)*(_center - _data);
                }
        }
        
        return _sse;
};

var _calc_cluster_score_nominal = function (_full_data_attr, _cluster_data) {
        var _total_sse = 0;
        
        // A: 5
        // B: 2
        // C: 1
        // Total: 8
        // A: 1 1 1 1 1 0 0 0    avg: 5/8
        // B: 0 0 0 0 0 1 1 0    avg; 2/8
        // C: 0 0 0 0 0 0 0 1    avg; 1/8
        for (var _i = 0; _i < _cluster_data.length; _i++) {
                var _cluster_data_attr = _cluster_data[_i];
                
                var _total_count = 0;
                for (var _cate in _cluster_data_attr) {
                        var _count = _cluster_data_attr[_cate];
                        _total_count = _total_count + _count;
                }
                //console.log(_total_count);
                for (var _cate in _cluster_data_attr) {
                        var _count = _cluster_data_attr[_cate];
                        var _avg = _count / _total_count;
                        var _sse = (1-_avg)*(1-_avg)*_count 
                                        + _avg*_avg*(_total_count-_count);
                        //_sse = _sse / _total_count;
                        //console.log([_i, _cate, _total_count, _count]);
                        //console.log([_avg, _sse]);
                        _total_sse = _total_sse + _sse;
                }
        }
        return _total_sse;
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

var _normalize_numeric_data = function (_number, _max, _min) {
        return (_number - _min)/(_max - _min);
};

// -------------------------------------

var _change_to_fixed = function () {
        var _to_fixed = $("#decimal_places").val();
        _to_fixed = parseInt(_to_fixed, 10);
        
        var _tds = $("*[data-ori-value]");
        for (var _i = 0; _i < _tds.length; _i++) {
                var _td = _tds.eq(_i);
                var _value = _td.data("ori-value");
                _value = parseFloat(_value, 10);
                _value = _float_to_fixed(_value, _to_fixed);
                _td.text(_value);
        }
};

var _change_sse = function () {
        _calc_cluster_score();
};

// -------------------------------------

var _output_filename_surffix="_output";
var _output_filename_ext=".csv";

// -------------------------------------

let setPreviewCluster = function (result) {
  console.log(result)
  let header = result.slice(0, result.indexOf('\n')).split(',')
  let clusterFieldIndex
  for (let i = 0; i < header.length; i++) {
    if (header[i] === 'cluster') {
      clusterFieldIndex = i
      break
    }
  }
  
  if (clusterFieldIndex === undefined) {
    return
  }
  
  let clusterResult = ['cluster']
  result.slice(result.indexOf('\n')+1).split('\n').forEach(line => {
    let fields = line.split(',')
    let cluster = fields[clusterFieldIndex]
    if ((cluster.startsWith('"') && cluster.endsWith('"')) 
            || (cluster.startsWith("'") && cluster.endsWith("'"))) {
      cluster = cluster.slice(1, -1)
    }
  
    clusterResult.push(cluster)
    
  })
  
  $('#previewCluster').val(clusterResult.join('\n'))
  console.log(clusterResult.join('\n'))
}

var _load_file = function(evt) {
        //console.log(1);
        if(!window.FileReader) return; // Browser is not compatible

        var _panel = $(".file-process-framework");
        
        _panel.find(".loading").removeClass("hide");

        var reader = new FileReader();
        var _result;

        var _file_name = evt.target.files[0].name;
        var _pos = _file_name.lastIndexOf(".");
        _file_name = _file_name.substr(0, _pos)
                + _output_filename_surffix
                + _file_name.substring(_pos, _file_name.length);
        _file_name = _file_name + _output_filename_ext;
        
        reader.onload = function(evt) {
                if(evt.target.readyState !== 2) return;
                if(evt.target.error) {
                        alert('Error while reading file');
                        return;
                }

                //filecontent = evt.target.result;

                //document.forms['myform'].elements['text'].value = evt.target.result;
                _result =    evt.target.result;

                _process_file(_result, function (_result) {
                        _panel.find(".preview").val(_result);
                        
                        setPreviewCluster(_result)
                        
                        _panel.find(".filename").val(_file_name);
                                                
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
        var _file_name = local.toJSON().slice(0,19).replace(/:/g, "-");
        _file_name = "output_" + _file_name + ".csv";

        // ---------------------------

        _process_file(_result, function (_result) {
                _panel.find(".preview").val(_result);
                setPreviewCluster(_result)
                _panel.find(".filename").val(_file_name);

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
        if (_file_name.endsWith('.csv') === false) {
          _file_name = _file_name + '.csv'
        }
        _download_file(_data, _file_name, "csv");
};

var _download_cluster_file_button = function () {
        var _panel = $(".file-process-framework");
        
        var _file_name = _panel.find(".filename").val()
        if (_file_name.endsWith('.csv')) {
          _file_name = _file_name.slice(0, -4) + '-cluster.csv'
        }
        else {
          _file_name = _file_name + '-cluster.csv'
        }
        
        var _data = _panel.find(".preview-cluster").val();
        
        _download_file(_data, _file_name, "csv");
};

// ------------------------

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

};

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

var _calc_mode = function (_json) {
        var _array_json = [];
        
        var _sum = 0;
        for (var _key in _json) {
                _array_json.push({
                        "key": _key,
                        "value": _json[_key]
                });
                _sum = _sum + _json[_key];
        }
        
        _array_json = _array_json.sort(function (_a, _b) {
                return (_b.value - _a.value);
        });
        
        //console.log(_array_json);
        var _top_result = [];
        var _full_result = [];
        for (var _i = 0; _i < _array_json.length; _i++) {
                var _value = parseInt(_array_json[_i].value / _sum * 100, 10) + "%";
                var _data = "<tr><td class='freq-list'>" + _array_json[_i].key + "</td><td class='freq-list'>" + _value + "</td></tr>";
                if (_i < 5) {
                        _top_result.push(_data);
                }
                _full_result.push(_data);
        }
        if (_array_json.length > 5) {
                _top_result.push("...");
        }
        
        var _full = "<table><tbody>" + _full_result.join('') + "</tbody></table>";
        
        var _result = {
                top: _top_result.join("<br />\n"),
                full: _full
        };
        
        return _result;
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
    _panel.find(".input-mode.textarea").click(_load_textarea).keyup(_load_textarea);
    _panel.find(".myfile").change(_load_file);
    _panel.find(".download-file").click(_download_file_button);
    _panel.find(".download-cluster-file").click(_download_cluster_file_button);
    
    $('.menu .item').tab();
    $("button.copy-table").click(_copy_table);
    $("button.copy-csv").click(_copy_csv_table);
    $("#decimal_places").change(_change_to_fixed);
    
    $("#show_fulldata").change(_change_show_fulldata);
    $("#show_std").change(_change_show_std);
    
    // 20170108 測試用
    $.get("data.csv", function (_data) {
    //$.get("data-text-mining.csv", function (_data) {
            $("#input_mode_textarea").val(_data);
            $("#input_mode_textarea").keyup();
    });
    
});