# <img src="public/icons/icon_48.png" width="45" align="left"> Xakuro Phish-Chekcer

Xakuro Pshish-Checker

## 利用環境
- Google Chrome
- 利用OSにおける **Node.js** のインストール

## 概要

- この拡張機能は、Chrome (version 105.0.5195.127) において動作を確認しております。
- この拡張機能は、次のような場合に有効に活用いただけます。
  - フィッシングサイトと思われるWebページの簡易的な判定
  - フィッシングサイトと思われるWebページの情報収集・詳細分析

- 具体的に、次のような操作を行うことができます。
  - AbuseIPDBを利用したアクセス中のWebサイトの危険度判定
  - アクセス中のWebサイトの情報（URL/ドメイン/各種分析結果）の保存・ダウンロード

## インストール手順

1. .zipファイルとしてダウンロード
2. .zipファイルを解凍
3. 親ディレクトリにて、以下を実行
  ```
  npm install
  ```
5. [AbuseIPDB](https://www.abuseipdb.com/) よりAPIキーを取得
  1. 画面右上の「Sign up」からユーザ登録
  2. 自分のユーザページの「API」タブへ移動
  3. 「Keys」より「Create Key」を行い、発行されたAPIキーをコピー
6.  親ディレクトリにて、「.env」ファイルを作成し、以下のように記述
  ```
  API_KEY="[YOUR AbuseIPDB API KEY]"
  ```
7. 親ディレクトリにて、以下を実行
  ```
  npm run build
  ```
9. 新たに作成された「build」ディレクトリをChromeにインポート
  1. Chromeを起動し、アドレスバーに以下を入力
  ```
  chrome://extensions
  ```
8. 画面右上の「デペロッパーモード」を有効化
9. 画面右上の「パッケージ化されていない拡張機能を読み込む」より、「build」をインポート

---

This project was bootstrapped with [Chrome Extension CLI](https://github.com/dutiyesh/chrome-extension-cli)
