
(function ($) {
    console.log("pensigner");
    var signer = {
        id: '',
        init: function () {
            // this.getContact();
            this.href();
            this.submit();
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
        getContact: function () {
            $(".page-agree a").on('click', function () {
                var contactName = $(this).html();
                // console.log(contactName);
                var getContact = {
                    url: 'h5/public/contractDetail',
                    data: {
                        order_sn: util.getUrlparam('order_sn'),
                        fileType: contactName
                    },
                    success: function (res) {
                        console.log(res.data)
                        if (res.code == 1) {
                            window.location.href = res.data
                        } else {
                            util.toast(res.msg);
                        }
                    }
                }
                util.sendRequest(getContact);
            })

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
                console.log($sigdiv.jSignature('getData', 'native').length)
                var flag = true;
                if ($sigdiv.jSignature('getData', 'native').length <= 0) {
                    util.toast("请先签名");
                    return false;
                } else if ($("#checked").is(':checked')) {// 勾选同意用户协议
                    if (flag) {
                        flag = false
                        $("#mask").css('display', 'block')
                        var data = {
                            imgsrc: imgBase64,
                            // imgsrc: encodeURIComponent(imgBase64),
                            agree_tick: 1,
                            trade_no: util.getUrlparam('order_sn'),
                            return_url: util.getUrlparam('return_url')
                        }
                        console.log("签约参数：", data);
                        var submitContact = {
                            url: 'h5/Contract/sign',
                            data: data,
                            success: function (res) {
                                console.log(res)
                                $("#mask").css('display', 'none')
                                if (res.code == 1) {
                                    flag = false
                                    window.location.href = res.data
                                    // console.log(res.data)
                                } else {
                                    flag = true
                                    util.toast(res.msg)
                                }
                            },
                            error: function (res) {
                                flag = true
                                $("#mask").css('display', 'none')
                            }
                        }
                        console.log("签约============")
                        util.sendRequest(submitContact)
                    }

                } else {
                    util.toast("请认真阅读并同意用户协议");
                }
            })
        },
        href: function () {
            $(".page-agree a").click(function () {
                window.location.href = "signcontract" + $(this).data("href") + ".html?order_sn=" + util.getUrlparam('order_sn')
            })
        }
    }
    signer.init();


})(jQuery)
