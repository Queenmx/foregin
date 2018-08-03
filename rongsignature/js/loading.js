$(function () {
    var loading = {
        url: 'rong360/prePay?' + 'orderNumer=' + util.getUrlparam('orderNumer') + '&tradeNo=' + util.getUrlparam('tradeNo'),
        success: function (res) {
            if (res.code == 200) {
                $("body").append(res.data);
            } else {
                util.toast(res.msg)
            }
        }
    }
    util.sendRequest(loading);
})