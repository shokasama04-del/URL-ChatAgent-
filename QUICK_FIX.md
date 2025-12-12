# 🚀 変更を反映させるクイックガイド

## すぐに試す3つの方法

### 方法1: 強制リロード（最も簡単）
ブラウザで `Ctrl + Shift + R` (Windows) または `Cmd + Shift + R` (Mac) を押す

### 方法2: シークレットモードで確認
- Chrome/Edge: `Ctrl + Shift + N` (Windows) または `Cmd + Shift + N` (Mac)
- Firefox: `Ctrl + Shift + P` (Windows) または `Cmd + Shift + P` (Mac)
- Safari: `Cmd + Shift + N`
シークレットモードでGitHub PagesのURLを開く

### 方法3: GitHubに再プッシュ
```bash
cd url-analyzer
git add .
git commit -m "Update: Add cache busting"
git push origin main
```
その後、5-10分待ってから確認
URL-ChatAgent-
## それでも反映されない場合

1. **GitHubリポジトリの「Actions」タブを確認**
   - エラーがないか確認
   - ビルドが完了しているか確認

2. **GitHub Pagesの設定を再確認**
   - Settings → Pages
   - Source: `main` / `/ (root)` になっているか確認
   - 一度「None」にして保存 → 再度「main / (root)」に設定して保存

3. **URLにバージョンパラメータを追加**
   ```
   https://your-username.github.io/url-analyzer/?v=2
   ```

