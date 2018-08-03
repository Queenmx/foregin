$(function () {
    var contactName = $(".contact_name").html();
    // console.log(contactName);
    var data = {
        orderNo: util.getUrlparam('order_sn')
    }
    var getContact = {
        url: 'conInfo/' + util.getUrlparam('order_sn'),
        // data: data,
        success: function (res) {
            console.log(res);
            if (res.code === "0000") {
                // TODO
                $(".name").html(res.data.cusName)
                $(".idcard").html(res.data.idCard || res.data.cardIdcard)
                $(".mobile").html(res.data.mobile || res.data.cardMobile)
                $(".contract_price_upper").html(res.data.applyPriceCN)
                $(".contract_price_lower").html(res.data.applyPrice)
                $(".card_owner_name").html(res.data.cardOwnerName)
                $(".card_number").html(res.data.cardNumber)
                $(".card_bank_name").html(res.data.cardBankName)
                $(".start_date").html(res.data.year + "年" + res.data.month + "月" + res.data.day + "日")
            } else {
                // util.toast(res.msg);
            }
        }
    }
    util.sendRequest(getContact);
})