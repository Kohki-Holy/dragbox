
type Corod = {
  left: string
  right: string
  current: Boolean
}

// 履歴の保存数
const maxLogSize = 10

const dragableArea = document.querySelector('.dragableArea') as HTMLElement

const dragableBox = document.querySelector('.dragableBox') as HTMLElement

// 操作履歴用配列
const corodLog: Array<Corod> = []

const onMouseDown = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  const domRectBox = target.getBoundingClientRect()
  // target要素のborder-widthを取得
  const borderWidth = parseInt(
    getComputedStyle(target).getPropertyValue('border-width')
  )

  // cssの初期化
  dragableBox.setAttribute(
    'style',
    `left:${domRectBox.left - borderWidth}px; right:auto;transform:none;`
  )

  // 初期座標
  const initialX = event.offsetX

  // mousemove コールバック関数
  const onMouseMove = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement
    const domRectArea = dragableArea.getBoundingClientRect()
    const domRectBox = target.getBoundingClientRect()
    // position 最大値
    const max = domRectArea.width - domRectBox.width - borderWidth * 2
    // 初期座標と現在座標との差分
    const diff = event.offsetX - initialX
    // 稼働後 position
    const left = domRectBox.left + diff

    // 稼働エリア制御
    if (left <= 0) {
      target.style.left = '0'
    } else if (left >= max) {
      target.style.left = 'auto'
      target.style.right = '0'
    } else {
      target.style.left = `${left}px`
      target.style.right = 'auto'
    }
  }

  // mouseup コールバック関数
  const onMouseUp = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement
    for (let i = 0, len = corodLog.length; i < len; i++) {
      if (corodLog[i].current) {
        corodLog[i] = { ...corodLog[i], current: false }
        // undoで操作を戻していたらそこ以前の動作を上書き削除
        corodLog.splice(0, i)
        break
      }
    }
    // 座標記録用オブジェクト
    const corod = {
      left: target.style.left,
      right: target.style.right,
      current: true,
    }
    // 先頭に追加
    corodLog.unshift(corod)
    // 履歴が一定個数以上で削除
    if (corodLog.length > maxLogSize) {
      corodLog.pop()
    }
    // イベント除去
    target.removeEventListener('mousemove', onMouseMove)
    dragableBox.removeEventListener('mouseup', onMouseUp)
  }

  // イベント追加
  target.addEventListener('mousemove', onMouseMove)
  dragableBox.addEventListener('mouseup', onMouseUp)

  // イベント除去
  dragableBox.addEventListener('mousedown', onMouseDown)
}

// イベント追加
dragableBox.addEventListener('mousedown', onMouseDown)

const onKeyDown = (event: KeyboardEvent) => {
  // 元に戻す
  const undo = () => {
    for (let i = 0, len = corodLog.length; i < len; i++) {
      if (corodLog[i].current && i + 1 < len) {
        corodLog[i] = { ...corodLog[i], current: false }
        // 座標更新処理
        dragableBox.style.left = corodLog[i + 1].left
        dragableBox.style.right = corodLog[i + 1].right
        corodLog[i + 1] = { ...corodLog[i + 1], current: true }
        break
      }
    }
  }

  // やり直し
  const redo = () => {
    for (let i = 0, len = corodLog.length; i < len; i++) {
      if (corodLog[i].current && i - 1 >= 0) {
        corodLog[i] = { ...corodLog[i], current: false }
        // 座標更新処理
        dragableBox.style.left = corodLog[i - 1].left
        dragableBox.style.right = corodLog[i - 1].right
        corodLog[i - 1] = { ...corodLog[i - 1], current: true }
        break
      }
    }
  }

  // [Ctrl + Z]でもとに戻す
  if (event.ctrlKey && event.key === 'z') {
    undo()
    // [Ctrl + Y]でやり直し
  } else if (event.ctrlKey && event.key === 'y') {
    redo()
  }

  // イベント除去
  window.removeEventListener('keydown', onKeyDown)
}

// イベント追加
window.addEventListener('keydown', onKeyDown)
