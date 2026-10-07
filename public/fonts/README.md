# 見出し用フォント

`festival-mincho-bold.woff2`は、しっぽり明朝 Boldのサイト用サブセットです。
キャッチコピー、大見出し、テーマ・メイン企画の見出しに使用し、本文と操作部品には端末標準ゴシックを使います。
配信容量は125,684バイト。サイト内から読み込み、Google Fonts等へ来場者のブラウザーから通信しません。
`font-display: swap`で本文表示を待たせず、未収録文字には端末の明朝体を使います。

原著作権：Copyright 2021 The Shippori Mincho Project Authors。
[Google Fonts公式配布](https://github.com/google/fonts/tree/main/ofl/shipporimincho)から2026-10-08に取得。
ライセンスは同梱の`OFL-ShipporiMincho.txt`（SIL Open Font License 1.1）。
変更点は使用文字への絞り込み、WOFF2変換、内部名をFestival Minchoに変更したことです。改変フォントもOFL 1.1で配布します。
原TTFのSHA-256：`63bc4eddc74793f671c3ab827c5175e773ffbe569d0bf50ee65375ea9e3bc286`。

## 再生成

通常のビルドにはPythonやフォントのダウンロードは不要です。
見出しに未収録の文字を追加した場合、原TTFとライセンスを公式配布から取得して再生成します。
原TTFは`tmp/fonts/ShipporiMincho-Bold.ttf`に保存し、チェックサムが異なる場合は取得版を確認してください。

```sh
python3 -m venv tmp/fonts/venv
tmp/fonts/venv/bin/pip install 'fonttools[woff]==4.66.1' 'brotli==1.2.0'
tmp/fonts/venv/bin/python scripts/prepare-fonts.py
```

スクリプトは`src/`のTSX・JSONの文字と印字可能ASCIIを収録します。公開用ファイル・ライセンス・この説明をセットで管理します。
