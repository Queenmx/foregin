/**
 * pay
 */
var Payment = function () { }
Payment.prototype = {
    // 初始化
    init: function () {
        var self = this;
        self.getinfo();
        // 截取最后四位
        $(".cardNum").html($(".cardNum").html().substr($(".cardNum").html().length - 4))
    },
    // 取值
    getinfo: function () {
        var getInfo = {
            url: '/public/login',
            data: {},
            success: function (res) {
                if (res.code == 1) {
                    util.toast('success!')
                }
            }
        }
        // util.sendRequest(getInfo);
    }
}
$(function () {
    new Payment().init();
    $(".submit").on('click', function () {
        window.location.href = "choseBankCard.html"
    })
})