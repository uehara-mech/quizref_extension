abcフォーマットでのクイズの出典表記を補助してくれるchrome拡張

## 機能

- Amazonからの書籍情報取得
- コトバンクからの情報取得
- 一般のWebページからの情報取得
- 新聞記事・一般の事典/辞書の出典表記支援

## インストール方法

1. クローン

  ```
  git clone https://github.com/uehara-mech/quizref_extension.git
  ```

2. Chrome拡張機能の設定を開きます．
  <img src="https://github.com/uehara-mech/quizref_extension/blob/image/img/chrome.png?raw=true" width="500px">

3. **デベロッパーモード**にチェックを入れ，**パッケージ化されていない拡張機能を読み込む** ボタンを押し， `quizref_extension/extension` ディレクトリを選択します.

  ![chrome2](https://github.com/uehara-mech/quizref_extension/blob/image/img/chrome_2.png?raw=true)

## 使い方

### Amazonからの書籍情報取得
1. Amazonで該当する書籍のページを開きます．
1. 拡張機能を起動し，リストから「書籍」を選択します．

  ![amazon1](https://github.com/uehara-mech/quizref_extension/blob/image/img/amazon1.png?raw=true)

3. 「情報取得」ボタンを押すと，取得された情報が表示されます．

  ![amazon2](https://github.com/uehara-mech/quizref_extension/blob/image/img/amazon2.png?raw=true)

4. 「表示」ボタンを押すと，下のボックスに，abcフォーマットの引用が表示されます．なお，「コピー」ボタンを押すと，クリップボードにコピーされます．

### コトバンクからの引用
1. コトバンクで，該当するページを開きます．
1. 拡張機能を起動し，リストから「コトバンク」を選択します．

  ![kotobank1](https://github.com/uehara-mech/quizref_extension/blob/image/img/kotobank1.png?raw=true)

1. 「情報取得」ボタンを押すと，取得された情報が表示されます．また，コトバンク中のどの辞書を参照したのか，選択します．

  <img src="https://github.com/uehara-mech/quizref_extension/blob/image/img/kotobank2.png?raw=true" width="500px">
  <img src="https://github.com/uehara-mech/quizref_extension/blob/image/img/kotobank3.png?raw=true" width="500px">

1. 「表示」ボタンを押すと，下のボックスに，abcフォーマットの引用が表示されます．なお，「コピー」ボタンを押すと，クリップボードにコピーされます．

### 一般のWebページからの情報取得
1. 該当するページを開きます．
1. 拡張機能を起動し，リストから「Webページ」を選択します．
1. 「情報取得」ボタンを押すと，取得された情報が表示されます．「表示」ボタンを押すと，下のボックスに，abcフォーマットの引用が表示されます．なお，「コピー」ボタンを押すと，クリップボードにコピーされます．

  ![web1](https://github.com/uehara-mech/quizref_extension/blob/image/img/web1.png?raw=true)


### 新聞，事典・辞書
その他，一般の新聞や，事典・辞書について，項目を埋めるだけで簡単にabcフォーマットの引用を作成することができます．

![other](https://github.com/uehara-mech/quizref_extension/blob/image/img/other.png?raw=true)

また，同一の文献から複数の出典表記を行いたい場合向けに，一度作成した引用をテンプレートとして保存し，使い回す機能があります．
1. 例えば，『広辞苑』を出典とする複数の作問を行う場合を考えます．この時，共通する項目を埋めた状態で，「保存」ボタンの隣にテンプレートのタイトルを入力し，「保存」ボタンを押します．

  <img src="https://github.com/uehara-mech/quizref_extension/blob/image/img/template1.png?raw=true" width="500px">

1. テンプレートが保存され，項目リストに追加した項目が現れます．
  <img src="https://github.com/uehara-mech/quizref_extension/blob/image/img/template2.png?raw=true" width="500px">

1. 追加された項目を選択すると，先程入力していた項目が引き継がれていることがわかると思います．なお，「削除」ボタンを押すことで，追加した項目を削除することもできます．
  <img src="https://github.com/uehara-mech/quizref_extension/blob/image/img/template3.png?raw=true" width="500px">
