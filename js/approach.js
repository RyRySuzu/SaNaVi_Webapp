/*-----------------------------------------------
 * 接近検知
 *-----------------------------------------------*/
function approach() {
    ScountT = 0;
    ScountF = 0;

    // var data = {
    //     ship_id: Lid,
    //     distance: approach_distance
    // }; //id取得

    var data = {
        ship_id: Lid,
    };

    $.ajax({
        type: 'post', // HTTPメソッド
        url: '//toba-sanavi.azurewebsites.net/PHP/getting_data_within20m_Azure.php',
        //url: '//toba-sanavi.azurewebsites.net/PHP/getting_data_approach_Azure.php',
        data: data, // POSTするデータ
        cache: false,
        dataType: 'json',
        success: function(data) { // 成功時の処理
            // 返却されたテキストをjavascriptのオブジェクトに変換
            // dataを見やすいように加工する

            for (var i in data) {
                approach[i] = parseFloat(data[i].approach);
                if (approach[i] == 0) {
                    //接近中
                    ScountT++;
                } else if (approach[i] == 1) {
                    ScountF++;
                }

            }

            if (ScountT != 0 && Approach_cancel_master_flag == false) {
                document.getElementById("approach").style.display = "block";
                //audio3.load();
                audio3.play();
                Aaudioflag = true;
                approachflag = true;
                approach_emergencyflag = true;
                //iosアプリ用
                location.href = 'appstart://foobar/';
            } else {
                document.getElementById("approach").style.display = "none";
                audio3.pause();　
                Aaudioflag = false;
                approachflag = false;
                approach_emergencyflag = false;
                //iosアプリ用
                location.href = 'appstop://foobar/';
            }

        }
    });


}
