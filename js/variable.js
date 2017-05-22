    var DB_markersArray = [];
    var search_markersArray = [];
    var Type_markersArray = [];
    var sounan_circleArray = [];

    var S_ship = []; //プロパティ用
    var T_ship = []; //プロパティ用
    var D_ship = []; //プロパティ用
    var update_information = []; //プロパティ用

    var Tpic = [];
    var Tflag = new Boolean(false); //接近検知 flag

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

    var approach = []; //接近検知 approach
    var approachflag = new Boolean(false); //接近検知 flag
    var approach_emergencyflag = new Boolean(false); //接近検知 flag
    var Aaudioflag = new Boolean(false); //接近検知 音 flaｇ

    var points = []; //航跡表示線

    var scale = 0; //APIの大型船か、DBの小型船かの判別

    var login_id; //ログインid
    var login_check;
    var Lid = 111111111; //ログインid取得するやつ　初期値111111

    var update_information_string = new String();　//update情報

    var ScountF = 0;
    var ScountT = 0;
    var EcountF = 0;
    var EcountT = 0;
    var positiondata;
    var timer1;
    var geocoder;
    var myLatlng;
    var latlngsea;
    var map;
    var poly = null;
    var latitude = 0;
    var longitude = 0;
    var direction = 0;
    var speed = 0;
    var accele_x = 0;
    var accele_y = 0;
    var accele_z = 0;
    var offline_time = "";
    var approach_distance = 0;
    var online_count = 0;
    var infowindow_count = 0;

    var EcountT_100 = new Boolean(false); //100キロ圏内かどうか　
    var Musicflag = new Boolean(false); //接近検知 音 flag
    var Startflag = new Boolean(false); //スタートするかどうか
    var agreement_to_terms_flag = new Boolean(false); //スタートするかどうか
    var mapflag = new Boolean(false); //mapの現在位置のfalg
    var Connect_flag = new Boolean(true); //オンラインオフラインの処理
    var Approach_cancel_flag = new Boolean(true); //接近検知キャンセル
    var Approach_cancel_master_flag = new Boolean(false); //接近検知キャンセル
    var send_flag = new Boolean(true); //オフラインからオンラインに戻った時のフラグ
    var Shiptype_flag = new Boolean(false); //スタートするかどうか

    /*-----------------------------------------------
     * プロパティを組む
     *-----------------------------------------------*/

    function Ship_data(_lat, _lon, _ship_name, _ship_id, _direction, _speed, _compass, _time, _ship_type) {
        this.lat = _lat;
        this.lon = _lon;
        this.ship_name = _ship_name;
        this.ship_id = _ship_id;
        this.direction = _direction;
        this.speed = _speed;
        this.compass = _compass;
        this.time = _time;
        this.ship_type = _ship_type;
        //console.log('Speed : %s', this.speed);
    }

    function Get_Ship_data(_lat, _lon, _ship_name, _ship_id, _direction, _speed, _compass, _time, _ship_type, _ship_state, _online_distinction) {
        this.lat = _lat;
        this.lon = _lon;
        this.ship_name = _ship_name;
        this.ship_id = _ship_id;
        this.direction = _direction;
        this.speed = _speed;
        this.compass = _compass;
        this.time = _time;
        this.ship_type = _ship_type;
        this.ship_state = _ship_state;
        this.online_distinction = _online_distinction;
        //console.log('Speed : %s', this.speed);
    }

    function Update_information(_information, _update_flag, _ship_name, _ship_id, _ship_type, _E_mail) {
        this.information = _information;
        this.update_flag = _update_flag;
        this.ship_name = _ship_name;
        this.ship_id = _ship_id;
        this.ship_type = _ship_type;
        this.E_mail = _E_mail;
        //console.log('Speed : %s', this.speed);
    }
