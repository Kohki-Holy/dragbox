
type HistoryType = {
  left: string
  top: string
  current: Boolean
}

// 履歴の保存数
const maxHistorySize = 10

const draggableArea = document.querySelector('.draggableArea') as HTMLElement

const draggableBox = document.querySelector('.draggableBox') as HTMLElement

// 操作履歴用配列
const histories: Array<HistoryType> = [
  {
    left: '0px',
    top: '0px',
    current: true,
  },
]

const onMouseDown = (event: MouseEvent) => {
  // target要素のborder-widthを取得
  const borderWidth = draggableBox.offsetWidth - draggableBox.clientWidth
  const borderHeight = draggableBox.offsetHeight - draggableBox.clientHeight

  // 初期座標
  const initialX = event.pageX - draggableBox.offsetLeft
  const initialY = event.pageY - draggableBox.offsetTop

  // mousemove コールバック関数
  const onMouseMove = (event: MouseEvent) => {
    const domRectArea = draggableArea.getBoundingClientRect()
    const domRectBox = draggableBox.getBoundingClientRect()

    // position 最大値
    const positionLeftMax = domRectArea.width - domRectBox.width - borderWidth
    const positionTopMax =
      domRectArea.height - domRectBox.height - borderHeight

    // 稼働後 position left
    const draggedPositionLeft = event.pageX - initialX
    const draggedPositionTop = event.pageY - initialY

    // 上下稼働エリア制御
    if (draggedPositionTop <= 0) {
      draggableBox.style.top = '0'
    } else if (draggedPositionTop >= positionTopMax) {
      draggableBox.style.top = `${positionTopMax}px`
    } else {
      draggableBox.style.top = `${draggedPositionTop}px`
    }

    // 左右稼働エリア制御
    if (draggedPositionLeft <= 0) {
      draggableBox.style.left = '0'
    } else if (draggedPositionLeft >= positionLeftMax) {
      draggableBox.style.left = `${positionLeftMax}px`
    } else {
      draggableBox.style.left = `${draggedPositionLeft}px`
    }
  }

  // mouseup コールバック関数
  const onMouseUp = () => {
    // 履歴配列の現在参照している座標のindexを取得
    // @ts-ignore
    const index = histories.findIndex((history) => history.current)
    if (histories[index].current) {
      histories[index] = { ...histories[index], current: false }
      // undo で操作を戻していたらそこ以前の動作を上書き削除
      histories.splice(0, index)
    }
    // 座標記録用オブジェクト
    const corod = {
      left: draggableBox.style.left,
      top: draggableBox.style.top,
      current: true,
    }
    // 先頭に追加
    histories.unshift(corod)
    // 履歴が一定個数以上で削除
    if (histories.length > maxHistorySize) {
      histories.pop()
    }
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

// イベントリスナー追加
draggableBox.addEventListener('mousedown', onMouseDown)

const onKeyDown = (event: KeyboardEvent) => {
  const historyAction = (action: string) => {
    // 変更先の配列 index を返す関数
    const findAction = (): number => {
      // findIndexが認識されないようなので（tsconfigの設定の影響と思われる）
      // @ts-ignore
      const index = histories.findIndex((history) => history.current)
      histories[index].current = false
      if (action === 'undo' && index + 1 < histories.length) {
        return index + 1
      } else if (action === 'redo' && index - 1 >= 0) {
        return index - 1
      } else {
        return index
      }
    }

    const index = findAction()

    // 座標更新処理
    draggableBox.style.left = histories[index].left
    draggableBox.style.top = histories[index].top
    histories[index] = { ...histories[index], current: true }
  }

  // [Ctrl + Z]でもとに戻す
  if (event.ctrlKey && event.key === 'z') {
    historyAction('undo')
    // [Ctrl + Y]でやり直し
  } else if (event.ctrlKey && event.key === 'y') {
    historyAction('redo')
  }
}

// イベントリスナー追加
window.addEventListener('keydown', onKeyDown)
