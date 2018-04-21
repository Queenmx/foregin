
(function ($) {
    var signer = {
        id: '',
        init: function () {
            // this.getId();
            // this.getMoney();
            this.submit();
            this.href();
            //初始化插件
            $("#signature").jSignature(
                'init', {
                    height: 6.44 + 'rem',
                    width: 100 + "%",
                    'decor-color': 'transparent'
                }
            );
            // 重新签名
            function reset() {
                var $sigdiv = $("#signature");
                $sigdiv.jSignature("reset");
            }
            // 重签按钮
            $("#reset").on('click', function () {
                reset();
            })
        },
        getId: function () {
            var self = this;
            var init = {
                url: '/member/uname',
                success: function (res) {
                    if (res.code == 1) {
                        self.id = res.data;
                    } else {
                        util.toast(res.msg);
                    }
                }
            }
            util.sendRequest(init);
        },
        getMoney: function () {
            var getMoney = {
                url: '/contract/ownprice',
                success: function (res) {
                    if (res.code == 1) {
                        util.toast("放款到账金额为" + res.data.loan_price + "元，费用详情请查阅合同。", 5000);
                        localStorage.setItem("fee", res.data.service_charge + ".00")
                    } else {
                        util.toast(res.msg);
                    }
                }
            }
            util.sendRequest(getMoney);
        },
        submit: function () {
            var self = this;
            // 提交签名
            $("#jSignatureSubmit").on('click', function () {
                var $sigdiv = $("#signature");
                // var datapair = $sigdiv.jSignature("getData", "svgbase64");
                var datapair = $sigdiv.jSignature("getData", "image");
                var i = new Image();
                // var imgBase64 = datapair[0]+","+datapair[1];
                var imgBase64 = datapair[1];
                var flag = false;


                // 勾选同意用户协议
                if ($("#checked").is(':checked')) {
                    if (!flag) {
                        $.ajax({
                            type: 'post',
                            url: "http://apih5.xinyzx.com:81/h5/Contract/sign",
                            data: {
                                // imgsrc: imgBase64,
                                imgsrc: encodeURIComponent(imgBase64),
                                id: self.id,
                                agree_tick: 1,
                                contractid: util.getQueryString("contractid")
                            },
                            beforeSend: function () {
                                flag = true;
                            },
                            complete: function () {
                                flag = false;
                            },
                            success: function (res) {
                                if (res.code == 1) {
                                    // window.location.href = 'passend.html'
                                    window.location.href = "passtrue.html"
                                } else if (res.code == 21) {
                                    var identify = res.data.identify;
                                    var contractname = res.data.contractname;
                                    var signinfo = {
                                        contractid: util.getQueryString("contractid"),
                                        id: self.id,
                                        identify: identify,
                                        contractname: contractname
                                    }
                                    localStorage.setItem("signInfo", JSON.stringify(signinfo));
                                    // window.location.href = "memberfee.html?contractid=" + util.getQueryString("contractid") + "&id=" + self.id + "&identify=" + identify + "&contractname=" + contractname;
                                    window.location.href = "tips.html"
                                } else if (res.code == 23) {
                                    var contractname = res.data.contractname;
                                    var type = {
                                        url: "/Contract/push_contract",
                                        data: {
                                            id: self.id,
                                            contractid: util.getQueryString("contractid"),
                                            contractname: contractname
                                        },
                                        success: function (res) {
                                            if (res.code == "1") {
                                                window.location.href = "passtrue.html?id=" + util.getQueryString("id")
                                            } else {
                                                util.toast(res.msg)
                                            }
                                        }
                                    }
                                    util.sendRequest(type);
                                } else {
                                    util.toast(res.msg)
                                }
                            },
                            error: function (res) {
                                util.toast("操作不成功！");
                            }
                        })
                    }

                } else {
                    util.toast("请认真阅读并同意用户协议");
                }
            })
        },
        href: function () {
            $(".page-agree a").click(function () {
                window.location.href = "signcontract" + $(this).data("href") + ".html?contractid=" + util.getQueryString("contractid")
            })
        }
    }
    signer.init();


})(jQuery)
