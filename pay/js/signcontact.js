$(function () {
    var contactName = $(".contact_name").html();
    // console.log(contactName);
    var data = {
        order_sn: util.getUrlparam('order_sn'),
        fileType: contactName
    }
    console.log(data);
    var getContact = {
        url: 'h5/public/contractDetail',
        data: data,
        success: function (res) {
            console.log(res.data)
            if (res.code == 1) {
                // TODO
                $(".name").html(res.data.cusName)
                $(".idcard").html(res.data.idCard || res.data.cardIdcard)
                $(".mobile").html(res.data.cardMobile)
                $(".contract_price_upper").html(res.data.applyPriceCN)
                $(".contract_price_lower").html(res.data.applyPrice)
                $(".card_owner_name").html(res.data.cardOwnerName)
                $(".card_number").html(res.data.cardNumber)
                $(".card_bank_name").html(res.data.cardBankName)
                $(".live_address").html(res.data.liveAddress)
                $(".duration").html(res.data.hyDay)
                $(".servicefee").html(res.data.hyFee)
                $(".start_date").html(res.data.year + "年" + res.data.month + "月" + res.data.day + "日")
            } else {
                // util.toast(res.msg);
            }
        }
    }
    util.sendRequest(getContact);
})