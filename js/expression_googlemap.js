// マップのオプション
var myOptions = {
    zoom: 13,// 1km先まで見られるようにする
    mapTypeIds: google.maps.MapTypeId.ROADMAP
}

// マップの表示
map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
// ジオコーダー
geocoder = new google.maps.Geocoder();
// 位置情報取得のオプション
var position_options = {
    enableHighAccuracy: true
};

// 現在位置情報を取得
navigator.geolocation.watchPosition(monitor, null, position_options);


// 位置情報取得成功時の処理
function monitor(position) {

    myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    if (mapflag == false) {
        map.setCenter(myLatlng);
    }


    // 緯度
    latitude = position.coords.latitude;
    // 経度
    longitude = position.coords.longitude;

    direction = position.coords.heading;

    speed = position.coords.speed;

    // 1桁の数字を0埋めで2桁にする
    var toDoubleDigits = function(num) {
        num += "";
        if (num.length === 1) {
            num = "0" + num;
        }
        return num;
    };

    var DD = new Date();
    DD.setMinutes(DD.getMinutes());
    var yyyy = DD.getFullYear();
    var mm = toDoubleDigits(DD.getMonth() + 1);
    var dd = toDoubleDigits(DD.getDate());
    var Hours = DD.getHours();
    var Minutes = toDoubleDigits(DD.getMinutes());
    var Seconds = toDoubleDigits(DD.getSeconds());

    offline_time = yyyy + "/" + mm + "/" + dd + " " + Hours + ":" + Minutes + ":" + Seconds;

    window.addEventListener("devicemotion", function(event) {
        accele_x = event.accelerationIncludingGravity.x;
        accele_y = event.accelerationIncludingGravity.y;
        accele_z = event.accelerationIncludingGravity.z;
    });

    positiondata = {
        ship_id: Lid,
        lat: latitude,
        lon: longitude,
        direction: direction,
        speed: speed,
        time: offline_time,
        accele_x: accele_x,
        accele_y: accele_y,
        accele_z: accele_z
    };
}

// googlemapのスワイプを検知する
$(function() {
  $('#map_canvas').on('touchstart', onTouchStart); //指が触れたか検知
  $('#map_canvas').on('touchmove', onTouchMove); //指が動いたか検知
  $('#map_canvas').on('touchend', onTouchEnd); //指が離れたか検知
  var direction, position;

  //スワイプ開始時の横方向の座標を格納
  function onTouchStart(event) {
    position = getPosition(event);
    direction = ''; //一度リセットする
  }

  //スワイプの方向（left／right）を取得
  function onTouchMove(event) {
    if (position - getPosition(event) > 55　|| position - getPosition(event) < -55) { // 70px以上移動しなければスワイプと判断しない
      direction = 'move'; //動きを検知
    }
  }

  function onTouchEnd(event) {
    if (direction == 'move'){
       console.log('スワイプを検知しました');
       mapflag = true;
       document.getElementById("return_map_nowposition").style.display = "block";
    }
  }

  //横方向の座標を取得
  function getPosition(event) {
    return event.originalEvent.touches[0].pageX;
  }
});
