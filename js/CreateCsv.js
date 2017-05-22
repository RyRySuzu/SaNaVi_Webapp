function CreateCsv() {

          var Rdata = {
            ship_id: $("#register_id").val()
          };

                $.ajax({
                  type: 'post', // HTTPメソッド
                  url: '//toba-sanavi.azurewebsites.net/PHP/csv.php',
                  data: Rdata, // POSTするデータ
                  cache: false,
                  dataType: 'json',
                    success: function(data) {

                    }
                });

                setTimeout("DownloadCsv()", 2000);

}

function DownloadCsv(){
  var elem = document.createElement("a");
  elem.download = "export.csv";
  elem.href = "//toba-sanavi.azurewebsites.net/PHP/export.csv";
  elem.click();
}
