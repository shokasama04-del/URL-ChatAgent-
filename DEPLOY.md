# GitHub Pagesで変更が反映されない場合の対処法

## 🔄 変更が反映されない場合のチェックリスト

### 1. ファイルが正しくコミット・プッシュされているか確認

```bash
# 変更を確認
git status

# 変更があればコミット
git add .
git commit -m "Update files"

# GitHubにプッシュ
git push origin main
```

### 2. GitHub Pagesの設定を確認

1. GitHubリポジトリの「Settings」→「Pages」を開く
2. Sourceが正しく設定されているか確認
   - Branch: `main`
   - Folder: `/ (root)`
3. 設定を変更した場合は「Save」をクリック

### 3. GitHub Pagesのビルド状況を確認

1. リポジトリの「Actions」タブを開く
2. 「pages build and deployment」のワークフローを確認
3. エラーがあれば確認して修正

### 4. ブラウザのキャッシュをクリア

#### Chrome / Edge
- `Ctrl + Shift + Delete` (Windows) または `Cmd + Shift + Delete` (Mac)
- 「キャッシュされた画像とファイル」を選択して削除
- または、シークレットモードで開く

#### Firefox
- `Ctrl + Shift + Delete` (Windows) または `Cmd + Shift + Delete` (Mac)
- 「キャッシュ」を選択して削除

#### Safari
- `Cmd + Option + E` でキャッシュをクリア
- または、開発者メニューから「キャッシュを空にする」

### 5. 強制リロード

- Windows: `Ctrl + F5` または `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### 6. GitHub PagesのURLにバージョンパラメータを追加

変更が反映されない場合、URLの末尾に `?v=2` などを追加して強制リロード：
```
https://your-username.github.io/url-analyzer/?v=2
```

### 7. 数分待つ

GitHub Pagesの反映には通常1-5分かかります。変更をプッシュした後、少し時間をおいてから確認してください。

### 8. ファイルパスを確認

GitHub Pagesでは、ファイルパスが正しく設定されている必要があります：
- `index.html` がルートディレクトリにあること
- CSS/JSファイルのパスが正しいこと（相対パス推奨）

## 🚀 確実に反映させる方法

### 方法1: バージョン番号を更新

HTMLファイル内のCSS/JSの読み込みにバージョンパラメータを追加：
```html
<link rel="stylesheet" href="styles.css?v=1.1">
<script src="script.js?v=1.1"></script>
```

### 方法2: 空のコミットで再デプロイ

```bash
git commit --allow-empty -m "Trigger rebuild"
git push origin main
```

### 方法3: GitHub Pagesを無効化→再有効化

1. Settings → Pages → Source を「None」に変更してSave
2. 数秒待つ
3. 再度「main / (root)」に設定してSave

## 📝 トラブルシューティング

### エラー: "404 Not Found"
- リポジトリ名が正しいか確認
- `index.html` がルートディレクトリにあるか確認

### エラー: "CORS policy"
- これは正常です。CORSプロキシを使用しているため

### スタイルが適用されない
- CSSファイルのパスが正しいか確認
- ブラウザの開発者ツール（F12）でエラーを確認

## 💡 推奨事項

1. **変更をプッシュした後は5-10分待つ**
2. **シークレットモードで確認**（キャッシュの影響を受けない）
3. **開発者ツール（F12）でエラーを確認**
4. **GitHub Actionsでビルドログを確認**

