# Git ブランチ運用ガイド

## ブランチを作るべきケース

### ✅ ブランチを作成すべき場合

1. **大きな機能追加**
   - 新しい機能を追加する場合
   - 例: サイトマップ生成機能、CSVエクスポート機能

2. **UIの大幅な変更**
   - レイアウトの変更
   - デザインのリニューアル
   - 新しいセクションの追加

3. **実験的な機能**
   - 試してみたい機能
   - 動作確認が必要な変更

4. **バグ修正**
   - 既存機能の修正
   - エラー対応

5. **リファクタリング**
   - コードの整理
   - パフォーマンス改善

### ❌ ブランチ不要な場合

- 小さな修正（タイポ、コメント追加など）
- ドキュメントの更新のみ
- 設定ファイルの微調整

## ブランチの作成と運用

### 1. ブランチを作成

```bash
# 現在のブランチを確認
git branch

# 新しいブランチを作成して切り替え
git checkout -b feature/new-ui-design
# または
git switch -c feature/new-ui-design
```

### 2. 変更をコミット

```bash
# 変更をステージング
git add .

# コミット
git commit -m "Add new UI design for sitemap section"
```

### 3. ブランチをプッシュ

```bash
# 初回プッシュ（上流ブランチを設定）
git push -u origin feature/new-ui-design

# 2回目以降
git push
```

### 4. 動作確認

- GitHub上でブランチを確認
- ローカルで動作確認
- 必要に応じて修正を追加コミット

### 5. マージ（mainブランチに統合）

#### 方法A: GitHub上でPull Requestを作成（推奨）

1. GitHubリポジトリページで「Pull requests」タブを開く
2. 「New pull request」をクリック
3. base: `main` ← compare: `feature/new-ui-design` を選択
4. 変更内容を確認して「Create pull request」
5. レビュー後、「Merge pull request」でマージ

#### 方法B: コマンドラインでマージ

```bash
# mainブランチに切り替え
git checkout main

# 最新の状態に更新
git pull origin main

# ブランチをマージ
git merge feature/new-ui-design

# プッシュ
git push origin main
```

### 6. ブランチを削除（マージ後）

```bash
# ローカルのブランチを削除
git branch -d feature/new-ui-design

# リモートのブランチを削除
git push origin --delete feature/new-ui-design
```

## ブランチ命名規則

### 推奨される命名規則

- `feature/機能名` - 新機能追加
  - 例: `feature/sitemap-generation`
  - 例: `feature/csv-export`

- `fix/修正内容` - バグ修正
  - 例: `fix/ad-library-links`
  - 例: `fix/cors-error`

- `refactor/リファクタリング内容` - コード整理
  - 例: `refactor/url-parsing`
  - 例: `refactor/css-structure`

- `ui/変更内容` - UI変更
  - 例: `ui/sitemap-design`
  - 例: `ui/responsive-layout`

- `docs/ドキュメント内容` - ドキュメント更新
  - 例: `docs/readme-update`

## GitHub Pagesでの運用

### 現在の設定

GitHub Pagesは `main` ブランチから公開されています。

### ブランチで作業する場合の注意点

1. **mainブランチは常に動作する状態を保つ**
   - 壊れたコードをmainにマージしない
   - 動作確認してからマージ

2. **Pull Requestでレビュー**
   - 変更内容を確認してからマージ
   - 必要に応じてチームメンバーにレビュー依頼

3. **コミットメッセージを明確に**
   - 何を変更したか分かるように
   - 例: `Add category filter and CSV export feature`

## 実践例

### 例: UIの大幅な変更

```bash
# 1. ブランチを作成
git checkout -b ui/sitemap-redesign

# 2. 変更を加える
# index.html, styles.css などを編集

# 3. コミット
git add .
git commit -m "Redesign sitemap section with improved filters"

# 4. プッシュ
git push -u origin ui/sitemap-redesign

# 5. GitHubでPull Requestを作成
# 6. レビュー後、マージ
# 7. ブランチを削除
git checkout main
git pull origin main
git branch -d ui/sitemap-redesign
```

## トラブルシューティング

### ブランチを間違えてmainにコミットしてしまった場合

```bash
# 最新のコミットを取り消し（変更は保持）
git reset --soft HEAD~1

# ブランチを作成して移動
git checkout -b feature/my-feature

# コミット
git commit -m "My feature"
```

### ブランチを最新のmainに合わせる

```bash
# mainブランチの最新を取得
git checkout main
git pull origin main

# ブランチに戻る
git checkout feature/my-feature

# mainの変更を取り込む
git merge main
# または
git rebase main
```

## まとめ

- **大きな変更はブランチで作業**
- **動作確認してからマージ**
- **明確なコミットメッセージ**
- **Pull Requestでレビュー**

これで安全に開発を進められます！

