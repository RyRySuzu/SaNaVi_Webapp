function emergency() {
    EcountT = 0;
    EcountF = 0;


    var data = {
        ship_id: Lid
    }; //id取得


    $.ajax({
        type: 'post', // HTTPメソッド
        url: '//toba-sanavi.azurewebsites.net/PHP/getting_data_emergency_Azure.php',
        data: data, // POSTするデータ
        cache: false,
        dataType: 'json',
        success: function(data) { // 成功時の処理
            //dataを見やすいように加工する

            for (var i in data) {
                emergency[i] = parseFloat(data[i].emergency);
                if (emergency[i] == 0) {
                    EcountT++

                } else {
                    EcountF++
                }
            }
            //  alert("遭難しました");
            if (EcountT != 0) {

                //もう一つフラグが必要　ソースの見直しをする

                var data2 = {
                    ship_id: Lid
                }; //id取得

                $.ajax({
                    type: 'post', // HTTPメソッド
                    url: '//toba-sanavi.azurewebsites.net/PHP/emergency_sounan_Azure.php',
                    data: data2, // POSTするデータ
                    cache: false,
                    dataType: 'json',
                    success: function(data2) { // 成功時の処理
                        // マーカーの配列を空にする
                        if (sounan_circleArray) {
                            for (i in sounan_circleArray) {
                                sounan_circleArray[i].setMap(null);
                            }
                            sounan_circleArray.length = 0;
                        }

                        for (var i in data2) {
                            Slat[i] = parseFloat(data2[i].lat);
                            Slon[i] = parseFloat(data2[i].lon);
                            Semergency[i] = parseFloat(data2[i].emergency);
                            Sflag[i] = parseFloat(data2[i].flag);


                            if (Sflag[i] == 0) {
                                //Eaudioflag = true;
                                EcountT_100 = true;
                                //alert(EcountT_100);
                            }


                            var markers = new google.maps.LatLng(Slat[i], Slon[i]);


                            // マーカーを配列に格納する
                            var marker = new google.maps.Marker({
                                position: markers,
                                map: map,
                                title: "Maybe you are here now.", //追加するならコンマ
                                zIndex: 1,
                                icon: {
                                    path: google.maps.SymbolPath.CIRCLE,
                                    // scale: Semergency[i]*2, // 大きさ
                                    scale: 100, // 大きさ
                                    fillOpacity: 0.6, // 塗りつぶしの透過度
                                    fillColor: "#FF0000", // 塗りつぶしの色
                                    strokeColor: "#ffffff", // 線の色
                                    strokeWeight: 2, // 線の太さ
                                },

                            });


                            sounan_circleArray.push(marker);
                        }
                    }
                });

                // マーカーの配列を表示する
                if (sounan_circleArray) {
                    for (i in sounan_circleArray) {
                        sounan_circleArray[i].setMap(map);
                    }
                }

                if (EcountT_100 == true) {

                    Eaudioflag = true;
                    if (approach_emergencyflag == true) { //接近してるとき　遭難してるとき
                        document.getElementById("approach").style.display = "none";
                        document.getElementById("emergency").style.display = "none";
                        document.getElementById("approach_emergency").style.display = "block";
                    } else { //接近してない　遭難してる false
                        document.getElementById("approach").style.display = "none";
                        document.getElementById("approach_emergency").style.display = "none";
                        document.getElementById("emergency").style.display = "block";
                    }

                }
            } else {

                if (approach_emergencyflag == true) { //接近してる　遭難してない
                    document.getElementById("emergency").style.display = "none";
                    document.getElementById("approach").style.display = "block";
                    document.getElementById("approach_emergency").style.display = "none";
                    //alert("接近");
                    //document.getElementById("approach").style.display="none";
                } else { //接近してない　遭難してない false
                    document.getElementById("approach").style.display = "none";
                    document.getElementById("approach_emergency").style.display = "none";
                    document.getElementById("emergency").style.display = "none";
                }
                //  alert("遭難していません");

                // マーカーの配列を空にする
                if (sounan_circleArray) {
                    Eaudioflag = false;
                    for (i in sounan_circleArray) {
                        sounan_circleArray[i].setMap(null);
                    }
                    sounan_circleArray.length = 0;
                }

                EcountT_100 = false;

            }

        }
    });


    if (Aaudioflag == true && Musicflag == false || Eaudioflag == true && Musicflag == false) {
        audio3.play();
        Musicflag = true;
    }

    if (Aaudioflag == false && Eaudioflag == false) {
        audio3.pause();
        Musicflag = false;
    }


}
