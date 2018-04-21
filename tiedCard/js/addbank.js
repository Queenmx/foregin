var addBank = function () {
    var userInfo = JSON.parse(localStorage.getItem("userinfo"));
}
addBank.prototype = {
    init: function () {
        var self = this;
        self.sendcode();
        self.formVerify();
        // util.toast("失败", false)
    },
    sendcode: function () {
        var that = this;
        //短信60秒发送
        var flag = true;
        var countdown = 60;
        var timer = null;
        function settime(obj) {
            if (countdown == 0) {
                flag = true;
                $(obj).removeClass('active').removeClass("getcode").addClass("recode");
                $(obj).html("重新获取");
                countdown = 60;
                clearTimeout(timer);
                $(".recode").attr('onclick');
                return;
            } else {
                flag = false;
                $(obj).addClass('active');
                $(obj).html("" + countdown + "秒后发送");
                countdown--;
                $(".getcode,.recode").removeAttr('onclick');
            }
            timer = setTimeout(function () {
                settime(obj)
            }, 1000)
        }
        $('.getcode').on('click', function () {
            var self = $(this);
            var cardNo = $("#card").val();
            var phone = $("#phone").val();
            var code = $('#code').val();
            var name = $("#name").val();
            var bankno = $("#bankno").val();
            var belongs = $("#belongs").html();
            var type = util.getQueryString("type");
            var data = {
                owner: that.owner,
                // owner: "韩梅梅",
                card_no: bankno,
                id_card: that.idcard,
                // id_card: "210302196001012114",
                phone: phone,
                pay_money: localStorage.getItem("fee"),
                type: type,
            }
            console.log(data);
            if (type == 2) {
                var newData = {
                    identify_pay: that.sign.identify
                }
                data = Object.assign(data, newData)
            }
            if (!flag) {
                return false;
            } else {
                // 发送验证码请求发起
                if (!(/^[\u4e00-\u9fa5]{2,4}$/.test(name))) {
                    util.toast("请输入正确的开户姓名");
                    return false;
                } else if (!cardNo) {
                    util.toast("请输入身份证号");
                    return false;
                } else if (!util.isCardNo(cardNo)) {
                    util.toast("身份证号非法");
                    return false;
                }
                else if (bankno.length < 16) {
                    util.toast("请输入正确的银行卡号");
                    return false;
                } else if (util.luhmCheck(bankno) === false) {
                    util.toast("请输入正确的银行卡号1");
                    return false;
                } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
                    util.toast("请输入正确的手机号码")
                    return false;
                } else {
                    var sendcode = {
                        url: "/member/loginfee_sign",
                        data: data,
                        success: function (res) {
                            if (res.code == 0) {
                                util.toast(res.msg);
                            } else {
                                that.order_no = res.data.order_no;
                                $('.getcode').off("click")
                                // 发送验证码
                                settime(self);
                            }
                        }
                    }
                    uitl.sendRequest('post', sendcode)
                }

            }
        });
        $(".form-group").on('click', '.recode', function () {
            var self = $(this);
            if (!flag) {
                return false;
            } else {
                // 发送验证码请求发起
                var sendcode = {
                    url: "/member/reSendSms",
                    data: {
                        order_no: that.order_no
                    },
                    success: function (res) {
                        if (res.code == 0) {
                            util.toast(res.msg);
                            return false;
                        } else {
                            // 发送验证码
                            settime(self);
                        }
                    }
                }
                util.sendRequest('post', sendcode)
            }
        });
    },
    // 表单验证
    formVerify: function () {
        var self = this;
        var flag = true;
        $('#submit').on('click', function () {
            // console.log("================")
            var cardNo = $("#card").val();
            var phone = $("#phone").val();
            var code = $('#code').val();
            var name = $("#name").val();
            var bankno = $("#bankno").val();
            var belongs = $("#belongs").html();
            var address = $("#address").html();
            if (!(/^[\u4e00-\u9fa5]{2,4}$/.test(name))) {
                util.toast("请输入正确的开户姓名");
                return false;
            } else if (!cardNo) {
                util.toast("请输入身份证号");
                return false;
            } else if (!util.isCardNo(cardNo)) {
                util.toast("身份证号非法");
                return false;
            }
            else if (($("#bankno").val()).length < 16) {
                util.toast("请输入正确的银行卡号");
                return false;
            } else if (util.luhmCheck(bankno) === false) {
                util.toast("请输入正确的银行卡号");
                return false;
            } else if (!$('#belongs').html()) {
                util.toast("所属银行没有选择");
                return false;
            }
            // else if (!$("#address").html()) {
            // 	util.toast("银行卡开户地没有选择");
            // 	return false;
            // } 
            else if (self.isEmpty("#phone")) {
                util.toast("请输入手机号码");
                return false;
            } else if (!util.checkPhone(phone)) {
                util.toast("不是正确的手机号");
                return false;
            } else if (!code) {
                util.toast("请输入短信验证码");
                return false;
            }

        })

    }

}
$(function () {
    new addBank().init();
})