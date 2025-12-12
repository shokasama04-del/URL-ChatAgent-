# URL分析 × ChatAgent活用支援ツール

入力されたドメインURLをもとに、想定される流入経路（SEO / 広告 / 指名）とユーザー属性を推定し、ChatAgentの初回メッセージと選択肢を提案するツールです。

## 🎯 目的

- 正確な計測ではなく「実務で使える仮説提示」が目的
- URLから流入経路とユーザー像を推定
- ChatAgentの最適な初回メッセージと選択肢を自動生成

## ✨ 機能

### 入力
- ドメインURL（必須）
- サイト種別（任意：EC / SaaS / コーポレート / メディア）
- BtoB / BtoC（任意）

### 出力
1. **想定流入経路（仮説）** - SEO / 広告 / 指名を★1〜★5で表示
2. **想定ユーザー像** - フェーズ、温度感、主な関心
3. **ChatAgent活用提案** - 初回吹き出し文言と選択肢（3つ）

## 🚀 使い方

### ローカルで実行

1. リポジトリをクローン
```bash
git clone <repository-url>
cd url-analyzer
```

2. `index.html`をブラウザで開く
   - ダブルクリックで開くか
   - ローカルサーバーで開く（推奨）
     ```bash
     # Python 3の場合
     python -m http.server 8000
     
     # Node.jsの場合（http-serverが必要）
     npx http-server
     ```
   - ブラウザで `http://localhost:8000` にアクセス

3. URLを入力して「分析する」ボタンをクリック

### GitHub Pagesで公開（無料）

1. GitHubにリポジトリを作成
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/url-analyzer.git
   git push -u origin main
   ```

2. GitHubリポジトリの設定
   - リポジトリページで「Settings」→「Pages」を開く
   - Source: `Deploy from a branch` を選択
   - Branch: `main` / `/ (root)` を選択
   - 「Save」をクリック

3. 数分待つと、`https://your-username.github.io/url-analyzer/` でアクセス可能になります

## 📋 技術仕様

- **フロントエンドのみ** - HTML / CSS / JavaScript
- **外部API不要** - すべてクライアント側で処理
- **CORSプロキシ** - 複数の無料プロキシサービスを使用（フォールバック機能付き）

## 🔧 動作原理

1. **URL解析**
   - CORSプロキシ経由でHTMLを取得
   - title、meta description、h1、URLパス構造を抽出

2. **ルールベース推定**
   - URLパス構造（/lp/, /campaign/, /blog/ など）
   - コンテンツ訴求（「無料」「資料請求」など）
   - サイト種別による補正

3. **スコア算出**
   - SEO流入可能性：★1〜★5
   - 広告流入可能性：★1〜★5
   - 指名流入可能性：★1〜★5

4. **ChatAgent提案生成**
   - ユーザー像に基づいて最適なメッセージと選択肢を生成

## ⚠️ 注意事項

### CORS制限について

ブラウザのセキュリティ制限により、一部のサイトでは直接HTMLを取得できません。本ツールでは以下の無料CORSプロキシサービスを使用しています：

- `api.allorigins.win`（無料、制限あり）
- `corsproxy.io`（無料）
- `cors-anywhere.herokuapp.com`（公開インスタンス）

**もしすべてのプロキシが失敗する場合：**
- URLが正しいか確認
- サイトがアクセス可能か確認
- しばらく時間をおいて再試行

### 制限事項

- 正確な計測ではなく「仮説提示」が目的
- CORSプロキシの可用性に依存
- 一部のサイトでは取得できない場合がある

## 📝 ライセンス

MIT License（自由に使用・改変可能）

## 🤝 コントリビューション

改善提案やバグ報告は、IssueまたはPull Requestでお願いします。

## 📧 お問い合わせ

質問や要望がある場合は、GitHubのIssueでお知らせください。
