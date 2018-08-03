/**
 * util 工具类
 */
;
(function (win, doc, util) {
    /**
     * 加密
     * @param word
     * @returns {*}
     */
    util.strEnc = function (word, key) {
        key = CryptoJS.enc.Utf8.parse(key);
        var srcs = CryptoJS.enc.Utf8.parse(word);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        return encrypted.toString();
    }

    /**
     * 解密
     * @param word
     * @returns {*}
     */
    util.strDec = function (word, key) {
        key = CryptoJS.enc.Utf8.parse(key);
        var decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        // console.log("hhhh", decrypt)
        // console.log(CryptoJS.enc.Utf8.stringify(decrypt))
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    }
    /**
    * 
    * 
    * 手机端toast提示
    * @param {String} msg
    * @param {String} time
    */
    util.toast = function (msg, flag, time) {
        var time = time || 3000;
        if ($('.util-toast').length >= 1) {
            return false;
        }
        if (flag === false) {
            $('body').append('<div class="util-toast"><img src="img/fail.png" />' + msg + '</div>');
        } else if (flag === true) {
            $('body').append('<div class="util-toast"><img src="img/success.png" />' + msg + '</div>');
        } else {
            $('body').append('<div class="util-toast">' + msg + '</div>');
        }
        setTimeout(function () { $('.util-toast').remove(); }, time);
    }
    /**
 * 获取url参数
 * @param  {String} name 参数值
 * 支持中文和英文
 * @return {Boolean}      [description]
 */
    util.getUrlparam = function (name) {
        // 获取参数
        var url = window.location.search;
        // 正则筛选地址栏
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        // 匹配目标参数
        var result = url.substr(1).match(reg);
        //返回参数值
        return result ? decodeURIComponent(result[2]) : null;
    };
    /**
 * ajax封装
 * @param {Object} type
 * @param {Object} opts
 */
    util.sendRequest = function (opts) {
        $.ajax({
            type: 'get',
            // url: 'http://wuhanxingrong.vicp.io:28892/' + opts.url,
            url: 'http://wuhanxingrong.vicp.io:8762/xr/cash/' + opts.url,//测试地址
            // url: 'http://wuhanxingrong.vicp.io:28900/' + opts.url,
            // url: 'http://xiaodai.istarcredit.com:8762/xr/cash/' + opts.url,//生产地址
            timeout: 20000,
            // dataType: "jsonp",
            // callback: 'callback',
            // data: { params: util.strEnc(JSON.stringify(opts.data), 'XRD20171030APIMM') } || {},
            data: opts.data || {},
            beforeSend: opts.beforeSend || function () {
                //opts.beforeSend===undefined 默认操作
            },
            complete: opts.complete || function () {
                //opts.complete===undefined 默认操作
            },
            success: opts.success || function () {
                //opts.success===undefined 默认操作

            },

            //success: function (res) {

            //console.log("success:" + util.strDec(res, 'XRD20171030APIMM'))
            // res = JSON.parse(util.strDec(res, 'XRD20171030APIMM'))
            // if (opts.success) {
            //     opts.success(res)
            // }

            //},
            error: opts.error || function (error) {
                if (error.status == 404) {
                    util.toast("请求未找到！")
                } else if (error.status == 503) {
                    util.toast("服务器内部错误！")
                } else {
                    util.toast("网络连接超时！")
                }
            }
        })
    }
    $(".page-back").on('click', function () {
        window.history.back();
    })
})(window, window.document, window.util || (window.util = {}));
