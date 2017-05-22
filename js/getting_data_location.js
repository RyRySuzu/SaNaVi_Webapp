setInterval(function() {
    if (Startflag == true && Lid != 111111111) { // 利用規約に同意 & ログイン済
          $.ajax({ // データ送信開始
              type: 'post', // HTTPメソッド
              url: '//toba-sanavi.azurewebsites.net/PHP/sending_information_emergency_Azure.php', // POSTするURL
              data: positiondata, // POSTするデータ
              dataType: 'json', // レスポンスのデータ型
          });

          if (Approach_cancel_master_flag == false) {
              // approach(); //アプローチを先に　エマージェンシーを後に
          }
          // emergency();
    }
}, 3000);


setInterval(function() {
      if (navigator.onLine === true) {
          online_count = 0;
      } else if (navigator.onLine === false) {
          online_count++;
      } else {
          console.log("ネットワーク未検出");
      }

      if (online_count >= 3) {
          document.getElementById("connect_error").style.display = "block";
          Startflag = false;
          delete_shipdata(); //配列消去
      } else if (online_count == 0 && Startflag == false && Shiptype_flag == false) {
          document.getElementById("connect_error").style.display = "none";
          Startflag = true;
      }
}, 3000);


setInterval(function() {
    if (Startflag == true) {
        // DBから現在地の100キロ以内の船を取得する
        $.ajax({
            type: 'post', // HTTPメソッド
            url: '//toba-sanavi.azurewebsites.net/PHP/getting_data_latlon_Azure.php',
            data: positiondata, // POSTするデータ
            cache: false,
            dataType: 'json',
            timeout:10000,
            success:successHandler,
            error: errorHandler
        });

        if (DB_markersArray) {
            for (var i = 0; i < DB_markersArray.length; i++) {
                eraseArray(DB_markersArray[i]);
            }
        }

        // マーカーの配列を表示する
        if (DB_markersArray) {
            for (var i = 0; i < DB_markersArray.length; i++) {
                drawArray(DB_markersArray[i]);
            }
        }

    }
 }, 3000);


function successHandler(data) { // 成功時の処理
     // マーカーの配列を空にする
     deleteArrayDB(DB_markersArray);

     /*infowindow_count++;
     deleteArrayDB(DB_markersArray,infowindow_count);
     if(infowindow_count >= 2 ){
        infowindow_count = 0;
     }*/

     for (var i in data) {
         D_ship[i] = new Get_Ship_data(parseFloat(data[i].lat), parseFloat(data[i].lon), data[i].ship_name, data[i].ship_id, parseFloat(data[i].direction), data[i].speed, data[i].compass, data[i].time, data[i].ship_type, data[i].ship_state, data[i].online_distinction);

         // dateオブジェクトの整形　ios関係のせいでややこしい
         var timetmp = D_ship[i].time["date"];
         var dateArr = timetmp.split(/[- :T\+]/);
         var datetime = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], dateArr[3], dateArr[4], dateArr[5]);

         // 9時間プラス
         datetime.setMinutes(datetime.getMinutes());

         // 配列にする予定
         var yyyy = datetime.getFullYear();
         var mm = datetime.getMonth() + 1;
         var dd = datetime.getDate();
         var Hours = datetime.getHours();
         var Minutes = datetime.getMinutes();
         var Seconds = datetime.getSeconds();

         // 小数点の位置を2桁右に移動する（1234567.89にする）
         D_ship[i].speed = D_ship[i].speed * 100;

         // 四捨五入したあと、小数点の位置を元に戻す
         D_ship[i].speed = Math.round(D_ship[i].speed) / 100;
         D_ship[i].compass = Math.round(D_ship[i].compass);

         var markers = new google.maps.LatLng(D_ship[i].lat, D_ship[i].lon);
         // var marker = new google.maps.LatLng(33.013032, 135.258545);

         scale = 5;

         if(D_ship[i].online_distinction == 0 || Lid == D_ship[i].ship_id){
           // マーカーを配列に格納する
           var marker = new google.maps.Marker({
               position: markers,
               map: map,
               title: "Maybe you are here now.",
               icon: {
                   path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                   scale: scale, // 大きさ
                   fillOpacity: 1, // 塗りつぶしの透過度
                   fillColor: D_ship[i].ship_type, // 塗りつぶしの色
                   strokeColor: "#ffffff", // 線の色
                   strokeWeight: 2, // 線の太さ
                   rotation: D_ship[i].direction // 角度
               },
           });
         }else{
           // マーカー
           var marker = new google.maps.Marker({
               position: markers,
               map: map,
               icon: {
                 url: "img/"+D_ship[i].ship_state ,
                 scaledSize: new google.maps.Size( 40, 40 ) ,
               },
           });
         }

         // var b64src = data[i].ship_picture;
         var boxText = document.createElement("div");
         boxText.innerHTML = "<div class='arrow_box'><br><div style='font-size: small;'>　船名:" + D_ship[i].ship_name + "<br>" + 　"　速度:" + D_ship[i].speed +
             "km/h<br>　角度:" + D_ship[i].compass + "<br>" + "　日時:" + mm + "月" + dd + "日" + "<br>" + "　時間:" + Hours + "時" + Minutes + "分" + Seconds + "秒"　 + "</div>";

         // 情報ウィンドウを作成する
         var myOptions = {
             content: boxText,
             disableAutoPan: false,
             maxWidth: 0,
             pixelOffset: new google.maps.Size(-100, -140),
             zIndex: null,
             boxStyle: {
                 width: "210px"
             },
             closeBoxMargin: "10px 10px 2px 2px",
             closeBoxURL: "//www.google.com/intl/en_us/mapfiles/close.gif",
             infoBoxClearance: new google.maps.Size(1, 1),
             isHidden: false,
             pane: "floatPane",
             enableEventPropagation: false
         };

         var infowindow = new InfoBox(myOptions);

         // マーカーがクリックされた時に情報ウィンドウを表示する処理
         setMarker(marker, infowindow);

         // マーカーを配列に保存する処理
         DB_markersArray.push(new mapData(marker, infowindow));
         // DB_markersArray.push(marker);

    }
}

function errorHandler(XMLHttpRequest, textStatus, errorThrown){
    alert("通信に失敗しています");
    console.log(XMLHttpRequest);
    console.log(textStatus);
    console.log(errorThrown);
}

function delete_shipdata(){
  deleteArray(search_markersArray);
  deleteArray(Type_markersArray);
  deleteArray(DB_markersArray);
  deletepoly();
}

 // swiftから実行する関数
 /*function BackgroundHandler(lat, lon, direction, speed, time, x, y, z) {
    var lat_split = lat.split(",");
    var lon_split = lon.split(",");
    var direction_split = direction.split(",");
    var speed_split = speed.split(",");
    var time_split = time.split(",");
    var accele_x_split = x.split(",");
    var accele_y_split = y.split(",");
    var accele_z_split = z.split(",");

    var B_positiondata = {
        ship_id: Lid,
        lat: lat_split,
        lon: lon_split,
        direction: direction_split,
        speed: speed_split,
        time: time_split,
        accele_x: accele_x_split,
        accele_y: accele_y_split,
        accele_z: accele_z_split
    };

    $.ajax({
        type: 'post', // HTTPメソッド
        url: '//toba-sanavi.azurewebsites.net/PHP/sending_nativedata.php',
        data: B_positiondata, // POSTするデータ
        cache: false,
        dataType: 'json',
        success: function(data) { // 成功時の処理
            send_flag = true;
        }

    });
 }*/
