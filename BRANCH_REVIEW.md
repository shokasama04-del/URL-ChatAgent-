# ブランチの変更内容を確認する方法

## 1. GitHub上で確認（最も簡単・推奨）

### Pull Requestを作成すると自動で表示される

1. **ブランチをプッシュ後、GitHubで確認**
   - リポジトリページに「Compare & pull request」ボタンが表示される
   - または「Pull requests」タブ → 「New pull request」

2. **変更内容の確認**
   - **Files changed** タブで変更されたファイルと差分を確認
   - 追加された行は緑色、削除された行は赤色で表示
   - 行番号をクリックしてコメントを追加可能

3. **コミット履歴の確認**
   - Pull Requestページの「Commits」タブでコミット履歴を確認
   - 各コミットをクリックして詳細を確認

### ブランチを直接比較

1. **GitHubリポジトリページで**
   - 「Code」タブのブランチ選択でブランチを切り替え
   - または URL: `https://github.com/your-username/repo-name/compare/main...feature/branch-name`

2. **変更差分の確認**
   - ファイル一覧と変更内容が表示される
   - 各ファイルをクリックして詳細を確認

## 2. コマンドラインで確認

### ブランチ間の差分を確認

```bash
# mainブランチと現在のブランチの差分
git diff main..feature/branch-name

# 変更されたファイル一覧のみ
git diff --name-only main..feature/branch-name

# 変更されたファイルと統計情報
git diff --stat main..feature/branch-name
```

### 現在のブランチの変更を確認

```bash
# 現在のブランチで、mainとの差分
git diff main

# ステージングされていない変更
git diff

# ステージングされた変更
git diff --staged
```

### コミット履歴を確認

```bash
# ブランチのコミット履歴
git log feature/branch-name

# mainとの差分のコミットのみ
git log main..feature/branch-name

# コミットと変更内容を一緒に表示
git log -p main..feature/branch-name

# 統計情報付き
git log --stat main..feature/branch-name
```

## 3. 具体的な確認手順

### 例: UI変更のブランチを確認

```bash
# 1. ブランチ一覧を確認
git branch -a

# 2. ブランチに切り替え（確認用）
git checkout ui/sitemap-redesign

# 3. mainとの差分を確認
git diff main

# 4. 変更されたファイル一覧
git diff --name-only main

# 5. 特定のファイルの変更を確認
git diff main -- styles.css

# 6. mainに戻る
git checkout main
```

### GitHub上での確認手順

1. **リポジトリページにアクセス**
   ```
   https://github.com/shokasama04-del/URL-ChatAgent-
   ```

2. **ブランチを選択**
   - 「Code」タブのブランチドロップダウンから選択
   - または URL: `https://github.com/shokasama04-del/URL-ChatAgent-/tree/ui/sitemap-redesign`

3. **比較ページで確認**
   - URL: `https://github.com/shokasama04-del/URL-ChatAgent-/compare/main...ui/sitemap-redesign`
   - または「Compare & pull request」ボタンをクリック

## 4. 変更内容の見方

### GitHubの差分表示

- **緑色の背景**: 追加された行
- **赤色の背景**: 削除された行
- **黄色の背景**: 変更された行
- **+/- マーク**: 追加/削除された行数

### コマンドラインの差分表示

```
@@ -10,6 +10,8 @@
   // 既存のコード
+  // 追加された行1
+  // 追加された行2
   // 既存のコード
```

- `+`: 追加された行
- `-`: 削除された行
- `@@`: 変更箇所の行番号範囲

## 5. 便利なコマンド

### 変更の概要を確認

```bash
# 変更されたファイルと行数の統計
git diff --stat main..feature/branch-name

# 出力例:
#  styles.css  | 45 +++++++++++++++++++++++++++++++++++++++++++++
#  script.js   | 120 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
#  2 files changed, 165 insertions(+)
```

### 特定のファイルだけ確認

```bash
# 1つのファイルの変更を確認
git diff main -- index.html

# 複数のファイルを指定
git diff main -- index.html styles.css
```

### 変更内容をファイルに出力

```bash
# 差分をファイルに保存
git diff main..feature/branch-name > changes.diff

# 後で確認
cat changes.diff
# または
less changes.diff
```

## 6. Pull Requestでの確認（推奨）

Pull Requestを作成すると、以下の情報が自動で表示されます：

1. **変更されたファイル一覧**
   - どのファイルが変更されたか一目で分かる

2. **行単位の差分**
   - 具体的に何が変更されたか確認可能

3. **レビューコメント**
   - 特定の行にコメントを追加して質問・指摘可能

4. **CI/CDの結果**（設定している場合）
   - 自動テストの結果を確認

5. **マージ前のプレビュー**
   - マージ後の状態をイメージしやすい

## まとめ

### 最も簡単な確認方法
1. **GitHub上でPull Requestを作成**
2. **「Files changed」タブで差分を確認**

### コマンドラインで確認
```bash
git diff main..feature/branch-name
git diff --stat main..feature/branch-name
```

### おすすめのワークフロー
1. ブランチで作業
2. プッシュ
3. **Pull Requestを作成**（自動で差分が表示される）
4. レビュー
5. マージ

これで変更内容を簡単に確認できます！

