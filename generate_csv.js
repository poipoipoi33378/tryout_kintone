(function () {
    "use strict";

    kintone.events.on('app.record.index.show', function (event) {
        if (event.viewName == "出力用一覧（当月&出力済除外）"){
            if (document.getElementById('my_index_button') !== null) {
                return;
            }
            // ボタン
            var myIndexButton = document.createElement('button');
            myIndexButton.id = 'my_index_button';
            myIndexButton.innerHTML = 'CSV出力';

            // ボタンクリック時の処理
            myIndexButton.onclick = function () {
                window.confirm('CSVを出力します');
            };
            // メニューの右側の空白部分にボタンを設置
            kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton);
        }
        console.log (event)
    });
})();
