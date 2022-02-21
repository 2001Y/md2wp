# Markdown file to WaordPress Converter

Hugo や Hexo などの Markdown ファイルを使った記事を WorddPress に移行する Node のコード。 WP REST API を使っている。完全に自分用なので好きに改変して使ってほしい。

以下の Front matter に対応している。ファイル名は slug に指定されている。

```markdown
---
title: "Demo Markdown"
date: 2021-03-07T01:00:22+09:00
categories: ["Demo", "Markdown"]
tags: ["Demo", "Markdown"]
draft: true
---
```

## 使い方

md フォルダ内に Markdown ファイルを配置して app.js を実行するだけ。

### 準備

```shell
# コードをダウンロード
git clone https://github.com/2001Y/md2wp.git
# 必要なライブラリをダウンロード
yarn
```

app.js を開いて、自分の環境に合わせる。

```js
// ▼ ▼ ▼ ▼ ▼ ▼ ▼  OPTION  ▼ ▼ ▼ ▼ ▼ ▼ ▼

const URL = "https://yoshikitam.wpx.jp/2001y/";
const WP_user = "2001Y"; //WPユーザー名
const WP_AppPass = "9Qx0 WFj6 Ih8Q OriT e1SY rDFp"; // Application Passwords

// ▲ ▲ ▲ ▲ ▲ ▲ ▲  OPTION  ▲ ▲ ▲ ▲ ▲ ▲ ▲
```

### 実行

```shell
node app
```

「移行 DONE」と出るまで待つ。
