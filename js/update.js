$(function() { // DBから更新情報を取得する
        var data = {
            ship_id: Lid
        };

        $.ajax({
            type: 'post', // HTTPメソッド
            url: '//toba-sanavi.azurewebsites.net/PHP/getting_data_update.php',
            data: data, // POSTするデータ
            cache: false,
            dataType: 'json',
            success: function(data) {
              for (var i in data) {
                update_information[i] = new Update_information(data[i].information, data[i].update_flag, data[i].ship_name, data[i].ship_id,data[i].ship_type,data[i].E_mail);
                update_information_string += update_information[i].information +"<br>";
              }
            update_info_write(); // 更新情報をmodalに書く
            }
        });
});


function update_info_write(){

  if(update_information.length == 0){ //　情報の更新が無ければマークを消す
    document.getElementById("icon_badge").style.display="none";
  }else{ // 更新があれば、更新の数をバッジアイコンを表示させる

    if(update_information[0].ship_id == 111111111 ){　//　ログインしていないときの処理
      update_information[0].ship_id = "ログインしていません。";
    }

    document.getElementById("icon_badge").innerHTML = update_information.length;

    //$("#update_info").text(update_information_string); // 更新情報書き込み
    var Update_Text = document.getElementById("update_info");
    Update_Text.innerHTML = update_information_string;
    $("#ship_id").text("船舶id:"+update_information[0].ship_id);
    $("#ship_name").text("船舶名:"+update_information[0].ship_name);
    $("#ship_type").text("船舶種類:"+update_information[0].ship_type);
    $("#E_mail").text("Emailアドレス:"+update_information[0].E_mail);
  }

  console.log("update_js:"+update_information_string);

}


function errorHandler(XMLHttpRequest, textStatus, errorThrown){
    alert("通信に失敗しています");
    console.log(XMLHttpRequest);
    console.log(textStatus);
    console.log(errorThrown);
}
