$(function() {
    $("#response").html("Response Values");

    $("#button_search").click(function() {
        var data = {
            ship_id: $("#value1").val()
        };

        mapflag = true;

        $.ajax({
            type: 'post', // HTTPメソッド
            //url  : 'http://toba-sanavi.azurewebsites.net/PHP/shipday.php',
            url: '//toba-sanavi.azurewebsites.net/PHP/get_ship_name_id_Azure_demo.php',
            data: data, // POSTするデータ
            cache: false,
            dataType: 'json',
            success: function(data) { // 成功時の処理

                deleteArray(Type_markersArray); //配列消去
                deleteArray(search_markersArray);
                deletepoints();

                for (var i in data) {
                    S_ship[i] = new Ship_data(parseFloat(data[i].lat), parseFloat(data[i].lon), data[i].ship_name, data[i].ship_id, parseFloat(data[i].direction), data[i].speed, data[i].compass, data[i].time);

                    //dateオブジェクトの整形　ios関係のせいでややこしい
                    var timetmp = S_ship[i].time["date"];
                    var dateArr = timetmp.split(/[- :T\+]/);
                    var datetime = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], dateArr[3], dateArr[4], dateArr[5]);

                    //9時間プラス
                    datetime.setMinutes(datetime.getMinutes());

                    //気が向いたら配列に
                    var yyyy = datetime.getFullYear();
                    var mm = datetime.getMonth() + 1;
                    var dd = datetime.getDate();
                    var Hours = datetime.getHours();
                    var Minutes = datetime.getMinutes();
                    var Seconds = datetime.getSeconds();

                    var markers = new google.maps.LatLng(S_ship[i].lat, S_ship[i].lon);

                    if (i == 1) {
                        Kposition = new google.maps.LatLng(S_ship[0].lat, S_ship[0].lon);
                    }

                    // ラインを引く座標の配列を作成
                    points.push(markers);

                    // 小数点の位置を2桁右に移動する（1234567.89にする）
                    S_ship[i].speed = S_ship[i].speed * 100;

                    // 四捨五入したあと、小数点の位置を元に戻す
                    S_ship[i].speed = Math.round(S_ship[i].speed) / 100;
                    S_ship[i].compass = Math.round(S_ship[i].compass);

                    if (i % 3 == 0) {

                        // マーカーを配列に格納する
                        var marker = new google.maps.Marker({
                            position: markers,
                            map: map,
                            title: "Maybe you are here now.", //追加するならコンマ
                            icon: {
                                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                                scale: 5, // 大きさ
                                fillOpacity: 1, // 塗りつぶしの透過度
                                fillColor: "#000000", // 塗りつぶしの色
                                strokeColor: "#ffffff", // 線の色
                                strokeWeight: 2, // 線の太さ
                                rotation: S_ship[i].direction // 角度
                            },

                        });

                        // var b64src = data[i].ship_picture;

                        var boxText = document.createElement("div");
                        boxText.innerHTML = "<div class='arrow_box'><br><div style='font-size: small;'>　船名:" + S_ship[i].ship_name + "<br>" + 　"　速度:" + S_ship[i].speed +
                            "km/h<br>　角度:" + S_ship[i].compass + "<br>" + "　日時:" + mm + "月" + dd + "日" + "<br>" + "　時間:" + Hours + "時" + Minutes + "分" + Seconds + "秒"　 + "</div>";

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
                        search_markersArray.push(new mapData(marker, infowindow));

                    }


                }

                map.setCenter(Kposition);

                if (poly) {
                    poly.setMap(null);
                }

                // ラインを作成
                var polyLineOptions = {
                    path: points,
                    strokeWeight: 5,
                    strokeColor: "#0000ff",
                    strokeOpacity: "0.5"
                };

                // ラインを設定
                poly = new google.maps.Polyline(polyLineOptions);
                poly.setMap(map);

                document.getElementById("return_map").style.display = "block";

            }
        });

    });

});
