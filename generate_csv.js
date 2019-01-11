(function () {
    "use strict";

    kintone.events.on('app.record.index.show', function (event) {

        //変数の定義
        var records = event.records;

        //csvの配列
        // var csv = [];

        if (event.viewName == "出力用一覧（当月&出力済除外）"){
            //ボタンの有無をチェック
            if (document.getElementById('my_index_button') !== null) {
                return;
            }
            // ボタン
            var myIndexButton = document.createElement('button');
            myIndexButton.id = 'my_index_button';
            myIndexButton.innerHTML = 'CSV出力';

            // メニューの右側の空白部分にボタンを設置
            kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton);

            // ボタンクリック時の処理
            myIndexButton.onclick = function () {
                window.confirm('CSVを出力します');
                console.log(event.records);
                var csv = getMakeCsv(records);
                downloadFile(csv);
            }; 
        }
    });
})();

           // //関連レコードを取得するxmlHttpリクエスト
            // function request(app_id, query) {
            //     var appUrl = kintone.api.url('/k/v1/records') + '?app=' + app_id + '&query=' + query;

            //     //xmlHttpリクエスト
            //     var xmlHttp = new XMLHttpRequest();
            //     xmlHttp.open('GET', appUrl, false);
            //     xmlHttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            //     xmlHttp.send(null);

            //     //取得したレコードをArrayに格納
            //     var respdata = JSON.parse(xmlHttp.responseText);

            //     //レスポンスデータを戻り値として返す
            //     return respdata;
            // }


//csvファイルの作成
function getMakeCsv(records) {
    console.log(records);
    //現在のレコード情報を取得
    var csv = [];
    csv += ['納税士チェック', '税金', '氏名', '費目', '内容', '金額', '日付', '\n'];//1行目の項目名は手動で設ける必要がある

    records.forEach(function (record) {
        // * 税理士チェック済み＆日付が前月＆CSV出力フラグがOFFのものを対象とする
        // * 出力したらCSV出力フラグをONにする
        // * CSVのフォーマットはshift - jisとする
        if (record.check_tax_accountant.value != '済') {
            return csv;
        }
        // if (record.output_csv.value != []) {
        //     return csv;
        // }
        var d = new Date();
        var MM = (d.getMonth() + 1);
        var month = Number(record.date.value.slice(5, 7))
        if ((month + 1)%12 != MM) {
            return csv;
        }

        var csv_line = record.check_tax_accountant.value + ',' +
            record.tax_type.value + ',' +
            record.name.value + ',' +
            record.cost_type.value + ',' +
            record.contents.value + ',' +
            record.amount_of_money.value + ',' +
            record.date.value + ',' + '\n';
        csv += csv_line;
    });

    return csv
}

//ダウンロード関数
function downloadFile(csv) {
    //ファイル名
    var filename = '経費データ' + getTimeStamp() + '.csv';

    //Blob準備
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    var blob = new Blob([bom, csv], { type: 'text/csv' });

    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        var url = (window.URL || window.webkitURL);
        var blobUrl = url.createObjectURL(blob);
        var e = document.createEvent('MouseEvents');
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
        a.href = blobUrl;
        a.download = filename;
        a.dispatchEvent(e);
    }
}

//ファイル名に付与する日付の取得
function getTimeStamp() {
    console.log("てすと");
    var d = new Date();
    var YYYY = d.getFullYear();
    var MM = (d.getMonth() + 1);
    var DD = d.getDate();
    var hh = d.getHours();
    var mm = d.getMinutes();
    if (MM < 10) { MM = '0' + MM; }
    if (DD < 10) { DD = '0' + DD; }
    if (hh < 10) { hh = '0' + hh; }
    else if (mm < 10) { mm = '0' + mm; }
    String();
    return '' + YYYY + MM + DD + hh + mm;
}

