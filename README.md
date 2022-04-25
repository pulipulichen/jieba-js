jieba-js
========

A JavaScript Chinese word segmentation tool based on Python Jieba

Online demo: https://pulipulichen.github.io/jieba-js/

# 使用方法

```html
<script src="https://pulipulichen.github.io/jieba-js/jquery.js"></script>
<script src="https://pulipulichen.github.io/jieba-js/require-jieba-js.js"></script>

<script>
_text = "這個布丁是在無聊的世界中找尋樂趣的一種不能吃的食物，喜愛動漫畫、遊戲、程式，以及跟世間脫節的生活步調。";
call_jieba_cut(_text, function (_result) {
	console.log(_result);
});
</script>
```

# 其他檔案

- 資料檔案 https://docs.google.com/spreadsheets/d/1mhUzD6xEpQG3wvfuF0ofoQhTajCPlpdJGMDNuCVzH2Y/edit?usp=sharing
- Spreadsheet to ARFF線上轉換: http://pulipulichen.github.io/jieba-js/weka/spreadsheet2arff/index.html
- ARFF result to CSV線上轉換: http://pulipulichen.github.io/jieba-js/weka/arff2csv/index.html
- http://pulipulichen.github.io/jieba-js/weka/simple-kmeans
- http://pulipulichen.github.io/jieba-js/weka/simple-kmeans/cascadeKMeans1.0.4.zip

# Reference

- Chinese stopwords https://github.com/stopwords-iso/stopwords-zh
- English stopwords https://github.com/stopwords-iso/stopwords-en

- ICON: https://www.iconninja.com/break-icon-689544

# Go Live SSL self-signed certificate

https://linuxize.com/post/creating-a-self-signed-ssl-certificate/

````
openssl req -newkey rsa:4096 \
            -x509 \
            -sha256 \
            -days 3650 \
            -nodes \
            -out example.crt \
            -keyout example.key
````