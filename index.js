var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// 履歴の保存数
var maxLogSize = 10;
var dragableArea = document.querySelector('.dragableArea');
var dragableBox = document.querySelector('.dragableBox');
var corodLog = [];
dragableBox.addEventListener('mousedown', function (event) {
    var target = event.currentTarget;
    var domRectBox = target.getBoundingClientRect();
    // target要素のborder-widthを取得
    var borderWidth = parseInt(getComputedStyle(target).getPropertyValue("border-width"));
    // cssの初期化
    dragableBox.setAttribute('style', "left:" + (domRectBox.left - borderWidth) + "px; right:auto;transform:none;");
    // 初期座標
    var initialX = event.offsetX;
    // mousemove コールバック関数
    var onMouseMove = function (event) {
        var target = event.currentTarget;
        var domRectArea = dragableArea.getBoundingClientRect();
        var domRectBox = target.getBoundingClientRect();
        // position 最大値
        var max = domRectArea.width - domRectBox.width - borderWidth * 2;
        // 初期座標と現在座標との差分
        var diff = event.offsetX - initialX;
        // 稼働後 position
        var left = domRectBox.left + diff;
        // 稼働エリア制御
        if (left <= 0) {
            target.style.left = '0';
        }
        else if (left >= max) {
            target.style.left = 'auto';
            target.style.right = '0';
        }
        else {
            target.style.left = left + "px";
            target.style.right = 'auto';
        }
    };
    var onMouseUp = function (event) {
        var target = event.currentTarget;
        for (var i = 0, len = corodLog.length; i < len; i++) {
            if (corodLog[i].current) {
                corodLog[i] = __assign(__assign({}, corodLog[i]), { current: false });
                corodLog.splice(0, i);
                break;
            }
        }
        var corod = {
            left: target.style.left,
            right: target.style.right,
            current: true
        };
        // 先頭に追加
        corodLog.unshift(corod);
        // 履歴が一定個数以上で削除
        if (corodLog.length > maxLogSize) {
            corodLog.pop();
        }
        console.log(corodLog);
        // イベント除去
        target.removeEventListener('mousemove', onMouseMove);
        dragableBox.removeEventListener('mouseup', onMouseUp);
    };
    // イベント追加
    target.addEventListener('mousemove', onMouseMove);
    dragableBox.addEventListener('mouseup', onMouseUp);
});
window.addEventListener('keydown', function (event) {
    // 元に戻す
    var undo = function () {
        for (var i = 0, len = corodLog.length; i < len; i++) {
            if (corodLog[i].current && i + 1 < len) {
                corodLog[i] = __assign(__assign({}, corodLog[i]), { current: false });
                dragableBox.style.left = corodLog[i + 1].left;
                dragableBox.style.right = corodLog[i + 1].right;
                corodLog[i + 1] = __assign(__assign({}, corodLog[i + 1]), { current: true });
                break;
            }
        }
    };
    // やり直し
    var redo = function () {
        for (var i = 0, len = corodLog.length; i < len; i++) {
            if (corodLog[i].current && i - 1 >= 0) {
                corodLog[i] = __assign(__assign({}, corodLog[i]), { current: false });
                dragableBox.style.left = corodLog[i - 1].left;
                dragableBox.style.right = corodLog[i - 1].right;
                corodLog[i - 1] = __assign(__assign({}, corodLog[i - 1]), { current: true });
                break;
            }
        }
    };
    // [Ctrl + Z]でもとに戻す
    if (event.ctrlKey && event.key === 'z') {
        undo();
        // [Ctrl + Y]でやり直し
    }
    else if (event.ctrlKey && event.key === 'y') {
        redo();
    }
});
