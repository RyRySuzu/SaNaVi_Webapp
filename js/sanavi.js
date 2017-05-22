function koshin(){

  var DB_markersArray = [];
  var Kensaku_markersArray = [];
  var Marine_markersArray = [];
  var Type_markersArray = [];
  var sounan_circleArray = [];

  var Dlat = [];　 //船検索に使用 DB
  var Dlon = [];
  var num3 = [];
  var Dship_name = [];
  var Dship_id = [];
  var Dcourse = [];
  var Dship_type = [];
  var Dkakudo = [];
  var Dspeed = [];

  var Mlat = []; //Marinetrafficから取得 marinetraffic
  var Mlon = [];
  var Mcourse = [];

  var Klat = [];　 //船検索に使用
  var Klon = [];
  var Kship_name = [];
  var Kcourse = [];
  var Kship_id = [];
  var Kspeed = [];
  var Kpic = [];
  var Kkakudo = [];

  var Tlat = [];　 //船の種類絞り込み用 Type
  var Tlon = [];
  var Tship_name = [];
  var Tcourse = [];
  var Tship_id = [];
  var Tkakudo = [];
  var Tspeed = [];
  var Tpic = [];
  var Tflag = new Boolean(false); //flag

  var Keihoulat; //警報音
  var Keihoulon;

  var emergency = []; //遭難用
  var Semergency = [];　
  var emergencysound = 0;
  var Eaudioflag = new Boolean(false); //接近検知 音 flag　

  var Slat = [];　 //遭難 Sounan
  var Slon = [];
  var Sship_name = [];
  var Scourse = [];
  var Sship_id = [];
  var Sflag = [];　 //遭難 Sounan

  var approach = []; //接近検知用 approach
  var approachflag = new Boolean(false); //接近検知 flag
  var approach_emergencyflag = new Boolean(false); //接近、遭難検知 flag
  var Aaudioflag = new Boolean(false); //接近検知の音 flag

  var points = []; //航跡表示線

  var scale = 0; //APIの大型船か、DBの小型船かの判別

  var login_id = []; //ログインid
  var Lid = 111111111; //ログインid取得するやつ　初期値111111111

  var audio = new Audio("meka_ge_keihou05.mp3"); //音
  var audio2 = new Audio("meka_ge_keihou05.mp3"); //音;//音
  var ScountF = 0;
  var ScountT = 0;
  var EcountF = 0;　
  var EcountT = 0;

  var positiondata;

  var EcountT_100 = new Boolean(false); //自分の周辺100キロ以内に船がいるか
  var Musicflag = new Boolean(false); //接近検知 音 flag
  var Startflag = new Boolean(false);
  var positionflag = new Boolean(false);
  var Scancelflag = new Boolean(false);//遭難キャンセル

  $(function() {
    $("#response").html("Response Values");

    $("#button_search").click(function() {
      var data = {
        ship_id: $("#value1").val(),
        ship_name: $("#value2").val()
      }; //id取得

      //  alert(JSON.stringify(data));

      $.ajax({
        type: 'post', // HTTPメソッド
        //url  : 'http://ezaki-lab.sakura.ne.jp/ankomaru/yamamoto/shipday.php',
        url: 'http://ezaki-lab.sakura.ne.jp/ankomaru/yamamoto/get_ship_name_id.php',
        data: data, // POSTするデータ
        cache: false,
        dataType: 'json',
        success: function(data) { // 成功時の処理
          //alert(JSON.stringify(data));



          deleteArray(Kensaku_markersArray); //配列消去
          for (var i in data) {
            Klat[i] = parseFloat(data[i].lat);
            Klon[i] = parseFloat(data[i].lon);
            Kship_name[i] = (data[i].ship_name);
            Kship_id[i] = (data[i].ship_id);
            Kcourse[i] = parseFloat(data[i].direction);
            Kspeed[i] = (data[i].speed);
            Kpic[i] = (data[i].ship_picture);
            Kkakudo[i] = (data[i].kakudo);


            var markers = new google.maps.LatLng(Klat[i], Klon[i]);
            //	points.push(markers);
            // ラインを引く座標の配列を作成

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
                rotation: Kcourse[i] // 角度
              },

            });

            var b64src = data[i].ship_picture;

            var boxText = document.createElement("div");
            boxText.innerHTML = "<div class='arrow_box'><br><div style='font-size: medium;'>　船名:" + Kship_name[i] + "</div><div style='position:relative; top:0px; left: 10px;'><img src='data:image/png;base64," + b64src +
              "'width='180'height='100'></div>" + "　速度:" + Kspeed[i] +
              "km<br>　角度:" + Kkakudo[i] + "</div>";

            var myOptions = {
              content: boxText,
              disableAutoPan: false,
              maxWidth: 0,
              pixelOffset: new google.maps.Size(-105, -200),
              zIndex: null,
              boxStyle: {
                width: "210px"
              },
              closeBoxMargin: "10px 10px 2px 2px",
              closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
              infoBoxClearance: new google.maps.Size(1, 1),
              isHidden: false,
              pane: "floatPane",
              enableEventPropagation: false
            };

            var infowindow = new InfoBox(myOptions);
            // マーカーがクリックされた時に情報ウィンドウを表示する処理
            setMarker(marker, infowindow);

            // マーカーを配列に保存する処理
            Kensaku_markersArray.push(new mapData(marker, infowindow));





          }

          // ラインを作成
          var polyLineOptions = {
            path: points,
            strokeWeight: 5,
            strokeColor: "#0000ff",
            strokeOpacity: "0.5"
          };

          // ラインを設定
          var poly = new google.maps.Polyline(polyLineOptions);
          poly.setMap(map);

        }
      });

    });


  });

  $("#myTab1 a").click(function(e) {
    //e.preventDefault()
    e.stopPropagation();
    $(this).tab('show');
  });

  $(function() { //くっきーの設定
    if ($.cookie("sample")) {
      $("#login_now").text("船のid:" + $.cookie("sample") + "でログイン中です")
      Lid = $.cookie("sample");

    }


    $("#button_logout").click(function() {
      alert("遭難キャンセル");
      Aaudioflag = false;
      Eaudioflag = false;
      Scancelflag = true;

      if (sounan_circleArray) {
        for (i in sounan_circleArray) {
          sounan_circleArray[i].setMap(null);
        }
        sounan_circleArray.length = 0;
      }

      setTimeout("Restart_eme()", 60000);
      //$.removeCookie("sample");
      //location.href = "http://ezaki-lab.sakura.ne.jp/sanavi/index.html"


    })


    $("#button2").click(function() {

      //  qq　=  $("#text").val();
      //alert("くっきー");


      var data = {
        ship_id: $("#text").val()
      };

      //  alert(JSON.stringify(data));

      $.ajax({
        type: 'post', // HTTPメソッド
        url: 'http://ezaki-lab.sakura.ne.jp/ankomaru/yamamoto/get_ship_id_login.php',
        data: data, // POSTするデータ
        cache: false,
        dataType: 'json',
        success: function(data) { // 成功時の処理
          //alert(JSON.stringify(data));
          login_id[0] = parseFloat(data[0].login);

          if (login_id[0] == 0) {
            alert("ログインしました！");
            $.cookie("sample", $("#text").val());
            //location.href = "http://sanavi.azurewebsites.net"
            location.href = "http://ezaki-lab.sakura.ne.jp/sanavi/appcancel.html"
          } else {
            alert("ログインに失敗しました");
          }
        }
      });



    })
  })



  setInterval(function() {

    if (Startflag == true ) {

      if(Lid != 111111111){

        $.ajax({
          type: 'post', // HTTPメソッド
          url: 'http://ezaki-lab.sakura.ne.jp/ankomaru/yamamoto/sending_information_emergency.php', // POSTするURL
          data: positiondata, // POSTするデータ
          dataType: 'json', // レスポンスのデータ型
        });

      //approach(); //アプローチを先に　エマージェンシーを後に
      //alert(Lid);
      if(Scancelflag == false){
      emergency_detection();
      }
    　　

      }

      /*-----------------------------------------------
       * DBから自分を中心とした100キロ圏内の船を引き出す
       *-----------------------------------------------*/


      $.ajax({
        type: 'post', // HTTPメソッド
        url: 'http://ezaki-lab.sakura.ne.jp/ankomaru/yamamoto/getting_data_latlon.php',
        data: positiondata, // POSTするデータ
        //data: data, // POSTするデータ
        cache: false,
        dataType: 'json',
        success: function(data) { // 成功時の処理
          // alert(JSON.stringify(data));
          // マーカーの配列を空にする
          if (DB_markersArray) {
            for (var i = 0; i < DB_markersArray.length; i++) {
              DB_markersArray[i].setMap(null);
            }
            DB_markersArray.length = 0;
          }


          for (var i in data) {
            Dlat[i] = parseFloat(data[i].lat);
            Dlon[i] = parseFloat(data[i].lon);
            Dship_id[i] = parseFloat(data[i].ship_id);
            Dship_name[i] = (data[i].ship_name);
            Dcourse[i] = parseFloat(data[i].direction);
            Dship_type[i] = (data[i].ship_type);
            Dkakudo[i] = (data[i].kakudo)
            Dspeed[i] = parseFloat(data[i].speed);
            //alert(Dcourse[i]);

            var markers = new google.maps.LatLng(Dlat[i], Dlon[i]);

            if (Dship_id[i] / 10000000 >= 1) {
              scale = 7;
            } else {
              scale = 5;
            }

            // マーカーを配列に格納する
            var marker = new google.maps.Marker({
              position: markers,
              map: map,
              title: "Maybe you are here now.",
              zIndex: 3,
              icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: scale, // 大きさ
                fillOpacity: 1, // 塗りつぶしの透過度
                fillColor: Dship_type[i], // 塗りつぶしの色
                strokeColor: "#ffffff", // 線の色
                strokeWeight: 2, // 線の太さ
                rotation: Dcourse[i] // 角度
              },

            });

            var b64src = data[i].ship_picture;
            var boxText = document.createElement("div");
            boxText.innerHTML = "<div class='arrow_box'><br><div style='font-size: medium;'>　船名:" + Dship_name[i] + "</div><div style='position:relative; top:0px; left: 10px;'><img src='data:image/png;base64," + b64src +
              "'width='180'height='100'></div>" + "　速度:" + Dspeed[i] +
              "km<br>　角度:" + Dkakudo[i] + "</div>";

            // 情報ウィンドウを作成する
            var myOptions = {
              content: boxText,
              disableAutoPan: false,
              maxWidth: 0,
              pixelOffset: new google.maps.Size(-105, -200),
              zIndex: null,
              boxStyle: {
                width: "210px"
              },
              closeBoxMargin: "10px 10px 2px 2px",
              closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
              infoBoxClearance: new google.maps.Size(1, 1),
              isHidden: false,
              pane: "floatPane",
              enableEventPropagation: false
            };

            var infowindow = new InfoBox(myOptions);

            // マーカーがクリックされた時に情報ウィンドウを表示する処理
            setMarker(marker, infowindow);

            // マーカーを配列に保存する処理
            DB_markersArray.push(marker);
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

  // マップのオプション
  var myOptions = {
    zoom: 17,
    mapTypeIds: google.maps.MapTypeId.ROADMAP
  }

  // マップの表示
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);


  // 位置情報取得のオプション
  var position_options = {
    enableHighAccuracy: true
  };

  // 現在位置情報を取得
  navigator.geolocation.watchPosition(monitor, null, position_options);


  // 位置情報取得成功時の処理
  function monitor(position) {

    var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    map.setCenter(myLatlng);

    // 緯度
    var latitude = position.coords.latitude;
    // 経度
    var longitude = position.coords.longitude;

    var heading = position.coords.heading;

    var speed = position.coords.speed;

    positiondata = {
      ship_id: Lid,
      lat: latitude,
      lon: longitude,
      direction: heading,
      speed: speed
    };

  }





  $(window).load(function() {
    $('#div-modal').modal('show');
    var loadBtn = document.getElementById('buttonaudio');
    loadBtn.addEventListener('click', function() {
      Startflag = true;

      // $('#div-modal').modal('hide')
      // $('#modale').modal('show');

    });
  });



  function import_Marinetraffic() {

    var req = new XMLHttpRequest();
    req.open('GET', "http://ezaki-lab.sakura.ne.jp/ankomaru/yamamoto/marinetrafficapi.php", true);
    req.onreadystatechange = function() {
      if ((req.readyState == 4) && (req.status == 200)) {
        // 返却されたテキストをjavascriptのオブジェクトに変換

      }
    };
    req.send("");

  }



  /*-----------------------------------------------
   * 遭難検知
   *-----------------------------------------------*/

  function emergency_detection() {
    EcountT = 0;
    EcountF = 0;


    var data = {
      ship_id: Lid
    }; //id取得


    $.ajax({
      type: 'post', // HTTPメソッド
      url: 'http://ezaki-lab.sakura.ne.jp/ankomaru/yamamoto/getting_data_emergency.php',
      data: data, // POSTするデータ
      cache: false,
      dataType: 'json',
      success: function(data) { //成功時の処理
        //dataを見やすいように加工する

        for (var i in data) {
          emergency[i] = parseFloat(data[i].emergency);
          if (emergency[i] == 0) {
            EcountT++

          } else {
            EcountF++//未使用
          }
        }

        if (EcountT != 0) { //遭難した

          //今の状況やとむり　もう一個フラグ
        　//alert("遭難しました");
          var data2 = {
            ship_id: Lid
          }; //id取得

          $.ajax({
            type: 'post', // HTTPメソッド
            url: 'http://ezaki-lab.sakura.ne.jp/ankomaru/yamamoto/emergency_sounan.php',
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


          //alert(EcountT_100);
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
            document.getElementById("approach_emergency").style.display = "none";
            document.getElementById("emergency").style.display = "none";
            document.getElementById("approach").style.display = "block";
            //document.getElementById("approach").style.display="none";
          } else { //接近してない　遭難してない false
            //alert("遭難してない");
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

          //emergencysound = 0;
          //document.getElementById("emergency").style.display="none";
        }

      }
    });


    if (Aaudioflag == true && Musicflag == false || Eaudioflag == true && Musicflag == false) {
      audio2.play();
      Musicflag = true;

    }

    if (Aaudioflag == false && Eaudioflag == false) {
      audio2.pause();
      Musicflag = false;
    }


  }

  /*-----------------------------------------------
   * 接近検知
   *-----------------------------------------------*/


  function approach() {
    //  var audio = new Audio("meka_ge_keihou05.mp3");
    ScountT = 0;
    ScountF = 0;


    var data = {
      ship_id: Lid
    }; //id取得


    $.ajax({
      type: 'post', // HTTPメソッド
      url: 'http://ezaki-lab.sakura.ne.jp/ankomaru/yamamoto/getting_data_within2.php',
      data: data, // POSTするデータ
      cache: false,
      dataType: 'json',
      success: function(data) { // 成功時の処理
        // 返却されたテキストをjavascriptのオブジェクトに変換

        // dataを見やすいように加工する

        for (var i in data) {
          approach[i] = parseFloat(data[i].approach);
          //  alert(emergency[i]);
          if (approach[i] == 0) {
            alert("船が接近中");
            ScountT++;
          } else if (approach[i] == 1) {
            //  alert("船は未接近です");
            ScountF++;
          }

        }

        if (ScountT != 0) {
          //document.getElementById("approach").style.display="block";
          //alert("船が接近中");
          //audio2.load();
          //audio2.play();
          approachflag = true;
          approach_emergencyflag = true;

        } else {
          //document.getElementById("approach").style.display="none";
          //alert("muri");
          //audio2.pause();
          approachflag = false;
          approach_emergencyflag = false;
        }




      }
    });


  }



  /*-----------------------------------------------
   * マーカー管理用
   *-----------------------------------------------*/
  function mapData(_marker, _infoWindow) {
    this.marker = _marker;
    this.infoWindow = _infoWindow;
  }

  /*-----------------------------------------------
   * マーカーをセットする処理
   *-----------------------------------------------*/
  function setMarker(marker, infoWindow) {
    google.maps.event.addListener(marker, 'click', function(event) {
      infoWindow.open(marker.getMap(), marker);
    });
  }

  /*-----------------------------------------------
   * マーカーを表示する処理
   *-----------------------------------------------*/
  function drawArray(arrayData) {
    for (var i = 0; i < arrayData.length; i++) {
      arrayData[i].marker.setVisible(true);
    }
  }

  /*-----------------------------------------------
   * マーカーと吹き出しを非表示にする処理
   *-----------------------------------------------*/
  function eraseArray(arrayData) {
    for (var i = 0; i < arrayData.length; i++) {
      arrayData[i].marker.setVisible(false);
      arrayData[i].infoWindow.close();
    }
  }

  /*-----------------------------------------------
   * 配列を削除する処理
   *-----------------------------------------------*/
  function deleteArray(arrayData) {
    for (var i = 0; i < arrayData.length; i++) {
      arrayData[i].marker.setMap(null);
      arrayData[i].infoWindow.setMap(null);
    }
    arrayData.length = 0; // 配列を空にしておく
    return arrayData;
  }


  /*-----------------------------------------------
   * 遭難検知flagをONにする処理
   *-----------------------------------------------*/
  function Restart_eme() {
    Scancelflag = false;
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

      $.ajax({
        type: 'post', // HTTPメソッド
        url: 'http://ezaki-lab.sakura.ne.jp/ankomaru/yamamoto/get_ship_type.php', // POSTするURL
        data: data, // POSTするデータ
        cache: false,
        dataType: 'json',
        success: function(data) { // 成功時の処理
          //alert(JSON.stringify(data));

          //Tflag = true;

          deleteArray(Type_markersArray); //配列消去
          if (DB_markersArray) {
            for (var i = 0; i < DB_markersArray.length; i++) {
              DB_markersArray[i].setMap(null);
            }
            DB_markersArray.length = 0;
          }

          for (var i in data) {
            Tlat[i] = parseFloat(data[i].lat);
            Tlon[i] = parseFloat(data[i].lon);
            Tship_name[i] = (data[i].ship_name);
            Tship_id[i] = (data[i].ship_id);
            Tcourse[i] = (data[i].direction);
            Tspeed[i] = (data[i].speed);
            Tpic[i] = (data[i].ship_picture);
            Tkakudo[i] = (data[i].kakudo);

            var markers = new google.maps.LatLng(Tlat[i], Tlon[i]);


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
            var b64src = data[i].ship_picture;

            var boxText = document.createElement("div");
            boxText.innerHTML = "<div class='arrow_box'><br><div style='font-size: medium;'>　船名:" + Tship_name[i] + "</div><div style='position:relative; top:0px; left: 10px;'><img src='data:image/png;base64," + b64src +
              "'width='180'height='100'></div>" + "　速度:" + Tspeed[i] +
              "km<br>　角度:" + Tkakudo[i] + "</div>";

            var myOptions = {
              content: boxText,
              disableAutoPan: false,
              maxWidth: 0,
              pixelOffset: new google.maps.Size(-105, -200),
              zIndex: null,
              boxStyle: {
                width: "210px"
              },
              closeBoxMargin: "10px 10px 2px 2px",
              closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
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
      if (DB_markersArray) {
        for (var i = 0; i < DB_markersArray.length; i++) {
          DB_markersArray[i].setMap(null);
        }
        DB_markersArray.length = 0;
      }
    }
  }





  // チェックボックスが true の時の処理 ----------------------------
  $(function() {
    $('#cb_gyosen').on('ifChecked', function(event) { //ブートフラットのプラグインの関係でゴリ押し
      $('#cb_ryokyaku').iCheck('uncheck');
      $('#cb_kamotu').iCheck('uncheck');
      $('#cb_kousoku').iCheck('uncheck');
      $('#cb_tannka').iCheck('uncheck');
      $('#cb_rezya').iCheck('uncheck');
      $('#cb_tag').iCheck('uncheck');
      $('#cb_others').iCheck('uncheck');
      $('#cb_minyuryoku').iCheck('uncheck');
      chkdisp(true, '漁船');
      Startflag = false;
    });
  });

  $(function() {
    $('#cb_ryokyaku').on('ifChecked', function(event) { //ブートフラットのプラグインの関係でゴリ押し
      $('#cb_gyosen').iCheck('uncheck');
      $('#cb_kamotu').iCheck('uncheck');
      $('#cb_kousoku').iCheck('uncheck');
      $('#cb_tannka').iCheck('uncheck');
      $('#cb_rezya').iCheck('uncheck');
      $('#cb_tag').iCheck('uncheck');
      $('#cb_others').iCheck('uncheck');
      $('#cb_minyuryoku').iCheck('uncheck');
      chkdisp(true, '旅客船');
      Startflag = false;
    });
  });

  $(function() {
    $('#cb_kamotu').on('ifChecked', function(event) { //ブートフラットのプラグインの関係でゴリ押し
      $('#cb_gyosen').iCheck('uncheck');
      $('#cb_ryokyaku').iCheck('uncheck');
      $('#cb_kousoku').iCheck('uncheck');
      $('#cb_tannka').iCheck('uncheck');
      $('#cb_rezya').iCheck('uncheck');
      $('#cb_tag').iCheck('uncheck');
      $('#cb_others').iCheck('uncheck');
      $('#cb_minyuryoku').iCheck('uncheck');
      chkdisp(true, '貨物船');
      Startflag = false;
    });
  });

  $(function() {
    $('#cb_kousoku').on('ifChecked', function(event) { //ブートフラットのプラグインの関係でゴリ押し
      $('#cb_gyosen').iCheck('uncheck');
      $('#cb_ryokyaku').iCheck('uncheck');
      $('#cb_kamotu').iCheck('uncheck');
      $('#cb_tannka').iCheck('uncheck');
      $('#cb_rezya').iCheck('uncheck');
      $('#cb_tag').iCheck('uncheck');
      $('#cb_others').iCheck('uncheck');
      $('#cb_minyuryoku').iCheck('uncheck');
      chkdisp(true, '高速船');
      Startflag = false;
    });
  });

  $(function() {
    $('#cb_tannka').on('ifChecked', function(event) { //ブートフラットのプラグインの関係でゴリ押し
      $('#cb_gyosen').iCheck('uncheck');
      $('#cb_ryokyaku').iCheck('uncheck');
      $('#cb_kamotu').iCheck('uncheck');
      $('#cb_kousoku').iCheck('uncheck');
      $('#cb_rezya').iCheck('uncheck');
      $('#cb_tag').iCheck('uncheck');
      $('#cb_others').iCheck('uncheck');
      $('#cb_minyuryoku').iCheck('uncheck');
      chkdisp(true, 'タンカー');
      Startflag = false;
    });
  });

  $(function() {
    $('#cb_rezya').on('ifChecked', function(event) { //ブートフラットのプラグインの関係でゴリ押し
      $('#cb_gyosen').iCheck('uncheck');
      $('#cb_ryokyaku').iCheck('uncheck');
      $('#cb_kamotu').iCheck('uncheck');
      $('#cb_kousoku').iCheck('uncheck');
      $('#cb_tannka').iCheck('uncheck');
      $('#cb_tag').iCheck('uncheck');
      $('#cb_others').iCheck('uncheck');
      $('#cb_minyuryoku').iCheck('uncheck');
      chkdisp(true, 'レジャー船');
      Startflag = false;
    });
  });

  $(function() {
    $('#cb_tag').on('ifChecked', function(event) { //ブートフラットのプラグインの関係でゴリ押し
      $('#cb_gyosen').iCheck('uncheck');
      $('#cb_ryokyaku').iCheck('uncheck');
      $('#cb_kamotu').iCheck('uncheck');
      $('#cb_kousoku').iCheck('uncheck');
      $('#cb_tannka').iCheck('uncheck');
      $('#cb_rezya').iCheck('uncheck');
      $('#cb_others').iCheck('uncheck');
      $('#cb_minyuryoku').iCheck('uncheck');
      chkdisp(true, 'タグ、パイロット船');
      Startflag = false;
    });
  });

  $(function() {
    $('#cb_others').on('ifChecked', function(event) { //ブートフラットのプラグインの関係でゴリ押し
      $('#cb_gyosen').iCheck('uncheck');
      $('#cb_ryokyaku').iCheck('uncheck');
      $('#cb_kamotu').iCheck('uncheck');
      $('#cb_kousoku').iCheck('uncheck');
      $('#cb_tannka').iCheck('uncheck');
      $('#cb_rezya').iCheck('uncheck');
      $('#cb_tag').iCheck('uncheck');
      $('#cb_minyuryoku').iCheck('uncheck');
      chkdisp(true, 'ヨット、その他');
      Startflag = false;
    });
  });

  $(function() {
    $('#cb_minyuryoku').on('ifChecked', function(event) { //ブートフラットのプラグインの関係でゴリ押し
      $('#cb_gyosen').iCheck('uncheck');
      $('#cb_ryokyaku').iCheck('uncheck');
      $('#cb_kamotu').iCheck('uncheck');
      $('#cb_kousoku').iCheck('uncheck');
      $('#cb_tannka').iCheck('uncheck');
      $('#cb_rezya').iCheck('uncheck');
      $('#cb_tag').iCheck('uncheck');
      $('#cb_others').iCheck('uncheck');
      chkdisp(true, '未入力');
      Startflag = false;
    });
  });




  // チェックボックスが false の時の処理 ----------------------------
  $(function() {
    $('#cb_gyosen').on('ifUnchecked', function(event) {
      chkdisp(false, '漁船');
      Startflag = true;
    });
  });



  $(function() {
    $('#cb_ryokyaku').on('ifUnchecked', function(event) {
      chkdisp(false, '旅客船');
      Startflag = true;
    });
  });

  $(function() {
    $('#cb_kamotu').on('ifUnchecked', function(event) {
      chkdisp(false, '貨物船');
      Startflag = true;
    });
  });

  $(function() {
    $('#cb_kousoku').on('ifUnchecked', function(event) {
      chkdisp(false, '高速船');
      Startflag = true;
    });
  });

  $(function() {
    $('#cb_tannka').on('ifUnchecked', function(event) {
      chkdisp(false, 'タンカー');
      Startflag = true;
    });
  });

  $(function() {
    $('#cb_rezya').on('ifUnchecked', function(event) {
      chkdisp(false, 'レジャー船');
      Startflag = true;
    });
  });

  $(function() {
    $('#cb_tag').on('ifUnchecked', function(event) {
      chkdisp(false, 'タグ、パイロット船');
      Startflag = true;
    });
  });

  $(function() {
    $('#cb_others').on('ifUnchecked', function(event) {
      chkdisp(false, 'ヨット、その他');
      Startflag = true;
    });
  });

  $(function() {
    $('#cb_minyuryoku').on('ifUnchecked', function(event) {
      chkdisp(false, '未入力');
      Startflag = true;
    });
  });


  /*-----------------------------------------------
   * ラジオボタンを押したときの処理
   *-----------------------------------------------*/
  $(function() {
    $('#radio-btn-group input[type=radio]').change(function() {
      //console.log(this.value);
      switch (this.value) {
        case "display":
          drawArray(markersArray);
          break;
        case "undisplay":
          eraseArray(markersArray);
          break;

        case "delete":
          deleteArray(markersArray);
          break;
        default:

      }
    });

  })
}
