//timer1 = setInterval(function() { // キャンセルボタン用
setInterval(function() {
    if (Startflag == true) {

        if (Lid != 111111111) {

            //オンライン、オフラインの判定 ネイティブアプリ使用時はコメントアウト
            if (navigator.onLine === true) {
                if (Connect_flag == false) {
                    location.href = 'Reconnection://foobar/';
                    Connect_flag = true;
                }
            } else if (navigator.onLine === false) {
                Connect_flag = false;
                send_flag = false;
                location.href = 'jsnoty://foobar/,' + latitude + "," + longitude + "," + direction + "," + speed + "," + offline_time + "," + accele_x + "," + accele_y + "," + accele_z;
            } else {
                console.log("ネットワーク未検出");
            }

            if (send_flag == true) {

                $.ajax({
                    type: 'post', // HTTPメソッド
                    url: '//toba-sanavi.azurewebsites.net/PHP/sending_information_emergency_Azure.php', // POSTするURL
                    data: positiondata, // POSTするデータ
                    dataType: 'json', // レスポンスのデータ型
                });

                if (Approach_cancel_flag == false && Approach_cancel_master_flag == false) {
                    approach(); //アプローチを先に　エマージェンシーを後に
                }

                //emergency();
            }

        }

      }
}, 3000);

  setInterval(function() {
      if (Startflag == true) {
        //DBから周辺100kmの船舶情報を取得
        $.ajax({
            type: 'post', // HTTPメソッド
            url: '//toba-sanavi.azurewebsites.net/PHP/getting_data_latlon_Azure.php',
            data: positiondata, // POSTするデータ
            cache: false,
            dataType: 'json',
            success: function(data) { // 成功時の処理
                //alert(JSON.stringify(data));
                // マーカーの配列を空にする
                deleteArrayDB(DB_markersArray);


                for (var i in data) {
                    D_ship[i] = new Ship_data(parseFloat(data[i].lat), parseFloat(data[i].lon), data[i].ship_name, data[i].ship_id, parseFloat(data[i].direction), data[i].speed, data[i].compass, data[i].time, data[i].ship_type);

                    //dateオブジェクトの整形　ios関係のせいでややこしい
                    var timetmp = D_ship[i].time["date"];
                    var dateArr = timetmp.split(/[- :T\+]/);
                    var datetime = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], dateArr[3], dateArr[4], dateArr[5]);

                    //var datetime = new Date(timetmp.replace(/-/g,"/"));

                    //9時間プラス
                    datetime.setMinutes(datetime.getMinutes());

                    //気が向いたら配列に
                    var yyyy = datetime.getFullYear();
                    var mm = datetime.getMonth() + 1;
                    var dd = datetime.getDate();
                    var Hours = datetime.getHours();
                    var Minutes = datetime.getMinutes();
                    var Seconds = datetime.getSeconds();

                    //alert(D_ship[i].compass);

                    //小数点の位置を2桁右に移動する（1234567.89にする）
                    D_ship[i].speed = D_ship[i].speed * 100;

                    //四捨五入したあと、小数点の位置を元に戻す
                    D_ship[i].speed = Math.round(D_ship[i].speed) / 100;

                    var markers = new google.maps.LatLng(D_ship[i].lat, D_ship[i].lon);

                    scale = 5;

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

                    //var b64src = data[i].ship_picture;
                    var boxText = document.createElement("div");
                    boxText.innerHTML = "<div class='arrow_box'><br><div style='font-size: medium;'>　船名:" + D_ship[i].ship_name + "<br>" + 　"　速度:" + D_ship[i].speed +
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
                    //DB_markersArray.push(marker);

                }
            }
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

//swiftから実行する関数 　プロパティにする
function BackgroundHandler(lat, lon, direction, speed, time, x, y, z) {
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
}
