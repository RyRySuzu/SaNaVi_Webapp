  // ロード時の処理
  $(window).load(function() {
      $('#div-modal').modal('show');
      var loadBtn = document.getElementById('buttonaudio');
      loadBtn.addEventListener('click', function() {
          Startflag = true;// 情報送信開始
          agreement_to_terms_flag = true;// 利用規約に同意した
          audio3.load();
          //map.checkResize();
          mapResize();
          // $('#div-modal').modal('hide')
          // $('#modale').modal('show');
      });
  });

  // ブラウザバックしてきた時にページを開き直す
  window.onpageshow = function(evt) {
  if (evt.persisted) {
  location.reload();
  }
  };


  // mapのリサイズ
  function mapResize() {
      var divObj = document.getElementById("map_canvas");
      google.maps.event.trigger(map_canvas, "resize");
  }

  // モーダルウィンドウを消す
  $("#myTab1 a").click(function(e) {
      //e.preventDefault()
      e.stopPropagation();
      $(this).tab('show');
  });

  $("#return_map").click(function() {
      mapflag = false;
      map.setCenter(myLatlng);
      document.getElementById("return_map").style.display = "none";
  })

  $("#return_map_nowposition").click(function() {
      mapflag = false;
      map.setCenter(myLatlng);
      document.getElementById("return_map_nowposition").style.display = "none";
  })

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
             * DBmarkersの配列を削除する処理
             *-----------------------------------------------*/
            　
            function deleteArrayDB(arrayData) {
                for (var i = 0; i < arrayData.length; i++) {
                    arrayData[i].marker.setMap(null);
                    arrayData[i].infoWindow.setMap(null);
                arrayData.length = 0;
                return arrayData;
                }
             }

            /*-----------------------------------------------
             * DBmarkersの配列を削除する処理
             *-----------------------------------------------*/
            　
            function deleteArrayDB2(arrayData) {
                for (var i = 0; i < arrayData.length; i++) {
                    arrayData[i].infoWindow.setMap(null);
                }
                arrayData.length = 0;
                return arrayData;
            }

            /*-----------------------------------------------
             * points配列の初期化
             *-----------------------------------------------*/

            function deletepoints() {
                points = [];
            }

            /*-----------------------------------------------
             * polylineの初期化
             *-----------------------------------------------*/

            function deletepoly() {
                points = [];
                if (poly) {
                    poly.setMap(null);
                }
            }

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
