var choseBank = function () {
    this.cardList = [];
    // this.identify = util.getUrlparam('order_sn');
    this.signinfo = {
        identify: util.getUrlparam('order_sn'),
        owner: util.getUrlparam('user_name'),
        phone: util.getUrlparam('user_phone'),
        id_card: util.getUrlparam('user_idcard'),
        echo_data: util.getUrlparam('echo_data')
    }
    //localInfo = localStorage.getItem("signinfo")
    //if (!localInfo || !JSON.parse(localInfo).identify) {
    localStorage.setItem('signinfo', JSON.stringify(this.signinfo))
    localStorage.setItem("locationUrl", window.location.href)
    //
    console.log(JSON.parse(localStorage.getItem("signinfo")));
}
choseBank.prototype = {
    signinfo: localStorage.getItem("signinfo"),
    init: function () {
        var self = this;
        self.BankList();
    },
    // 银行列表
    BankList: function () {
        var self = this;
        console.log(self.signinfo);
        var banklist = {
            url: 'h5/cardList',
            data: {
                identify: self.signinfo.identify
            },
            success: function (res) {
                console.log(res)
                var str = "";
                var obj = {};
                if (res.code == 1) {
                    var data = res.data;
                    for (var i = 0; i < data.length; i++) {
                        var icon = data[i].bank_code;
                        var checked = data[i].default_card;
                        var bankname = data[i].bank_name;
                        var cardNum = data[i].bank_card_no;
                        obj.name = icon;
                        obj.value = cardNum;
                        obj.text = bankname;
                        if (icon !== "ABC") {
                            self.cardList.push(obj);
                        }
                        obj = {}
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
                    self.agreementPay()
                } else {
                    util.toast(res.msg)
                }

            }
        }
        util.sendRequest(banklist);
    },
    // 确认绑卡
    agreementPay: function () {

        // https://www.moneybox.com/h5bindcard/entry/?order_sn=&user_name=刘先森&user_phone=13245678901&user_idcard=610121198008081208&sign=ef6852278c1445930290c127b0454965&echo_data={pid:12345}&return_url=http%3a%2f%2fh5.xianjincard.com%2fh5bindcard-notify%2f


        var self = this
        var money = $(".pay_num").html();
        var index;
        $("#confirm").on('click', function () {
            index = $(".payBox").eq(0).find("input[type='radio']:checked").parents("li").index();
            if (index < 0) {
                util.toast("请先选择银行卡");
                return false;
            } else {
                var card_no = self.cardList[index].value;
                var bank_code = self.cardList[index].name;
                var bankname = self.cardList[index].text;
                var data = {
                    identify: self.signinfo.identify,
                    card_no: card_no,
                    owner: self.signinfo.owner,
                    phone: self.signinfo.phone,
                    id_card: self.signinfo.id_card,
                    bank_name: bankname,
                    bank_code: bank_code,
                    echo_data: self.signinfo.echo_data,
                    return_url: util.getUrlparam('return_url')
                }
                console.log(data);
                $("#confirm").off('click');
                var dealPay = {
                    url: 'h5/bindCard',
                    data: data,
                    success: function (res) {
                        $("#confirm").on('click');
                        console.log(res);
                        if (res.code == 1) {
                            window.location.href = res.data
                        } else if (res.code === "403") {
                            util.toast(res.msg);
                            setTimeout(function () {
                                window.location.reload()
                            }, 2000)
                        } else {
                            window.location.href = res.data
                        }
                    },
                    error: function () {
                        $("#confirm").on('click');
                    }

                }
                util.sendRequest(dealPay);
            }


        })

    }
}
$(function () {
    new choseBank().init();
})