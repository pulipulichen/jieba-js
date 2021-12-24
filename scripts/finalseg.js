require(["finalseg/prob_emit", "finalseg/prob_start", "finalseg/prob_trans"], function(prob_emit, prob_trans, prob_emit) {


}

 define(function (require) {
        var re_han = /([\u4E00-\u9FA5a-zA-Z0-9+#&\._]+)/,
            re_skip = /(\r\n|\s)/;

def viterbi(obs, states, start_p, trans_p, emit_p):
    V = [{}] #tabular
    path = {}
    for y in states: #init
        V[0][y] = start_p[y] + emit_p[y].get(obs[0],MIN_FLOAT)
        path[y] = [y]
    for t in range(1,len(obs)):
        V.append({})
        newpath = {}
        for y in states:
            em_p = emit_p[y].get(obs[t],MIN_FLOAT)
            (prob,state ) = max([(V[t-1][y0] + trans_p[y0].get(y,MIN_FLOAT) + em_p ,y0) for y0 in PrevStatus[y] ])
            V[t][y] =prob
            newpath[y] = path[state] + [y]
        path = newpath

    (prob, state) = max([(V[len(obs) - 1][y], y) for y in ('E','S')])

    return (prob, path[state])


def __cut(sentence):
    global emit_P
    prob, pos_list =  viterbi(sentence,('B','M','E','S'), start_P, trans_P, emit_P)
    begin, next = 0,0
    #print pos_list, sentence
    for i,char in enumerate(sentence):
        pos = pos_list[i]
        if pos=='B':
            begin = i
        elif pos=='E':
            yield sentence[begin:i+1]
            next = i+1
        elif pos=='S':
            yield char
            next = i+1
    if next<len(sentence):
        yield sentence[next:]

    var __cut = function(sentence) {
        var v = viterbi(sentence,('B','M','E','S'), start_P, trans_P, emit_P);

    }

    return {
        cut: function(sentence) {
            var yieldValues = [];
            var blocks = sentence.split(re_han);
            for (blk in blocks) {
                if (blk.match(re_han)) {
                    for (word in __cut(blk)) {
                        yieldValues.push(word);
                    }
                }
                else {
                    var tmp = blk.split(re_skip);
                    for (x in tmp) {
                        if (x != "") {
                            yieldValues.push(x);
                        }
                    }
                }
            }
            return yieldValues;
        }
    };
});