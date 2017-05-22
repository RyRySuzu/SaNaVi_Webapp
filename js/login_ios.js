$(function() {
    if ($.cookie("sample")) {
        $("#login_now").text("船のid:" + $.cookie("sample") + "でログイン中です")
        Lid = $.cookie("sample");
    }
})

$("#logout_start").click(function() {
    alert("Logout Complete");
    $.removeCookie("sample");
    location.href = "//toba-sanavi.azurewebsites.net/test_ios.html"
})

$("#register_start").click(function() {
    location.href = "//toba-sanavi.azurewebsites.net/Register.html"
})

$("#return_map").click(function() {
    mapflag = false;
    map.setCenter(myLatlng);
    document.getElementById("return_map").style.display = "none";
})
$("#login_comp").click(function() {

    var data = {
        E_mail: $("#loginid").val(),
        password: $("#loginpass").val()
    };

    $.ajax({
        type: 'post', // HTTPメソッド
        url: '//toba-sanavi.azurewebsites.net/PHP/get_ship_id_login_Azure.php',
        data: data, // POSTするデータ
        cache: false,
        dataType: 'json',
        success: function(data) { // 成功時の処理
            login_check = parseFloat(data[0].login);
            login_id = parseFloat(data[0].ship_id);

            if (login_check == 0) {
                alert("Login Complete ");
                $.cookie("sample", login_id, {
                    expires: 30
                });
                location.href = "//toba-sanavi.azurewebsites.net/test_ios.html"
            } else {
                alert("Login failed");
            }
        }
    });

})
