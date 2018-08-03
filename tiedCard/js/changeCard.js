var moreInfo = function () { }
moreInfo.prototype = {
    init: function () {
        this.bindEvent();
        this.formVerify();
        this.sendcode();
    },
    // 事件绑定
    bindEvent: function () {
        var self = this;
        //地址选择select
        var $showDom = $('#address');
        $('#addressSelect').on('click', function () {
            var $this = $(this);
            var oneLevelId = $showDom.attr('data-province-code');
            var twoLevelId = $showDom.attr('data-city-code');
            var threeLevelId = $showDom.attr('data-district-code');
            var timeSelect = new IosSelect(3, [iosProvinces, iosCitys, iosCountys], {
                title: '地址选择',
                itemHeight: 35,
                relation: [1, 1, 0],
                oneLevelId: "110000",
                twoLevelId: "110100",
                threeLevelId: "110105",
                callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
                    $showDom.attr('data-province-code', selectOneObj.id);
                    $showDom.attr('data-city-code', selectTwoObj.id);
                    $showDom.attr('data-district-code', selectThreeObj.id);
                    $showDom.html(selectOneObj.value + ',' + selectTwoObj.value + ',' + selectThreeObj.value);
                }
            });
        });
        //支行名称select
        $('#branchName').on('click', function () {
            var $this = $(this);
            var timeSelect = new IosSelect(1, [bankData], {
                title: '支行名称',
                itemHeight: 50,
                itemShowCount: 5,
                oneLevelId: '3',
                callback: function (data) {
                    $this.find('#bankBranch').html(data.value);
                    self.card_no = data.id;
                    self.card_name = data.value;
                }
            });
        });
    },
    // 表单验证
    formVerify: function () {
        $('#changeCard').on('click', function () {
            var belongs = $("#belongs").html();
            var bankBranch = $("#bankBranch").html();
            var code = $("#code").val();
            if (!belongs || belongs === '请选择银行卡开户地') {
                util.toast("请选择银行卡开户地");
                return false;
            } else if (!bankBranch || bankBranch === '请选择开户支行') {
                util.toast("请选择开户支行");
                return false;
            } else if (!code) {
                util.toast("请输入验证码");
                return false;
            } else {
                // TODO
            }
        })
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
            var belongs = $("#belongs").html();
            var bankBranch = $("#bankBranch").html();
            if (!flag) {
                return false;
            } else {
                if (!belongs || belongs === "请选择银行卡开户地") {
                    util.toast("请选择银行卡开户地")
                    return false;
                } else if (!bankBranch || bankBranch === '请选择开户支行') {
                    util.toast("请选择开户支行");
                    return false;
                } else {
                    // var data = {
                    //     identify: that.signinfo.identify,
                    //     bank_card_no: bankno.trim(),
                    //     bank_account_name: name.trim(),
                    //     certificate_no: cardNo.trim(),
                    //     mobile: phone.trim()
                    // }
                    // var sendcode = {
                    //     url: "h5/preBind",
                    //     data: data,
                    //     success: function (res) {
                    //         console.log(res);
                    //         if (res.code == 1) {
                    //             that.unique_code = res.unique_code
                    //             // 发送验证码
                    //             settime(self);
                    //         } else {
                    //             util.toast(res.msg);
                    //         }
                    //     }
                    // }
                    // util.sendRequest(sendcode)
                }

            }
        });
    }
}
$(function () {
    new moreInfo().init();
    // 截取最后四位
    var cardNum = $(".cardNum").html();
    if (cardNum) {
        $(".cardNum").html(cardNum.substr(cardNum.length - 4))
    }
})