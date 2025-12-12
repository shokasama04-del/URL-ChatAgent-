# 🚀 GitHubで公開する完全ガイド

## ステップ1: GitHubでリポジトリを作成

1. **GitHubにログイン**
   - https://github.com にアクセスしてログイン

2. **新しいリポジトリを作成**
   - 右上の「+」ボタン → 「New repository」をクリック
   - または直接 https://github.com/new にアクセス

3. **リポジトリ情報を入力**
   - **Repository name**: `url-analyzer`（好きな名前でOK）
   - **Description**: `URL分析 × ChatAgent活用支援ツール`（任意）
   - **Public** または **Private** を選択（Public推奨）
   - ⚠️ **重要**: 「Add a README file」「Add .gitignore」「Choose a license」は**チェックしない**（既にファイルがあるため）

4. **「Create repository」をクリック**

5. **リポジトリURLをコピー**
   - 作成後、表示されるページのURLをコピー
   - 例: `https://github.com/your-username/url-analyzer.git`

## ステップ2: ローカルのファイルをGitHubにプッシュ

### ターミナルで以下のコマンドを実行

```bash
# 1. プロジェクトディレクトリに移動
cd /Users/sho_kasama/url-analyzer

# 2. リモートリポジトリを設定（your-usernameを実際のユーザー名に置き換え）
git remote set-url origin https://github.com/your-username/url-analyzer.git

# または、まだリモートが設定されていない場合
git remote add origin https://github.com/your-username/url-analyzer.git

# 3. ファイルをプッシュ
git push -u origin main
```

### 認証が必要な場合

- **Personal Access Token** が必要な場合があります
- GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- 「Generate new token」で作成（`repo`権限が必要）

## ステップ3: GitHub Pagesを有効化

1. **リポジトリの設定を開く**
   - GitHubリポジトリページで「Settings」タブをクリック

2. **Pages設定を開く**
   - 左メニューの「Pages」をクリック

3. **設定を変更**
   - **Source**: `Deploy from a branch` を選択
   - **Branch**: `main` を選択
   - **Folder**: `/ (root)` を選択
   - 「Save」をクリック

4. **数分待つ**
   - 通常1-5分で反映されます
   - 「Actions」タブでビルド状況を確認できます

5. **公開URLを確認**
   - Settings → Pages に戻ると、公開URLが表示されます
   - 例: `https://your-username.github.io/url-analyzer/`

## ステップ4: 動作確認

1. 公開URLにアクセス
2. URLを入力して「分析する」をクリック
3. 結果が表示されることを確認

## ✅ 完了！

これで、チーム全員が以下のURLでツールを使えるようになります：
```
https://your-username.github.io/url-analyzer/
```

## 🔧 トラブルシューティング

### プッシュが失敗する場合

```bash
# リモートURLを確認
git remote -v

# 正しいURLに変更
git remote set-url origin https://github.com/your-username/url-analyzer.git
```

### GitHub Pagesが表示されない場合

1. 「Actions」タブでエラーを確認
2. Settings → Pages で設定を確認
3. `index.html` がルートディレクトリにあることを確認

### 変更が反映されない場合

1. ブラウザのキャッシュをクリア（`Ctrl + Shift + R`）
2. シークレットモードで確認
3. 5-10分待ってから再確認
