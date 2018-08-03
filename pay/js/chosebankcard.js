var choseBank = function () {
    this.cardList = [];
    this.orderInfo = JSON.parse(localStorage.getItem('orderInfo'))
    this.bindway = localStorage.getItem("bindway")
    this.urlContact = (this.orderInfo.url).indexOf("?") < 0 ? '?' : '&';
    localStorage.setItem("locationUrl", window.location.href)
}
choseBank.prototype = {
    txnAmt: '',
    is_mermber_free: 0,

    init: function () {
        var self = this;
        self.BankList();
        // self.agreementPay()
    },
    // 银行列表
    BankList: function () {
        var self = this;
        console.log(self.orderInfo.identify);
        var data = {
            identify: self.orderInfo.identify
        }
        if (self.bindway) {
            data = Object.assign({ bind_way: "yeepay" }, data)
        }
        console.log(data)
        var banklist = {
            url: 'xjbk/pay_info/baofu',
            data: data,
            success: function (res) {
                console.log(res)
                var str = "";
                if (res.code === "0000") {
                    self.is_mermber_free = res.data.is_mermber_free;
                    self.txnAmt = res.data.txnAmt;
                    var payMoney = localStorage.getItem('reMoney');
                    $(".pay_num").val(payMoney);
                    if (self.is_mermber_free == 1) {
                        $(".pay_num").attr("disabled", true)
                    }
                    var bankCard = {
                        name: res.data.cards[0].card_owner_name,
                        id_card: res.data.cards[0].id_card
                    }
                    localStorage.setItem("bankCard", JSON.stringify(bankCard))
                    var data = res.data.cards;
                    for (var i = 0; i < data.length; i++) {
                        var icon = data[i].bank_code;
                        var checked = data[i].default_card;
                        var bankname = data[i].bank_name;
                        var cardNum = data[i].bank_card_no;
                        var protocol_no = data[i].protocol_no;
                        if (icon !== "ABC") {
                            self.cardList.push(protocol_no);
                        }
                        if (cardNum) {
                            cardNum = cardNum.substr(cardNum.length - 4)// 截取最后四位
                        }
                        if (checked === "1") {
                            str = "checked"
                        } else {
                            str = ""
                        }
                        if (icon !== "ABC") {
                            var html = "<li><label for='bank" + i + "'><img class='bankIcon' src='img/bankicos/" + icon + ".png' alt='' /><span class='bankname'>" + bankname + "</span>（<span class='cardNum'>" + cardNum + "</span>）<input type='radio' name='pay' id='bank" + i + "' value='" + i + "' " + str + "/><span class='checkIcon'></span></label ></li>"
                            $(".payBox").append(html);
                        }
                    }
                    console.log(self.cardList)
                    self.agreementPay();
                } else {
                    util.toast(res.msg)
                }

            }
        }
        util.sendRequest(banklist);
    },
    countNum: function (count, url) {
        var self = this;
        window.setTimeout(function () {
            count--;
            if (count > 0) {
                $(".num").html(count);
                self.countNum(count, url);
            } else {
                // console.log(url);
                window.location.href = url;
            }
        }, 1000);
    },
    // 协议支付
    agreementPay: function () {

        // https://www.moneybox.com/h5bindcard/entry/?order_sn=&user_name=刘先森&user_phone=13245678901&user_idcard=610121198008081208&sign=ef6852278c1445930290c127b0454965&echo_data={pid:12345}&return_url=http%3a%2f%2fh5.xianjincard.com%2fh5bindcard-notify%2f


        var self = this
        var money = $(".pay_num").html();
        var index;
        var posturl = "";
        console.log(self.orderInfo.url)
        $("#confirm").on('click', function (event) {
            event.stopPropagation();
            index = $(".payBox").eq(0).find("input[type='radio']:checked").parents("li").index();
            console.log(index);
            if (index < 0) {
                util.toast("请先选择银行卡");
                return false;
            }
            var protocolNo = self.cardList[index];
            var data = {
                tradeNo: self.orderInfo.identify,
                protocolNo: protocolNo,
                txnAmt: $(".pay_num").val() * 1,
                return_url: self.orderInfo.url
                // txnAmt: self.txnAmt
            }
            console.log(data);
            $("#confirm").off('click');
            $("#mask").css('display', 'block')
            if (self.bindway) {
                self.yeepay(data)
            } else {
                self.baofu(data)
            }
        })

    },
    // baofu
    baofu: function (data) {
        var self = this
        var dealPay = {
            url: "xjbk/pay_record/single_pay",
            data: data,
            success: function (res) {
                $("#confirm").on('click');
                console.log(res);
                if (res.code === "0000") {
                    // util.toast(res.msg)
                    if (res.data.resp_code === "S") {
                        localStorage.removeItem("bindway")
                        self.countNum(0, self.orderInfo.url + self.urlContact + "repay_result=200&order_sn=" + self.orderInfo.identify)
                    } else if (res.data.resp_code === "I") {
                        var resp_code = {
                            url: 'xjbk/pay_info/order_info_query',
                            data: {
                                identify: self.orderInfo.identify
                            },
                            success: function (res) {
                                if (res.data.resp_code === "S") {
                                    self.countNum(0, self.orderInfo.url + self.urlContact + "repay_result=200&order_sn=" + self.orderInfo.identify)
                                } else {
                                    util.toast(res.data.biz_resp_msg)
                                }
                            }
                        }
                        if (!self.bindway) {
                            util.sendRequest(resp_code)
                        }
                    }
                    else if (res.data.resp_code === "F") {
                        $(".loading p").html(res.data.biz_resp_msg)
                        self.countNum(0, self.orderInfo.url + self.urlContact + "repay_result=505&order_sn=" + self.orderInfo.identify)
                    }

                } else {
                    $("#mask").css('display', 'none')
                    util.toast(res.msg)
                }
            }
        }
        util.sendRequest(dealPay)
    },
    yeepay: function (data) {
        var self = this
        var dealPay = {
            url: "xjbk/pay_record/yee_upay",
            data: data,
            success: function (res) {
                $("#confirm").on('click');
                console.log(res);
                if (res.code === "0000") {
                    // util.toast(res.msg)
                    self.countNum(0, self.orderInfo.url + self.urlContact + "repay_result=200&order_sn=" + self.orderInfo.identify)
                } else {
                    $("#mask").css('display', 'none')
                    util.toast(res.msg)
                    self.countNum(0, self.orderInfo.url + self.urlContact + "repay_result=505&order_sn=" + self.orderInfo.identify)
                }
            }
        }
        util.sendRequest(dealPay)
    }
}
$(function () {
    new choseBank().init();
})