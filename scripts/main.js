
jieba_parsing = function(dictionary, _callback) {
    var trie = {}, // to be initialized
        FREQ = {},
        total = 0.0,
        min_freq = 0.0,
        initialized = false;

    var max_of_array = function(array){return Math.max.apply(Math, array)},
        min_of_array = function(array){return Math.min.apply(Math, array)};

    var gen_trie = function () {
        var lfreq = {},
            trie = {},
            ltotal = 0.0;

        for (var i = 0; i < dictionary.length; i++) {
            var entry = dictionary[i],
                word = entry[0],
                freq = entry[1];
            lfreq[word] = freq;
            ltotal += freq;
            p = trie;
            for (var ci = 0; ci < word.length; ci++) {
                var c = word[ci];
                if (!(c in p)) {
                    p[c] = {};
                }
                p = p[c];
            }
            p[''] = ''; // ending flag
        }

        return [trie, lfreq, ltotal];
    }

    var initialize = function() {
        if (initialized === true) {
            return;
        }
        if (trie) {
            trie = {};
        }
        //console.log("Building Trie...");

        var gar = gen_trie();
        trie = gar[0];
        FREQ = gar[1];
        total = gar[2];

        var min_freq = Infinity;
        // normalize:
        for (k in FREQ) {
            var v = FREQ[k];
            FREQ[k] = Math.log(v / total);
            if (FREQ[k] < min_freq) {
                min_freq = FREQ[k];
            }
        }
        initialized = true;

        //console.log("Trie built!", trie);
    }

    var get_DAG = function(sentence) {
        var N = sentence.length,
            i = 0,
            j = 0,
            p = trie,
            DAG = {};

        while (i < N) {
            var c = sentence[j];
            if (c in p) {
                p = p[c];
                if ('' in p) {
                    if (!(i in DAG)){
                        DAG[i] = [];
                    }
                    DAG[i].push(j);
                }
                j += 1;
                if (j >= N) {
                    i += 1;
                    j = i;
                    p = trie;
                }
            }
            else {
                p = trie;
                i += 1;
                j = i;
            }
        }
        for (i = 0; i < sentence.length; i++) {
            if (!(i in DAG)) {
                DAG[i] = [i];
            }
        }
        return DAG;
    }

    var calc = function( sentence, DAG, idx, route ) {
        var N = sentence.length;
        route[N] = [0.0, ''];
        for (idx = N - 1; idx > -1; idx--) {
            candidates = [];
            candidates_x = [];
            for (xi in DAG[idx]) {
                var x = DAG[idx][xi];
                var f = ((sentence.substring(idx, x+1) in FREQ) ? FREQ[sentence.substring(idx, x+1)] : min_freq);
                candidates.push(f + route[x+1][0]);
                candidates_x.push(x);
            }
            var m = max_of_array(candidates);
            //console.log('max is', m);
            route[idx] = [m, candidates_x[candidates.indexOf(m)]];
        }
    }

    var __cut_DAG = function(sentence) {
        // finalseg is still to be implemented,
        // so this is also unfinished. Use __cut_DAG_NO_HMM
        // for now

        var DAG = get_DAG(sentence);
        var route = {};
        var yieldValues = [];

        calc(sentence, DAG, 0, route);

        var x = 0,
            buf = '',
            N = sentence.length;

        while(x < N) {
            var y = route[x][1]+1,
                l_word = sentence.substring(x, y);
            if (y - x === 1) {
                buf += l_word;
            }
            else {
                if (buf.length > 0) {
                    if (buf.length === 1) {
                        yieldValues.push(buf);
                    }
                    else {
                        if (!(buf in FREQ)) {
                            var recognized = finalseg.cut(buf);
                            for (t in recognized) {
                                yieldValues.push(recognized[t]);
                            }
                        }
                        else {
                            for (elem in buf) {
                                yieldValues.push(buf[elem]);
                            }
                        }
                        buf = "";
                    }
                }
                yieldValues.push(l_word);
            }
            x = y;
        }


        if (buf.length > 0) {
            if (buf.length === 1) {
                yieldValues.push(buf);
            }
            else {
                if (!(buf in FREQ)) {
                    var recognized = finalseg.cut(buf);
                    for (t in recognized) {
                        yieldValues.push(recognized[t]);
                    }
                }
                else {
                    for (elem in buf) {
                        yieldValues.push(buf[elem]);
                    }
                }
            }
        }
        return yieldValues;
    }

    var __cut_DAG_NO_HMM = function (sentence) {
        var re_eng = /[a-zA-Z0-9]/,
            route = {},
            yieldValues = [];

        var DAG = get_DAG(sentence);
        //console.log("DAG", DAG);
        calc(sentence, DAG, 0, route);

        //console.log(route);

        var x = 0,
            buf = '',
            N = sentence.length;

        while (x < N) {
            y = route[x][1] + 1;
            l_word = sentence.substring(x, y);
            //console.log(l_word, l_word.match(re_eng))
            if (l_word.match(re_eng) && l_word.length === 1) {
                buf += l_word;
                x = y;
            }
            else {
                if (buf.length > 0) {
                    yieldValues.push(buf);
                    buf = '';
                }
                yieldValues.push(l_word);
                x = y;
            }
        }
        if (buf.length > 0) {
            yieldValues.push(buf);
            buf = '';
        }
        return yieldValues;
    }

    var cut = function(sentence){
        var cut_all = false,
            HMM = false,
            yieldValues = [];

        var re_han = /([\u4E00-\u9FA5a-zA-Z0-9+#&\._]+)/,
            re_skip = /(\r\n|\s)/;

        var blocks = sentence.split(re_han);
        var cut_block = HMM ? __cut_DAG : __cut_DAG_NO_HMM;

        for (b in blocks) {
            var blk = blocks[b];
            //console.log(b, blk);
            if (blk.length === 0) {
                continue;
            }

            if (blk.match(re_han)) {
                var cutted = cut_block(blk);
                //console.log("matches", cutted);
                for (w in cutted) {
                    var word = cutted[w];
                    yieldValues.push(word);
                }
            }
            else {
                var tmp = blk.split(re_skip);
                for (var i = 0; i < tmp.length; i++) {
                    var x = tmp[i];
                    if (x.match(re_skip)) {
                        yieldValues.push(x);
                    }
                    else if (!cut_all) {
                        for (xi in x) {
                            yieldValues.push(x[xi]);
                        }
                    }
                    else {
                        yieldValues.push(x);
                    }
                }
            }
        }
        return yieldValues;
    };
    
    jieba_cut = cut;

    // initialize when the file loads (no lazy-loading yet):
    initialize();

    //console.log(cut("我爸新学会了一项解决日常烦闷的活动，就是把以前的照片抱回办公室扫描保存，弄成电子版的。更无法接受的是，还居然放到网上来，时不时给我两张。这些积尘的化石居然突然重现，简直是招架不住。这个怀旧的阀门一旦打开，那就直到意识模糊都没停下来。"));
    
    //console.log(cut("我的中文東西。"));
    if (typeof(resume_jieba_cut) === "function") {
        resume_jieba_cut();
    }
    
    if (typeof(_callback) === "function") {
        _callback();
    }
};

node_jieba_parsing = function (_dicts, _text, _callback) {
    if (typeof(_callback) !== "function") {
        return;
    }
    
    if (typeof(jieba_cut) === "function") {
        var _result = jieba_cut(_text);
        //console.log(_result.join(" "));
        _callback(_result);
        return _result;
    }
    
    var _dict;
    if (_dicts.length > 0) {
        _dict = _dicts[0];
    }
    
    for (var _i = 1; _i < _dicts.length; _i++) {
        for (var _j = 0; _j < _dicts[_i].length; _j++) {
            _dict.push(_dicts[_i][_j]);
        }
    }
    
    jieba_parsing(_dict, function () {  
        var _result = jieba_cut(_text);
        //console.log(_result.join(" "));
        _callback(_result);
    });
};

var _host = undefined;
if (typeof(get_host) === "function") {
    _host = get_host();
    //console.log([1, _host, _host + "scripts/data/dictionary.js"]);
}

if (_host !== undefined) {
    require([ _host + "scripts/data/dictionary.js"], function (_dictionary) {
        if (typeof(JIEBA_CUSTOM_DICTIONARY) === "string") {
            require([ JIEBA_CUSTOM_DICTIONARY ], function (_custom_dictionary) {
                for (var _i = 0; _i < _custom_dictionary.length; _i++) {
                    _dictionary.push(_custom_dictionary[_i]);
                }
                jieba_parsing(_dictionary);
            });
        }
        else {
            jieba_parsing(_dictionary);
        }
    });
}
