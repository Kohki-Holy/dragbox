type Corod = {
  left: string,
  right: string,
  current: Boolean
}

// 履歴の保存数
const maxLogSize = 10

const dragableArea = document.querySelector('.dragableArea') as HTMLElement

const dragableBox = document.querySelector('.dragableBox') as HTMLElement

const corodLog :Array<Corod> = []

dragableBox.addEventListener('mousedown', ( event ) => {
  const target = event.currentTarget as HTMLElement
  const domRectBox = target.getBoundingClientRect()
  // target要素のborder-widthを取得
  const borderWidth = parseInt( getComputedStyle( target ).getPropertyValue( "border-width" ) )

  // cssの初期化
  dragableBox.setAttribute('style', `left:${domRectBox.left - borderWidth }px; right:auto;transform:none;`)

  // 初期座標
  const initialX = event.offsetX

  // mousemove コールバック関数
  const onMouseMove = ( event :MouseEvent ) => {
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
    if( left <= 0){
      target.style.left = '0'
    } else if(left >= max) {
      target.style.left = 'auto'
      target.style.right = '0'
    } else {
      target.style.left = `${left}px`
      target.style.right = 'auto'
    }
  }

  const onMouseUp = ( event :MouseEvent ) => {
    const target = event.currentTarget as HTMLElement
    for( let i = 0, len = corodLog.length; i < len; i++) {
      if( corodLog[i].current ){
        corodLog[i] = { ...corodLog[i], current: false }
        corodLog.splice(0, i)
        break
      }
    }
    const corod = {
      left: target.style.left,
      right: target.style.right,
      current: true
    }
    // 先頭に追加
    corodLog.unshift( corod )
    // 履歴が一定個数以上で削除
    if( corodLog.length > maxLogSize ){
      corodLog.pop()
    }
    console.log( corodLog )
    // イベント除去
    target.removeEventListener('mousemove', onMouseMove )
    dragableBox.removeEventListener('mouseup', onMouseUp )
  }

  // イベント追加
  target.addEventListener('mousemove', onMouseMove )
  dragableBox.addEventListener('mouseup', onMouseUp )
})

window.addEventListener('keydown', ( event ) => {

  // 元に戻す
  const undo = () => {
    for( let i = 0, len = corodLog.length; i < len; i++) {
      if( corodLog[i].current && i + 1 < len ){
        corodLog[i] = { ...corodLog[i], current: false }
        dragableBox.style.left = corodLog[i + 1].left
        dragableBox.style.right = corodLog[i + 1].right
        corodLog[i + 1] = { ...corodLog[i + 1], current: true }
        break
      }
    }
  }

  // やり直し
  const redo = () => {
    for( let i = 0, len = corodLog.length; i < len; i++) {
      if( corodLog[i].current && i - 1 >= 0 ){
        corodLog[i] = { ...corodLog[i], current: false }
        dragableBox.style.left = corodLog[i - 1].left
        dragableBox.style.right = corodLog[i - 1].right
        corodLog[i - 1] = { ...corodLog[i - 1], current: true }
        break
      }
    }
  }

  // [Ctrl + Z]でもとに戻す
  if (event.ctrlKey && event.key === 'z' ) {
    undo()
  // [Ctrl + Y]でやり直し
  } else if (event.ctrlKey && event.key === 'y' ) {
    redo()
  }
})
