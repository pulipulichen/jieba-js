// <script data-main="scripts/main" src="scripts/require.js"></script>

var _JIEBA_CUT_QUEUE = [];

call_jieba_cut = function (_text, _callback) {
    if (typeof(_callback) !== "function") {
        return;
    }
    
    if (typeof(jieba_cut) !== 'function') {
        console.log("set queue");
        _JIEBA_CUT_QUEUE.push({
            text: _text,
            callback: _callback
        });
    }
    else {
        if (typeof(_callback) === 'function') {
            var _result = jieba_cut(_text);
            _callback(_result);
        }
    }
};

call_jieba_cut_join = function (_text, _join, _callback) {
    if (typeof(_callback) !== "function") {
        return;
    }
    
    call_jieba_cut(_text, function (_result) {
        _result = _result.join(_join);
        while (_result.indexOf("  ") > -1) {
            _result = _result.replace(/  /g, ' ');
        }
        if (typeof(_callback) === "function") {
            _callback(_result);
        }
    });
};

resume_jieba_cut = function () {
    for (var _i = 0; _i < _JIEBA_CUT_QUEUE.length; _i++) {
        var _text = _JIEBA_CUT_QUEUE[_i].text;
        var _callback = _JIEBA_CUT_QUEUE[_i].callback;
        call_jieba_cut(_text, _callback);
    }
};

// ------------------------------------------------------




// ------------------------------------------------------

_get_host = function () {
	
	var _endsWith = function(_str, searchString, position) {
		if (_str === undefined) {
			return false;
		}
		  var subjectString = _str.toString();
		  if (typeof position !== 'number' 
			|| !isFinite(position) 
			|| Math.floor(position) !== position 
			|| position > subjectString.length) {
			position = subjectString.length;
		  }
		  position -= searchString.length;
		  var lastIndex = subjectString.lastIndexOf(searchString, position);
		  return lastIndex !== -1 && lastIndex === position;
	  };
	
	var _host = "";
	var _scripts = $("script");
	for (var _i = 0; _i < _scripts.length; _i++) {
		var _src = _scripts.eq(_i).attr("src");
		if (_endsWith(_src, "/require-jieba-js.js")) {
			_host = _src.substr(0, _src.lastIndexOf("require-jieba-js.js"));
			break;
		}
	}
	return _host;
};

var _host = _get_host();

var s = document.createElement("script");
s.type = "text/javascript";
s.setAttribute("data-main", _host + "scripts/main");
s.src = _host + "scripts/require.js";
document.body.appendChild(s);