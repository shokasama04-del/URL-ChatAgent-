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
4. **広告ライブラリ検索リンク** - Facebook広告ライブラリ・Google広告透明性レポートへの直接リンク
5. **簡易サイトマップ生成** - ドメイン配下の主要URLを収集し、ページ種別・役割・ChatAgent設置優先度を表示
6. **詳細解析データ** - OGPタグ、Twitterカード、構造化データ、広告指標など

### 🆕 新機能（v2.0）

- **OGPタグ・Twitterカード解析** - SNSシェア時の情報を取得
- **構造化データ（JSON-LD）解析** - リッチスニペット情報を抽出
- **広告指標の自動検出** - 広告キーワード、トラッキングパラメータ、LP構造を検出
- **広告ライブラリへの直接リンク** - Facebook/Google広告をワンクリックで検索
- **詳細なメタデータ解析** - robots、canonical、hreflangなど
- **OGP画像プレビュー** - シェア時に表示される画像を確認

### 🆕 新機能（v3.0） - 簡易サイトマップ生成

- **sitemap.xmlの自動取得** - sitemap.xmlから主要URLを自動収集
- **robots.txtからのsitemap取得** - sitemap.xmlがない場合、robots.txtを参照
- **主要URLの推定** - sitemapがない場合、一般的なパスから推定
- **ページ種別の自動判定** - FAQ/問い合わせ/ログイン/商品詳細/カテゴリ/カート/決済/店舗など
- **各URLの役割とChatAgentの役割を自動生成** - CS/営業が判断しやすい具体度で表示
- **ChatAgent設置優先度の自動判定** - 高/中/低で表示
- **優先度フィルター機能** - 優先度別に絞り込み可能

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

1. **URL解析（強化版）**
   - CORSプロキシ経由でHTMLを取得
   - title、meta description、h1、URLパス構造を抽出
   - **OGPタグ、Twitterカード、構造化データ（JSON-LD）を解析**
   - **広告関連キーワード、トラッキングパラメータを検出**

2. **ルールベース推定（強化版）**
   - URLパス構造（/lp/, /campaign/, /blog/ など）
   - コンテンツ訴求（「無料」「資料請求」など）
   - **広告指標（広告キーワード、トラッキングパラメータ、LP構造）**
   - サイト種別による補正

3. **スコア算出**
   - SEO流入可能性：★1〜★5
   - 広告流入可能性：★1〜★5（広告指標を考慮）
   - 指名流入可能性：★1〜★5

4. **ChatAgent提案生成**
   - ユーザー像に基づいて最適なメッセージと選択肢を生成

5. **広告ライブラリリンク生成**
   - Facebook広告ライブラリへの検索リンク
   - Google広告透明性レポートへの検索リンク

6. **簡易サイトマップ生成**
   - sitemap.xmlから最大200件のURLを取得
   - 各URLのページ種別を自動判定（FAQ/問い合わせ/ログイン/商品詳細など）
   - 各URLの役割とChatAgentの役割を自動生成
   - ChatAgent設置優先度を自動判定（高/中/低）
   - 優先度フィルターで絞り込み可能

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

