/**
 * purchased
 */
var Payment = function () {
    this.timestamp = new Date().getTime();
    if (util.getUrlparam('return_url')) {
        this.url = util.getUrlparam('return_url')
        this.url = new Base64().decode(this.url)
        console.log(this.url)
    } else {
        console.log("我没有拿到回调地址")
    }
    this.is_mermber_free = 0;
    this.complete_time = '';
    this.orderInfo = {
        identify: util.getUrlparam('order_sn'),
        url: this.url,
        user_name: util.getUrlparam('user_name'),
        id_card: util.getUrlparam('user_idcard'),
        user_phone: util.getUrlparam('user_phone')
    }
    this.price = util.getUrlparam('price');
    //localInfo = localStorage.getItem("orderInfo");
    localStorage.setItem("orderInfo", JSON.stringify(this.orderInfo))
    console.log(JSON.parse(localStorage.getItem("orderInfo")));
    this.commodityId = "";
    this.addressId = ""
    this.price1 = 0
    this.price2 = 0
    this.backUrl = 'https://mstar.istarcredit.com/pay/purchased.html?order_sn=' + util.getUrlparam('order_sn') + '&user_name=' + util.getUrlparam('user_name') + '&user_idcard=' + util.getUrlparam('user_idcard') + '&user_phone=' + util.getUrlparam('user_phone') + '&return_url=' + util.getUrlparam('return_url')
}
Payment.prototype = {
    // 初始化
    init: function () {
        var self = this;
        self.getinfo();
        self.confirmBtn();
    },
    // 取值
    getinfo: function () {
        var self = this;
        var getInfo = {
            url: 'h5/buyProduct/baseInfo',
            data: {
                identify: self.orderInfo.identify
            },
            success: function (res) {
                $("#loading").css("display", "none")
                var info = res.data.info
                console.log(info);
                if (res.code === "0") {
                    $(".main-money b").html(res.data.contractPrice.toFixed(2));
                    if (!info) {
                        $(".no-pro,#mask").css('display', "block");
                        $(".no-address").css('display', "block");
                        $("#confirm").off("click")
                        self.commodityId = "0"
                        self.addressId = "0"
                    } else {
                        info.commodityId ? self.commodityId = info.commodityId : self.commodityId = "0"
                        info.addressId ? self.addressId = (info.addressId).toString() : self.addressId = "0"
                        //$("#mask").css('display', "none");
                        if (!info.commodityName) {
                            $(".no-pro").css('display', "block");
                            $("#confirm").off("click")
                        } else {
                            $(".have-pro").css('display', "block");
                            // 商品信息
                            $(".commodityImg").attr('src', info.commodityImg);
                            $(".commodityName").html(info.commodityName)
                            $(".pro-size").html(info.specifications)
                            $(".price").html(info.commodityAmount.toFixed(2))
                            $(".postage").html(info.distributionCost)
                            self.price1 = info.commodityAmount
                            self.price2 = info.distributionCost
                        }
                        if (!info.consignee) {
                            $(".no-address").css('display', "block");
                            $("#confirm").off("click")
                        } else {
                            $(".have-ads").css('display', 'block')
                            // 收货地址
                            $(".username").html(info.consignee)
                            $(".phone").html(info.consigneePhone)
                            $(".address").html(info.receivingAddress)
                        }
                        if (info.commodityName && info.consignee) {
                            $(".page-button").removeClass("confirmdisable")
                            $("#confirm").on("click")
                        }
                    }
                } else {
                    util.toast(res.msg)
                }
                self.bindEvent();
            }
        }
        util.sendRequest(getInfo);
    },
    bindEvent: function () {
        var self = this;
        $(".pro-event").on('click', function () {
            var data = {
                identify: self.orderInfo.identify,
                commodityId: self.commodityId,
                backUrl: self.backUrl
            }
            self.loadUrl(data, 'h5/buyProduct/getProUrl')
        })
        $(".address-event").on('click', function () {
            var data = {
                identify: self.orderInfo.identify,
                addressId: self.addressId,
                backUrl: self.backUrl
            }
            self.loadUrl(data, 'h5/buyProduct/getAddUrl')
        })
    },
    loadUrl: function (data, url) {
        console.log(data)
        var loadUrl = {
            url: url,
            data: data,
            success: function (res) {
                console.log(res)
                if (res.code === "0") {
                    window.location.href = JSON.parse(res.data.info).url
                } else {
                    util.toast(res.msg)
                }
            }
        }
        util.sendRequest(loadUrl)
    },
    confirmBtn: function () {
        var self = this
        $("#confirm").on('click', function () {
            var price = self.price1 * 1 + self.price2 * 1
            window.location.href = 'https://mstar.istarcredit.com/pay/pay.html?order_sn=' + util.getUrlparam('order_sn') + '&user_name=' + util.getUrlparam('user_name') + '&user_idcard=' + util.getUrlparam('user_idcard') + '&user_phone=' + util.getUrlparam('user_phone') + '&return_url=' + util.getUrlparam('return_url') + '&price=' + price
        })
    }
};
$(function () {
    new Payment().init();
    $(".confirm_btn").on('click', function () {
        $("#mask").css("display", "none")
    })
})