# GitHubにプッシュする手順

## エラー: "Repository not found" の対処法

### 原因
1. リポジトリがまだ作成されていない
2. 認証の問題（Personal Access Tokenが必要）

## 解決方法

### 方法1: GitHub CLIを使用（推奨・簡単）

```bash
# GitHub CLIがインストールされている場合
gh auth login
gh repo create url-analyzer --public --source=. --remote=origin --push
```

### 方法2: リポジトリを作成してからプッシュ

#### ステップ1: GitHubでリポジトリを作成
1. https://github.com/new にアクセス
2. Repository name: `url-analyzer`
3. Public を選択
4. 「Create repository」をクリック

#### ステップ2: 認証設定

**オプションA: Personal Access Tokenを使用（推奨）**

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token (classic)」をクリック
3. Note: `url-analyzer-push` など
4. Expiration: 適切な期間を選択
5. Scopes: `repo` にチェック
6. 「Generate token」をクリック
7. 表示されたトークンをコピー（2回しか表示されません！）

```bash
# トークンを使用してプッシュ
git push -u origin main
# Username: shokasama04-del
# Password: [コピーしたトークンを貼り付け]
```

**オプションB: SSHを使用**

```bash
# SSH鍵を設定（まだの場合）
ssh-keygen -t ed25519 -C "your_email@example.com"
# GitHub → Settings → SSH and GPG keys で公開鍵を登録

# リモートURLをSSHに変更
git remote set-url origin git@github.com:shokasama04-del/url-analyzer.git
git push -u origin main
```

### 方法3: リポジトリが既に存在する場合の確認

```bash
# 正しいURLか確認
git remote -v

# ユーザー名やリポジトリ名が正しいか確認
# https://github.com/shokasama04-del/url-analyzer にアクセスして存在確認
```
