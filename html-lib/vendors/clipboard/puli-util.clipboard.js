$(function () {
    $('[copy-from]').click(function () {
        var _selector = $(this).attr("copy-from");
        var _value = $(_selector).val();
        var _textarea = $('<textarea style="position:fixed;left: -100%"></textarea>').val(_value).appendTo($("body"));
        _textarea.select();
        document.execCommand("Copy");
        _textarea.remove();
    });
});