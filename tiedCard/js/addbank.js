var addBank = function () {
    this.signinfo = JSON.parse(localStorage.getItem("signinfo"));
    // console.log(this.signinfo);
    $("#card").val(this.signinfo.id_card);
    $("#name").val(this.signinfo.owner);
    // $("#bankno").val('6214832503050853')
    $("#phone").val(this.signinfo.phone)
    // this.identify = localStorage.getItem('identify')
}
addBank.prototype = {
    card_no: '',
    card_name: '',
    unique_code: '',
    init: function () {
        var self = this;
        self.bindEvent();
        self.sendcode();
        self.formVerify();
        // util.toast("失败", false)
    },
    bindEvent: function () {
        var self = this;
        //银行卡信息select
        $('.select').on('click', function () {
            var $this = $(this);
            var timeSelect = new IosSelect(1, [bankData], {
                container: '.container',
                title: '',
                itemHeight: 50,
                itemShowCount: 5,
                oneLevelId: '3',
                callback: function (data) {
                    $this.find('.form-show').html(data.value);
                    self.card_no = data.id;
                    self.card_name = data.value;
                }
            });
        });
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
            console.log(that.signinfo.identify);
            var self = $(this);
            var cardNo = $("#card").val();
            var phone = $("#phone").val();
            var code = $('#code').val();
            var name = $("#name").val();
            var bankno = $("#bankno").val();
            var belongs = $("#belongs").html();
            if (!flag) {
                return false;
            } else {
                if (!(/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(name))) {
                    util.toast("请输入正确的开户姓名");
                    return false;
                } else if (!cardNo) {
                    util.toast("请输入身份证号");
                    return false;
                } else if (!util.isCardNo(cardNo)) {
                    util.toast("身份证号非法");
                    return false;
                } else if (bankno.length < 16) {
                    util.toast("请输入正确的银行卡号");
                    return false;
                }
                else if (util.luhmCheck(bankno) === false) {
                    util.toast("请输入正确的银行卡号");
                    return false;
                }
                else if (!belongs) {
                    util.toast("请选择所属银行")
                    return false;
                } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
                    util.toast("请输入正确的手机号码")
                    return false;
                } else {
                    var data = {
                        identify: that.signinfo.identify,
                        bank_card_no: bankno.trim(),
                        bank_account_name: name.trim(),
                        certificate_no: cardNo.trim(),
                        mobile: phone.trim(),
                        bank_name: belongs,
                        bank_code: that.card_no
                    }
                    console.log(data)
                    $('.getcode').off('click')
                    var sendcode = {
                        url: "h5/preBind",
                        data: data,
                        success: function (res) {
                            $('.getcode').on('click')
                            console.log(res);
                            if (res.code == 1) {
                                that.unique_code = res.unique_code
                                // 发送验证码
                                settime(self);
                            } else {
                                util.toast(res.msg);
                            }
                        },
                        error: function () {
                            $('.getcode').on('click')
                        }
                    }
                    util.sendRequest(sendcode)
                }

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
            if (!(/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(name))) {
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
            }
            else if (util.luhmCheck(bankno) === false) {
                util.toast("请输入正确的银行卡号");
                return false;
            }
            else if (!belongs) {
                util.toast("请选择所属银行");
                return false;
            }
            else if (!util.checkPhone(phone)) {
                util.toast("请输入正确的手机号");
                return false;
            } else if (!code) {
                util.toast("请输入短信验证码");
                return false;
            } else if (!self.unique_code) {
                util.toast("请先获取验证码");
                return false;
            } else {
                var data = {
                    identify: self.signinfo.identify,
                    unique_code: self.unique_code,
                    code: code
                }
                console.log(data)
                var conFirm = {
                    url: 'h5/bindConfirm',
                    data: data,
                    success: function (res) {
                        console.log(res);
                        if (res.code == 1) {
                            // TODO 授权成功
                            // window.history.go(-1);
                            // window.history.back()
                            window.location.href = localStorage.getItem("locationUrl")
                        } else {
                            util.toast(res.msg)
                        }
                    }
                }
                util.sendRequest(conFirm)
            }

        })

    }

}
$(function () {
    new addBank().init();
})