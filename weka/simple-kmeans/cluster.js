/**
 * 繪製統計表格
 * @param {String} _result
 */
var _draw_stat_table = function (_result) {
        // ---------------------------
        // 讀取資料
        var _lines = _result.split("\n");
        
        // 繪製表格
        var _table = $(".stat-result");
        var _thead = _table.find("thead tr").empty();
        var _tbody = _table.find("tbody").empty();
        
        var _needle1 = "Instance_number";
        var _needle2 = "Cluster";
        if (_lines[0].substr(0, _needle1.length).toLowerCase() !== _needle1.toLowerCase()
                && _lines[0].substring((_lines[0].length - _needle2.length), _lines[0].length).toLowerCase() !== _needle2.toLowerCase()) {
                //console.log(["資料錯誤", _lines[0].substring((_lines[0].length - _needle2.length), _lines[0].length).toLowerCase() !== _needle2]);
                return;
        }
        
        var _attr_list = [];
        var _cluster_data = [];
        var _cluster_count = [];
        var _full_data = {};
        var _full_count = _lines.length - 1;
        
        var _to_fixed = $("#decimal_places").val();
        _to_fixed = parseInt(_to_fixed, 10);
        
        for (var _i = 0; _i < _lines.length; _i++) {
                var _fields = _lines[_i].split(",");
                if (_i === 0) {
                        // 讀取屬性名稱
                        _attr_list = _fields;
                }
                else {
                        // 讀取資料
                        
                        // 要先知道是那個cluster
                        // cluster4
                        var _cluster = _fields[(_fields.length-1)];
                        _cluster = _cluster.substring(7, _cluster.length);
                        _cluster = parseInt(_cluster, 10);
                        
                        if (typeof(_cluster_data[_cluster]) === "undefined") {
                                _cluster_data[_cluster] = {};
                        }
                        if (typeof(_cluster_count[_cluster]) === "undefined") {
                                _cluster_count[_cluster] = 0;
                        }
                        _cluster_count[_cluster]++;
                        
                        for (var _f = 0; _f < _fields.length - 1; _f++) {
                                var _value = _fields[_f].trim();
                                var _attr = _attr_list[_f];
                                
                                if (_attr === "Instance_number") {
                                    continue;
                                }
                                
                                // 判斷是否是數值
                                if (isNaN(_value) === false) {
                                        // 如果是數值
                                        _value = parseFloat(_value, 10);
                                        
                                        if (typeof(_full_data[_attr]) === "undefined") {
                                                _full_data[_attr] = [];
                                        }
                                        _full_data[_attr].push(_value);
                                        
                                        // --------------
                                        
                                        if (typeof(_cluster_data[_cluster][_attr]) === "undefined") {
                                                _cluster_data[_cluster][_attr] = [];
                                        }
                                        _cluster_data[_cluster][_attr].push(_value);
                                }
                                else {
                                        // 如果不是表格
                                        var _cat = _value;
                                        
                                        if (typeof(_full_data[_attr]) === "undefined") {
                                                _full_data[_attr] = {};
                                        }
                                        if (typeof(_cluster_data[_cluster][_attr]) === "undefined") {
                                                _cluster_data[_cluster][_attr] = {};
                                        }
                                
                                        if (typeof(_full_data[_attr][_cat]) === "number" ) {
                                                _full_data[_attr][_cat] = _full_data[_attr][_cat] + 1;
                                        }
                                        else {
                                                _full_data[_attr][_cat] = 1;
                                        }
                                        
                                        if (typeof(_cluster_data[_cluster][_attr][_cat]) === "number" ) {
                                                _cluster_data[_cluster][_attr][_cat] = _cluster_data[_cluster][_attr][_cat] + 1;
                                        }
                                        else {
                                                _cluster_data[_cluster][_attr][_cat] = 1;
                                        }
                                }
                        }
                }
        }
        
        //console.log(_full_data);
        
                
        // -------------------------
        // 先畫開頭
        _thead.append('<th>' +    DICT['Attributes'] + '</th>');
        _thead.append('<th class="fulldata">' + DICT['Full Data and Avg.'] + '</th>');
        for (var _i = 0; _i < _cluster_data.length; _i++) {
                if (typeof(_cluster_count[_i]) === "undefined") {
                        continue;
                }
                _thead.append('<th>' + DICT['Cluster 1'] + _i + DICT['Cluster 2'] + '</th>');
        }
        //_thead.append('<th>' +    DICT['SSE_TH'] + '</th>');
        
        // -------------------------
        // 再畫數量
        
        
        var _count_avg = _float_to_fixed( (_full_count/ (_cluster_count.length - 1)) , _to_fixed);
        
        var _count_tr = $('<tr class="compare-data"></tr>').appendTo(_tbody);
        _count_tr.append('<th>' + DICT['Count'] + '</th>');
        _count_tr.append('<td title="Full Data, count" class="fulldata count">' 
            + _full_count + '<br />(平均: ' + _count_avg + ')'
            + '</td>');
                
        var _row_data = _cluster_count;
        for (var _i = 0; _i < _cluster_count.length; _i++) {
            if (typeof(_cluster_count[_i]) === "undefined") {
                continue;
            }
            var _classname = "normal";
            if ( _cluster_count[_i] > (_full_count/ (_cluster_count.length - 1)) ) {
                _classname = "large";
            }
            else if ( _cluster_count[_i] < (_full_count/ (_cluster_count.length - 1)) ) {
                // 如果小於，則表示小於
                _classname = "small";
            }
            _count_tr.append('<td class="marks count ' + _classname + '" title="Cluster ' + _i + ', count" data-ori-value="' + _cluster_count[_i] + '">' 
                    + _cluster_count[_i] + '</td>');
        }
        //_count_tr.append('<td></td>');
        
        // ---------------------------
        
        if (_row_data.length > 1 && arrayMin(_row_data) !== arrayMax(_row_data)) {
            console.log([arrayMin(_row_data), arrayMax(_row_data)]);
            // 如果有最大值跟最小值的差別，才作這樣的標示
            
            // 表示最小值
            _count_tr.find('td[data-ori-value="' + arrayMin(_row_data) + '"]').addClass("smallest");

            // 表示最小值
            _count_tr.find('td[data-ori-value="' + arrayMax(_row_data) + '"]').addClass("largest");
        }
                
        
        // ------------------------
        // 再畫屬性
        
        var _start = 0;
        //console.log(_attr_list[0]);
        if (_attr_list[0] === "Instance_number") {
            _start = 1;
        }
        
        for (var _a = _start; _a < _attr_list.length - 1; _a++) {
                var _attr = _attr_list[_a];
                
                if (typeof(_full_data[_attr]) === "undefined") {
                    continue;
                }        
                
                var _avg_tr = $('<tr class="avg-tr compare-data"></tr>');
                var _stddev_tr = $('<tr class="std-tr"></tr>');
                
                //_avg_tr.append('<td>' + _attr + ':<br /> Avg. (Std.) </td>');
                
                var _full_data_attr = _full_data[_attr];
                
                var _title_prefix = 'Full Data, ' + _attr + ' ';
                if (_is_array(_full_data_attr)) {
                        
                        _avg_tr.append('<th>' + _attr + ' (Avg.) </th>');
                        _stddev_tr.append('<th>' + _attr + ' (Std.) </th>');
                        
                        var _full_avg = _stat_avg(_full_data_attr);
                        var _full_stddev = _stat_stddev(_full_data_attr);
                        _avg_tr.append('<td class="fulldata avg" title="' + _title_prefix + ' Avg." data-ori-value="' + _full_avg + '">' 
                                + _float_to_fixed(_full_avg, _to_fixed) + '</td>');
                        _stddev_tr.append('<td class="fulldata std" title="' + _title_prefix + ' Std." data-ori-value="' + _full_stddev + '">' 
                                + _float_to_fixed(_full_stddev, _to_fixed) + '</td>');
                }
                else {
                        _avg_tr.append('<th>' + _attr + ' (Freq.) </th>');
                        
                        //console.log("full data不是陣列: " + _attr);
                        //console.log(_full_data_attr);
                        //console.log(_calc_mode(_full_data_attr));
                        var _freq_data = _calc_mode(_full_data_attr);
                        _avg_tr.append('<td class="fulldata freq" title="' + _title_prefix + ' Freq." data-ori-value="' + _freq_data.full    + '"><div>' 
                                + _freq_data.full + '</div></td>');
                }
                
                
                var _row_data = [];
                
                for (var _i = 0; _i < _cluster_count.length; _i++) {
                        if (typeof(_cluster_data[_i]) === "undefined") {
                                continue;
                        }
                        var _attr_data = _cluster_data[_i][_attr];
                        
                        if (_is_array(_attr_data)) {
                                // 是數值
                                var _avg = _stat_avg(_attr_data);
                                _row_data.push(_avg);
                                var _stddev = _stat_stddev(_attr_data);

                                var _classname = "normal";

                                if ( _avg > _full_avg ) {
                                        _classname = "large";
                                        if ( (_avg-_stat_avg) > _full_avg ) {
                                                _classname = "x-large";
                                        }
                                        if ( (_avg-_stat_avg) > (_full_avg + _full_stddev) ) {
                                                _classname = "xx-large";
                                        }
                                }
                                if ( _avg < _full_avg ) {
                                        _classname = "small";
                                        if ( (_avg+_stat_avg) < _full_avg ) {
                                                _classname = "x-small";
                                        }
                                        if ( (_avg+_stat_avg) < (_full_avg - _full_stddev) ) {
                                                _classname = "xx-small";
                                        }
                                }

                                var _title_prefix = 'Cluster ' + _i + ', ' + _attr + ' ';

                                _avg_tr.append('<td class="mark avg ' + _classname + '" title="' + _title_prefix + ' Avg." data-ori-value="' + _avg + '">' 
                                        + _float_to_fixed(_avg, _to_fixed) 
                                        + '</td>');
                                _stddev_tr.append('<td class="std" title="' + _title_prefix + ' Std." data-ori-value="' + _stddev + '">' 
                                        + _float_to_fixed(_stddev, _to_fixed) 
                                        + '</td>');
                        }
                        else {
                                // 不是數值
                                
                                //console.log("cluster data不是陣列: " + _i + " - " + _attr);
                                //console.log(_attr_data);
                                var _freq_data = _calc_mode(_attr_data);
                                _avg_tr.append('<td class="mark freq ' + _classname + '" title="' + _title_prefix + ' Freq." data-ori-value="' + _freq_data.full    + '"><div>' 
                                        + _freq_data.full
                                        + '</div></td>');
                        }
                }
                
                // 分群品質算法
                //_avg_tr.append('<td class="checkbox sse">'
                //                + '<input type="checkbox" class="sse" name="sse" value="' + _attr + '" checked="checked" />'
                //                + '</td>');
                //_stddev_tr.append('<td class="sse"></td>');
                //_avg_tr.find("input.sse").change(_calc_cluster_score);
                
                if (_row_data.length > 0  && arrayMin(_row_data) !== arrayMax(_row_data)) {
                    _avg_tr.find('td[data-ori-value="' + arrayMin(_row_data) + '"]').addClass("smallest");
                    _avg_tr.find('td[data-ori-value="' + arrayMax(_row_data) + '"]').addClass("largest");
                }
                
                _avg_tr.appendTo(_tbody);
                if (_is_array(_full_data_attr)) {
                        _stddev_tr.appendTo(_tbody);
                }
        }
        
        _change_show_fulldata();
        _change_show_std();
        
        // ---------------------
        
        _draw_stat_abs_table();
        
        FULL_DATA = _full_data;
        CLUSTER_DATA = _cluster_data;
        TO_FIXED = _to_fixed;
        //_calc_cluster_score();
};