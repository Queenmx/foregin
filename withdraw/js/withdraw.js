var withdraw = function () { }
withdraw.prototype = {}
$(function () {
    // new withdraw().init();
    // 截取最后四位
    var cardNum = $(".cardNum").html();
    if (cardNum) {
        $(".cardNum").html(cardNum.substr(cardNum.length - 4))
    }
})