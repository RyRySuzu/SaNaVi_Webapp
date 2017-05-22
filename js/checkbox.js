/*-----------------------------------------------
 * チェックボックスのオンオフの見た目に関する処理
 *-----------------------------------------------*/
function BoxChecked() {
    $("#checklisttable label").addClass('ui-checkbox-on').removeClass('ui-checkbox-off');
    $("#checklisttable span.ui-icon").addClass('ui-icon-checkbox-on').removeClass('ui-icon-checkbox-off');
    $('input[type="checkbox"]').each(function() {
        $("#checklisttable input").each(function() {
            $(this).prop('checked', false);
        });
        $("#checklisttable label").addClass('ui-checkbox-off').removeClass('ui-checkbox-on');
        $("#checklisttable span.ui-icon").addClass('ui-icon-checkbox-off').removeClass('ui-icon-checkbox-on');
    });

}

function AppChecked() {
    $("#checklisttable_app label").addClass('ui-checkbox-on').removeClass('ui-checkbox-off');
    $("#checklisttable_app span.ui-icon").addClass('ui-icon-checkbox-on').removeClass('ui-icon-checkbox-off');
    $('input[type="checkbox"]').each(function() {
        $("#checklisttable_app input").each(function() {
            $(this).prop('checked', false);
        });
        $("#checklisttable_app label").addClass('ui-checkbox-off').removeClass('ui-checkbox-on');
        $("#checklisttable_app span.ui-icon").addClass('ui-icon-checkbox-off').removeClass('ui-icon-checkbox-on');
    });

}

/*-----------------------------------------------
 * チェックボックスの表示、オンオフの切り替え、船の種類表示
 *-----------------------------------------------*/
function chkdisp(obj, id) {

    if (obj == true) {
        var str = id.toString();
        var data = {
            ship_type: str
        };
        // var json = JSON.stringify(str) // JavaScript から JSON

        $.ajax({
            type: 'post', // HTTPメソッド
            url: '//toba-sanavi.azurewebsites.net/PHP/getting_ship_type_Azure.php', // POSTするURL
            data: data, // POSTするデータ
            cache: false,
            dataType: 'json',
            success: function(data) { // 成功時の処理
                //alert(JSON.stringify(data));

                //Tflag = true;
                deleteArray(search_markersArray);
                deleteArray(Type_markersArray); //配列消去
                deleteArray(DB_markersArray);
                deletepoly();

                for (var i in data) {
                    T_ship[i] = new Ship_data(parseFloat(data[i].lat), parseFloat(data[i].lon), data[i].ship_name, data[i].ship_id, parseFloat(data[i].direction), data[i].speed, data[i].compass, data[i].time, data[i].ship_type);

                    //dateオブジェクトの整形　ios関係のせいでややこしい
                    var timetmp = T_ship[i].time["date"];
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

                    var markers = new google.maps.LatLng(T_ship[i].lat, T_ship[i].lon);

                    //小数点の位置を2桁右に移動する（1234567.89にする）
                    T_ship[i].speed = T_ship[i].speed * 100;

                    //四捨五入したあと、小数点の位置を元に戻す
                    T_ship[i].speed = Math.round(T_ship[i].speed) / 100;
                    T_ship[i].compass = Math.round(T_ship[i].compass);


                    // マーカーを配列に格納する
                    var marker = new google.maps.Marker({
                        position: markers,
                        map: map,
                        title: "Maybe you are here now.", //追加するならコンマ
                        icon: {
                            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            scale: 5, // 大きさ
                            fillOpacity: 1, // 塗りつぶしの透過度
                            fillColor: "#A0522D", // 塗りつぶしの色
                            strokeColor: "#ffffff", // 線の色
                            strokeWeight: 2, // 線の太さ
                            rotation: 19 // 角度
                        },

                    });

                    // 情報ウィンドウを作成する
                    //var b64src = data[i].ship_picture;

                    var boxText = document.createElement("div");
                    boxText.innerHTML = "<div class='arrow_box'><br><div style='font-size: medium;'>　船名:" + T_ship[i].ship_name + "<br>" + "　速度:" + T_ship[i].speed +
                        "km/h<br>　角度:" + T_ship[i].compass + "<br>" + "　日時:" + mm + "月" + dd + "日" + "<br>" + "　時間:" + Hours + "時" + Minutes + "分" + Seconds + "秒"　 + "</div>";

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
                    Type_markersArray.push(new mapData(marker, infowindow));


                }


            }
        });

    } else {

        deleteArray(Type_markersArray); //配列消去
        deleteArray(DB_markersArray);

    }
}

// チェックボックスが true の時の処理 ----------------------------
function Approachclick() {
    //var val = $('#cb_gyosen').is(':checked'); でも判定できる

    if (jQuery('#cb_approach').prop('checked') == true) {
        BoxChecked();
        $("#cb_approach").prop('checked', true);

        //off時の処理
        Approach_cancel_master_flag = true;
        document.getElementById("approach").style.display = "none";
        audio3.pause();　
        Aaudioflag = false;
        approachflag = false;
        approach_emergencyflag = false;


    } else {
        Approach_cancel_master_flag = false;
        BoxChecked();
    }

}

