# デモページ
URL: https://kohki-holy.github.io/dragbox/

# 概要
React/Vue.js等のフレームワークやライブラリは使用せず、es2015+またはTypeScriptで記述してください。  
Webpack自体やwebpack-dev-serverは、自由にご活用ください。

(1)  
下記のHTMLにおいて、.movable-area(仮)をbodyに対してCSSで「幅はbodyの80%、位置は横中央」に固定させ(縦は100%の高さで構わない)、 .draggable-rectangle(仮)をマウスドラッグで .movable-area(仮)内でだけ移動できる(はみ出させようとしても、それ以上はその方向に動かない)ようにしてください(「ウィンドウがリサイズされた場合」の考慮は不要です)。  
あらゆる要素は(先述のclass名(仮)も含め)、自由に命名してください。

(2)  
(1) が動くようになった場合はさらに「.draggable-rectangle(仮)がドロップされる(マウスドラッグをやめる)度にその位置情報を履歴として保持(そのページ内のJavaScriptにおける配列やJSONに)」し、

- WindowsであればCtrl + z、MacであればCommand + z でアンドゥ
- WindowsであればCtrl + y、MacであればCommand + y でリドゥ

ができるようにしてください(手持ちのいずれか一方のOSへの対応だけで結構です)。

```html
<body>
	<div class="movable-area(仮)">
		<div class="draggable-rectangle(仮)"></div>
	</div>
</body>
```

# 対応ブラウザ
- Google Chrome