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
var maxHistorySize = 10;
var draggableArea = document.querySelector('.draggableArea');
var draggableBox = document.querySelector('.draggableBox');
// 操作履歴用配列
var histories = [{
        left: '0px',
        top: '0px',
        current: true
    }];
var onMouseDown = function (event) {
    // target要素のborder-widthを取得
    var borderWidth = draggableBox.offsetWidth - draggableBox.clientWidth;
    var borderHeight = draggableBox.offsetHeight - draggableBox.clientHeight;
    // 初期座標
    var initialX = event.pageX - draggableBox.offsetLeft;
    var initialY = event.pageY - draggableBox.offsetTop;
    // mousemove コールバック関数
    var onMouseMove = function (event) {
        var domRectArea = draggableArea.getBoundingClientRect();
        var domRectBox = draggableBox.getBoundingClientRect();
        // position 最大値
        var positionLeftMax = domRectArea.width - domRectBox.width - borderWidth;
        var positionTopMax = domRectArea.height - domRectBox.height - borderHeight;
        // 稼働後 position left
        var draggedPositionLeft = event.pageX - initialX;
        var draggedPositionTop = event.pageY - initialY;
        // 上下稼働エリア制御
        if (draggedPositionTop <= 0) {
            draggableBox.style.top = '0';
        }
        else if (draggedPositionTop >= positionTopMax) {
            draggableBox.style.top = positionTopMax + "px";
        }
        else {
            draggableBox.style.top = draggedPositionTop + "px";
        }
        // 左右稼働エリア制御
        if (draggedPositionLeft <= 0) {
            draggableBox.style.left = '0';
        }
        else if (draggedPositionLeft >= positionLeftMax) {
            draggableBox.style.left = positionLeftMax + "px";
        }
        else {
            draggableBox.style.left = draggedPositionLeft + "px";
        }
    };
    // mouseup コールバック関数
    var onMouseUp = function () {
        // 履歴配列の現在参照している座標のindexを取得
        // @ts-ignore
        var index = histories.findIndex(function (history) { return history.current; });
        if (histories[index].current) {
            histories[index] = __assign(__assign({}, histories[index]), { current: false });
            // undo で操作を戻していたらそこ以前の動作を上書き削除
            histories.splice(0, index);
        }
        // 座標記録用オブジェクト
        var corod = {
            left: draggableBox.style.left,
            top: draggableBox.style.top,
            current: true
        };
        // 先頭に追加
        histories.unshift(corod);
        // 履歴が一定個数以上で削除
        if (histories.length > maxHistorySize) {
            histories.pop();
        }
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
};
// イベントリスナー追加
draggableBox.addEventListener('mousedown', onMouseDown);
var onKeyDown = function (event) {
    var historyAction = function (action) {
        // 変更先の配列 index を返す関数
        var findAction = function () {
            // @ts-ignore
            var index = histories.findIndex(function (history) { return history.current; });
            histories[index].current = false;
            if (action === 'undo' && index + 1 < histories.length) {
                return index + 1;
            }
            else if (action === 'redo' && index - 1 >= 0) {
                return index - 1;
            }
            else {
                return index;
            }
        };
        var index = findAction();
        // 座標更新処理
        draggableBox.style.left = histories[index].left;
        draggableBox.style.top = histories[index].top;
        histories[index] = __assign(__assign({}, histories[index]), { current: true });
    };
    // [Ctrl + Z]でもとに戻す
    if (event.ctrlKey && event.key === 'z') {
        historyAction('undo');
        // [Ctrl + Y]でやり直し
    }
    else if (event.ctrlKey && event.key === 'y') {
        historyAction('redo');
    }
};
// イベントリスナー追加
window.addEventListener('keydown', onKeyDown);