// function Approach_distance_click() {
//
//     if (jQuery('#cb_approach_distance').prop('checked') == true) {
//       approach_distance = 200;
//       Approach_cancel_flag = false;
//       AppChecked();
//       $("#cb_approach_distance").prop('checked', true);
//     } else {
//       Approach_cancel_flag = true;
//       document.getElementById("approach").style.display = "none";
//       audio3.pause();　
//       Aaudioflag = false;
//       approachflag = false;
//       approach_emergencyflag = false;
//       AppChecked();
//     }
//
// }
//
// function Approach_distance3_click() {
//
//     if (jQuery('#cb_approach_distance3').prop('checked') == true) {
//       approach_distance = 300;
//       Approach_cancel_flag = false;
//       AppChecked();
//       $("#cb_approach_distance3").prop('checked', true);
//     } else {
//       Approach_cancel_flag = true;
//       document.getElementById("approach").style.display = "none";
//       audio3.pause();　
//       Aaudioflag = false;
//       approachflag = false;
//       approach_emergencyflag = false;
//       AppChecked();
//     }
//
// }
//
// function Approach_distance4_click() {
//
//     if (jQuery('#cb_approach_distance4').prop('checked') == true) {
//       approach_distance = 400;
//       Approach_cancel_flag = false;
//       AppChecked();
//       $("#cb_approach_distance4").prop('checked', true);
//     } else {
//       Approach_cancel_flag = true;
//       document.getElementById("approach").style.display = "none";
//       audio3.pause();　
//       Aaudioflag = false;
//       approachflag = false;
//       AppChecked();
//     }
//
// }
//
// function Approach_distance5_click() {
//
//     if (jQuery('#cb_approach_distance5').prop('checked') == true) {
//       approach_distance = 500;
//       Approach_cancel_flag = false;
//       AppChecked();
//       $("#cb_approach_distance5").prop('checked', true);
//     } else {
//       Approach_cancel_flag = true;
//       document.getElementById("approach").style.display = "none";
//       audio3.pause();　
//       Aaudioflag = false;
//       approachflag = false;
//       AppChecked();
//     }
//
// }

function Gclick() {
    //var val = $('#cb_gyosen').is(':checked'); でも判定できる

    if (jQuery('#cb_gyosen').prop('checked') == true) {
        Startflag = false;
        Shiptype_flag = true;
        BoxChecked();
        $("#cb_gyosen").prop('checked', true);
        chkdisp(true, '漁船');
    } else {
        Startflag = true;
        Shiptype_flag = false;
        BoxChecked();
        chkdisp(false, '漁船');
    }

}

function RYOclick() {

    if (jQuery('#cb_ryokyaku').prop('checked') == true) {
        Startflag = false;
        Shiptype_flag = true;
        BoxChecked();
        $("#cb_ryokyaku").prop('checked', true);
        chkdisp(true, '旅客船');
    } else {
        Startflag = true;
        Shiptype_flag = false;
        BoxChecked();
        chkdisp(false, '旅客船');
    }

}

function KAclick() {

    if (jQuery('#cb_kamotu').prop('checked') == true) {
        Startflag = false;
        Shiptype_flag = true;
        BoxChecked();
        $("#cb_kamotu").prop('checked', true);
        chkdisp(true, '貨物船');
    } else {
        Startflag = true;
        Shiptype_flag = false;
        BoxChecked();
        chkdisp(false, '貨物船');
    }

}

function KOclick() {

    if (jQuery('#cb_kousoku').prop('checked') == true) {
        Startflag = false;
        Shiptype_flag = true;
        BoxChecked();
        $("#cb_kousoku").prop('checked', true);
        chkdisp(true, '高速船');
    } else {
        Startflag = true;
        Shiptype_flag = false;
        BoxChecked();
        chkdisp(false, '高速船');
    }

}

function TANclick() {

    if (jQuery('#cb_tannka').prop('checked') == true) {
        Startflag = false;
        Shiptype_flag = true;
        BoxChecked();
        $("#cb_tannka").prop('checked', true);
        chkdisp(true, 'タンカー船');
    } else {
        Startflag = true;
        Shiptype_flag = false;
        BoxChecked();
        chkdisp(false, 'タンカー船');
    }

}

function REclick() {

    if (jQuery('#cb_rezya').prop('checked') == true) {
        Startflag = false;
        Shiptype_flag = true;
        BoxChecked();
        $("#cb_rezya").prop('checked', true);
        chkdisp(true, 'レジャー');
    } else {
        Startflag = true;
        Shiptype_flag = false;
        BoxChecked();
        chkdisp(false, 'レジャー');
    }

}

function TAGclick() {


    if (jQuery('#cb_tag').prop('checked') == true) {
        Startflag = false;
        Shiptype_flag = true;
        BoxChecked();
        $("#cb_tag").prop('checked', true);
        chkdisp(true, 'タグ、パイロット船');
    } else {
        Startflag = true;
        Shiptype_flag = false;
        BoxChecked();
        chkdisp(false, 'タグ、パイロット船');
    }

}

function Yclick() {

    if (jQuery('#cb_others').prop('checked') == true) {
        Startflag = false;
        Shiptype_flag = true;
        BoxChecked();
        $("#cb_others").prop('checked', true);
        chkdisp(true, 'ヨット、その他');
    } else {
        Startflag = true;
        Shiptype_flag = false;
        BoxChecked();
        chkdisp(false, 'ヨット、その他');

    }

}

function Mclick() {

    if (jQuery('#cb_minyuryoku').prop('checked') == true) {
        Startflag = false;
        Shiptype_flag = true;
        BoxChecked();
        $("#cb_minyuryoku").prop('checked', true);
        chkdisp(true, '未入力');
    } else {
        Startflag = true;
        Shiptype_flag = false;
        BoxChecked();
        chkdisp(false, '未入力');

    }

}
