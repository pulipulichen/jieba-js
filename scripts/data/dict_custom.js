_custom_dict = [
	["漫畫", 99999999, "n"],
];

if (typeof(document) === "object") {
    define(function (require) {
        return _custom_dict;
    });
}
else {
    module.exports = _custom_dict;
}