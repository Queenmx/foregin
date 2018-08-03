/**
 * pay
 */
var Payment = function () {
    // this.ip = returnCitySN["cip"];
    this.timestamp = new Date().getTime();
    console.log(this.timestamp);
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
    this.bindway = localStorage.getItem("bindway")
    localStorage.setItem("orderInfo", JSON.stringify(this.orderInfo))
    console.log(JSON.parse(localStorage.getItem("orderInfo")));
}
Payment.prototype = {
    // 初始化
    init: function () {
        var self = this;
        self.getinfo();
        self.bindEvent();
        self.getContact();
    },
    // 取值
    getinfo: function () {
        var self = this;
        var getInfo = {
            url: 'xjbk/pay_info/order_price_query',
            data: {
                identify: self.orderInfo.identify
            },
            success: function (res) {
                console.log(res);
                if (res.code === "0000") {
                    self.is_mermber_free = res.data.is_mermber_free
                    // util.toast('success!')
                    console.log(self.price)
                    if (!self.price) {
                        $(".pay_num").val(parseFloat(res.data.total_amount).toFixed(2))
                    } else {
                        $(".pay_num").val(parseFloat(self.price).toFixed(2))
                    }
                    if (self.is_mermber_free == 1) {
                        // $(".memberfeeImg").css('display', 'block');
                        $(".pay_num").attr("disabled", true);
                        $(".page-agree").css('display', 'block');
                        $(".alipayMsg").html("（手续费：2元/笔）")
                    } else {
                        $(".pay_num").attr("disabled", false);
                        self.complete_time = res.data.loan_complete_time * 1000
                    }
                } else {
                    util.toast(res.msg)
                }
            }
        }
        util.sendRequest(getInfo);
    },
    // 查看合同
    getContact: function () {
        $("#member").on('click', function () {
            window.location.href = "membercontract.html?order_sn=" + util.getUrlparam('order_sn')
        })

    },
    pay: function (flag, uuid) {
        var self = this;
        if (flag == 1) {
            console.log(self.is_mermber_free);
            if (self.bindway) {
                localStorage.removeItem("bindway")
            }
            var alipay = {
                url: 'xjbk/pay_info/alipay',
                data: {
                    identify: self.orderInfo.identify
                },
                success: function (res) {
                    console.log(res)
                    var result = res;
                    var price = $(".pay_num").val()
                    var baseprice = $(".pay_num").val() * 1
                    if (res.code === "0000") {
                        var pay_recode = {
                            url: 'xjbk/pay_record/alipay',
                            data: {
                                uuid: uuid,
                                tradeNo: result.data.out_trade_no,
                                txnAmt: price * 1
                                // txnAmt: res.data.total_amount
                            },
                            success: function (res) {
                                console.log(res)
                                if (res.code === "0000") {
                                    var data = {
                                        type: result.data.type,
                                        // out_trade_no: res.data.out_trade_no,
                                        out_trade_no: uuid,
                                        subject: "星点贷还款",
                                        total_amount: (baseprice + baseprice * 0.006).toFixed(2),
                                        return_url: self.orderInfo.url + '?identify=' + util.getUrlparam('order_sn')
                                        // total_amount: res.data.total_amount
                                    }
                                    if (self.is_mermber_free == 1) {
                                        data.subject = "星点贷服务费";
                                        data.total_amount = (baseprice + 2).toFixed(2)
                                        data.return_url = self.orderInfo.url
                                    }
                                    console.log("支付：", data)
                                    $.ajax({
                                        // url: 'http://wuhanxingrong.vicp.io:18080/xr/zhifu',
                                        // url: 'http://xiaodai.istarcredit.com:8768/xr/zhifu',
                                        url: 'https://xiaodai-pay.istarcredit.com/xr/zhifu',
                                        type: 'POST',
                                        data: {
                                            params: encryptedParams(data)
                                        },
                                        success: function (res) {
                                            if (res.code === "0000") {
                                                var zfForm = res.data.zfForm;
                                                $("body").append(zfForm);
                                            } else {
                                                util.toast(res.msg)
                                            }
                                        },
                                        error: function (res) {
                                            util.toast("操作不成功！");
                                        }
                                    })
                                } else {
                                    util.toast(res.msg)
                                }
                                // 
                            }
                        }
                        util.sendRequest(pay_recode);

                    } else {
                        util.toast(res.msg)
                    }
                }
            }
            util.sendRequest(alipay)
        }
        // else if (flag == 3) {
        //     var price = $(".pay_num").val()
        //     var data = {
        //         body: "测试支付",
        //         out_trade_no: uuid,
        //         total_fee: "1",
        //         spbill_create_ip: self.ip,
        //         type: "3"
        //     }
        //     $.ajax({
        //         // url: 'http://wuhanxingrong.vicp.io:18080/xr/zhifu',
        //         url: 'http://wuhanxingrong.vicp.io:28891/wechat/h5_pay',
        //         type: 'POST',
        //         data: {
        //             params: encryptedParams(data)
        //         },
        //         success: function (res) {
        //             if (res.code === "0000") {
        //                 // TODO
        //                 window.location.href = res.data.mweb_url
        //             } else {
        //                 util.toast(res.msg)
        //             }
        //         },
        //         error: function (res) {
        //             util.toast("操作不成功！");
        //         }
        //     })
        // } 
        else {
            var baseprice = $(".pay_num").val() * 1
            localStorage.setItem('reMoney', (baseprice + 2).toFixed(2))
            if (flag == 4) {
                localStorage.setItem('bindway', "yeepay")
            } else {
                if (self.bindway) {
                    localStorage.removeItem("bindway")
                }
            }
            window.location.href = "choseBankCard.html"
        }
    },
    bindEvent: function () {
        var self = this;
        $("#confirm").on('click', function () {
            var payValue = $(".pay_num").val() * 1;
            var uuid = util.random(10);
            if (payValue < 1) {
                util.toast("最小金额为1元")
                return
            }
            var flag = $("input[type='radio']:checked").val();
            var d = (self.timestamp - self.complete_time) / 1000 / 3600;
            console.log(self.timestamp, self.complete_time, d);
            if (d < 24) {
                $(".mask").css('display', 'block');
                if ($("#checked").is(':checked')) {
                    $(".confirm_btn").on('click', function () {
                        console.log(flag);
                        self.pay(flag, uuid);
                    })
                } else {
                    util.toast("请认真阅读并同意《会员服务内容》");
                }
            } else {
                if ($("#checked").is(':checked')) {
                    self.pay(flag, uuid);
                } else {
                    util.toast("请认真阅读并同意《会员服务内容》");
                }
            }
        })
    }
};
$(function () {
    new Payment().init();
    $(".cancel_btn").on('click', function () {
        $(".mask").css("display", "none");
    })
})