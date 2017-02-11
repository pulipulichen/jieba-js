// <script data-main="scripts/main" src="scripts/require.js"></script>

var _JIEBA_CUT_QUEUE = [];

call_jieba_cut = function (_text, _callback) {
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

resume_jieba_cut = function () {
    for (var _i = 0; _i < _JIEBA_CUT_QUEUE.length; _i++) {
        var _text = _JIEBA_CUT_QUEUE[_i].text;
        var _callback = _JIEBA_CUT_QUEUE[_i].callback;
        call_jieba_cut(_text, _callback);
    }
};

var s = document.createElement("script");
s.type = "text/javascript";
s.setAttribute("data-main", "scripts/main");
s.src = "scripts/require.js";
document.body.appendChild(s);