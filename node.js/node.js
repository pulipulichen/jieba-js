require('../scripts/main.js');
 
_text = "這個布丁是在無聊的世界中找尋樂趣的一種不能吃的食物，喜愛動漫畫、遊戲、程式，以及跟世間脫節的生活步調。";

dict1 = require('../scripts/data/dictionary.js');
dict2 = require('../scripts/data/dict_custom.js');

node_jieba_parsing([dict1, dict2], _text, function (_result) {
    console.log(_result.join(" "));
});