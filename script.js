// ============================================
// URL分析 × ChatAgent活用支援ツール
// ============================================

// DOM要素の取得
const analyzeForm = document.getElementById('analyzeForm');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultsSection = document.getElementById('resultsSection');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');

// フォーム送信時の処理
analyzeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const url = document.getElementById('url').value.trim();
    const siteType = document.getElementById('siteType').value;
    const businessType = document.getElementById('businessType').value;
    
    if (!url) {
        showError('URLを入力してください');
        return;
    }
    
    // ローディング状態
    setLoading(true);
    hideError();
    hideResults();
    
    try {
        // URLからHTMLを取得して解析
        const analysisData = await analyzeURL(url);
        
        // 仮説推定
        const hypothesis = generateHypothesis(analysisData, siteType, businessType);
        
        // 結果を表示
        displayResults(hypothesis, analysisData);
        
    } catch (error) {
        console.error('分析エラー:', error);
        showError(`分析に失敗しました: ${error.message}`);
    } finally {
        setLoading(false);
    }
});

// ============================================
// URL解析関数
// ============================================

/**
 * URLからHTMLを取得し、必要な情報を抽出
 * 複数の無料CORSプロキシを順番に試行（フォールバック機能付き）
 */
async function analyzeURL(url) {
    // 無料CORSプロキシサービスのリスト（複数試行で確実性向上）
    // 注意: これらのサービスは無料ですが、可用性は保証されません
    const proxyServices = [
        // 1. allorigins.win（無料、制限あり）- 最も安定
        {
            name: 'allorigins.win',
            getUrl: (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
            parseResponse: async (response) => {
                const data = await response.json();
                return data.contents || '';
            }
        },
        // 2. corsproxy.io（無料）
        {
            name: 'corsproxy.io',
            getUrl: (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
            parseResponse: async (response) => {
                return await response.text();
            }
        },
    ];
    
    let lastError = null;
    
    // 各プロキシサービスを順番に試行
    for (const proxy of proxyServices) {
        try {
            const proxyUrl = proxy.getUrl(url);
            console.log(`プロキシ試行: ${proxy.name}`);
            
            const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html,application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            // プロキシサービスごとのレスポンス解析
            const htmlContent = await proxy.parseResponse(response);
            
            if (!htmlContent || htmlContent.length < 100) {
                throw new Error('HTMLコンテンツが取得できませんでした');
            }
            
            // HTMLをパース
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
        
            // 基本的な情報を抽出
            const title = doc.querySelector('title')?.textContent?.trim() || '';
            const metaDescription = doc.querySelector('meta[name="description"]')?.content?.trim() || '';
            const h1 = doc.querySelector('h1')?.textContent?.trim() || '';
            const urlPath = new URL(url).pathname;
            const domain = new URL(url).hostname;
            
            // OGPタグの抽出
            const ogTags = extractOGPTags(doc);
            
            // Twitterカードの抽出
            const twitterCards = extractTwitterCards(doc);
            
            // 構造化データ（JSON-LD）の抽出
            const structuredData = extractStructuredData(doc);
            
            // メタタグの詳細情報
            const metaTags = extractMetaTags(doc);
            
            // 広告関連の検出
            const adIndicators = detectAdIndicators(doc, url, title, metaDescription, h1);
        
            return {
                url,
                domain,
                title,
                metaDescription,
                h1,
                urlPath,
                // 追加の分析用データ
                allH1s: Array.from(doc.querySelectorAll('h1')).map(h => h.textContent.trim()),
                keywords: extractKeywords(title + ' ' + metaDescription + ' ' + h1),
                // 新規追加: 詳細情報
                ogTags,
                twitterCards,
                structuredData,
                metaTags,
                adIndicators
            };
            
        } catch (error) {
            // このプロキシサービスが失敗した場合、次のサービスを試行
            console.warn(`プロキシサービス失敗: ${error.message}`);
            lastError = error;
            continue;
        }
    }
    
    // すべてのプロキシサービスが失敗した場合
    throw new Error(
        `URLの取得に失敗しました。CORS制限により、すべてのプロキシサービスで失敗しました。\n` +
        `エラー: ${lastError?.message || '不明なエラー'}\n\n` +
        `【対処法】\n` +
        `1. URLが正しいか確認してください\n` +
        `2. サイトがアクセス可能か確認してください\n` +
        `3. しばらく時間をおいてから再試行してください`
    );
}

/**
 * OGPタグを抽出
 */
function extractOGPTags(doc) {
    const ogTags = {};
    const ogSelectors = [
        'meta[property="og:title"]',
        'meta[property="og:description"]',
        'meta[property="og:image"]',
        'meta[property="og:url"]',
        'meta[property="og:type"]',
        'meta[property="og:site_name"]'
    ];
    
    ogSelectors.forEach(selector => {
        const element = doc.querySelector(selector);
        if (element) {
            const property = element.getAttribute('property');
            const key = property ? property.replace('og:', '') : '';
            if (key) ogTags[key] = element.getAttribute('content') || '';
        }
    });
    
    return ogTags;
}

/**
 * Twitterカードを抽出
 */
function extractTwitterCards(doc) {
    const twitterCards = {};
    const twitterSelectors = [
        'meta[name="twitter:card"]',
        'meta[name="twitter:title"]',
        'meta[name="twitter:description"]',
        'meta[name="twitter:image"]',
        'meta[name="twitter:site"]'
    ];
    
    twitterSelectors.forEach(selector => {
        const element = doc.querySelector(selector);
        if (element) {
            const name = element.getAttribute('name');
            const key = name ? name.replace('twitter:', '') : '';
            if (key) twitterCards[key] = element.getAttribute('content') || '';
        }
    });
    
    return twitterCards;
}

/**
 * 構造化データ（JSON-LD）を抽出
 */
function extractStructuredData(doc) {
    const structuredData = [];
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
    
    scripts.forEach(script => {
        try {
            const data = JSON.parse(script.textContent);
            structuredData.push(data);
        } catch (e) {
            // JSONパースエラーは無視
        }
    });
    
    return structuredData;
}

/**
 * メタタグの詳細情報を抽出
 */
function extractMetaTags(doc) {
    const metaTags = {
        robots: doc.querySelector('meta[name="robots"]')?.getAttribute('content') || '',
        canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
        author: doc.querySelector('meta[name="author"]')?.getAttribute('content') || '',
        keywords: doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
        viewport: doc.querySelector('meta[name="viewport"]')?.getAttribute('content') || ''
    };
    
    // hreflangタグ
    const hreflangs = [];
    doc.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link => {
        hreflangs.push({
            lang: link.getAttribute('hreflang'),
            href: link.getAttribute('href')
        });
    });
    metaTags.hreflangs = hreflangs;
    
    return metaTags;
}

/**
 * 広告関連の指標を検出
 */
function detectAdIndicators(doc, url, title, metaDescription, h1) {
    const indicators = {
        hasAdKeywords: false,
        hasLPStructure: false,
        hasCampaignURL: false,
        hasTrackingParams: false,
        adKeywords: [],
        trackingParams: []
    };
    
    const allText = (title + ' ' + metaDescription + ' ' + h1).toLowerCase();
    const urlLower = url.toLowerCase();
    
    // 広告関連キーワード
    const adKeywordPatterns = [
        '無料', 'free', '今すぐ', '限定', 'キャンペーン', 'campaign',
        '資料請求', 'お問い合わせ', 'contact', 'お試し', 'trial',
        '特典', 'プレゼント', 'gift', '割引', 'discount', 'セール', 'sale',
        '新規', '初回', 'first', '登録', 'register', '申込', 'apply'
    ];
    
    adKeywordPatterns.forEach(keyword => {
        if (allText.includes(keyword.toLowerCase())) {
            indicators.adKeywords.push(keyword);
            indicators.hasAdKeywords = true;
        }
    });
    
    // LP構造の検出
    const lpIndicators = [
        'lp', 'landing', 'campaign', 'promo', 'offer', 'special',
        'download', 'signup', 'register', 'trial'
    ];
    
    lpIndicators.forEach(indicator => {
        if (urlLower.includes(indicator)) {
            indicators.hasLPStructure = true;
            indicators.hasCampaignURL = true;
        }
    });
    
    // トラッキングパラメータの検出
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
                           'gclid', 'fbclid', 'ref', 'source', 'campaign_id'];
    const urlObj = new URL(url);
    
    trackingParams.forEach(param => {
        if (urlObj.searchParams.has(param)) {
            indicators.trackingParams.push({
                param,
                value: urlObj.searchParams.get(param)
            });
            indicators.hasTrackingParams = true;
        }
    });
    
    return indicators;
}

/**
 * テキストからキーワードを抽出
 */
function extractKeywords(text) {
    const keywords = [];
    const lowerText = text.toLowerCase();
    
    // 広告関連キーワード
    if (lowerText.includes('無料') || lowerText.includes('free')) keywords.push('無料');
    if (lowerText.includes('資料請求') || lowerText.includes('お問い合わせ')) keywords.push('資料請求');
    if (lowerText.includes('キャンペーン') || lowerText.includes('campaign')) keywords.push('キャンペーン');
    if (lowerText.includes('限定') || lowerText.includes('limited')) keywords.push('限定');
    
    // SEO関連キーワード
    if (lowerText.includes('ブログ') || lowerText.includes('blog')) keywords.push('ブログ');
    if (lowerText.includes('コラム') || lowerText.includes('column')) keywords.push('コラム');
    if (lowerText.includes('記事') || lowerText.includes('article')) keywords.push('記事');
    
    // 比較検討関連
    if (lowerText.includes('比較') || lowerText.includes('compare')) keywords.push('比較');
    if (lowerText.includes('選び方') || lowerText.includes('how to choose')) keywords.push('選び方');
    
    return keywords;
}

// ============================================
// 仮説推定ロジック
// ============================================

/**
 * 分析データから仮説を生成
 */
function generateHypothesis(analysisData, siteType, businessType) {
    const { urlPath, title, metaDescription, h1, keywords, adIndicators } = analysisData;
    const allText = (title + ' ' + metaDescription + ' ' + h1).toLowerCase();
    
    // スコア初期化
    let seoScore = 0;
    let adScore = 0;
    let directScore = 0;
    
    // 広告指標を活用（最初に評価）
    if (adIndicators) {
        if (adIndicators.hasAdKeywords && adIndicators.adKeywords.length > 0) {
            // 広告キーワードが検出された場合、広告スコアを追加
            adScore += Math.min(2, adIndicators.adKeywords.length);
        }
        if (adIndicators.hasCampaignURL) {
            adScore += 2;
        }
        if (adIndicators.hasTrackingParams && adIndicators.trackingParams.length > 0) {
            adScore += Math.min(2, adIndicators.trackingParams.length);
        }
    }
    
    // ============================================
    // ルール1: URLパス構造による判定
    // ============================================
    if (urlPath.includes('/lp/') || urlPath.includes('/lp-') || urlPath.includes('/landing')) {
        adScore += 3;
    }
    if (urlPath.includes('/campaign/') || urlPath.includes('/campaign-')) {
        adScore += 2;
    }
    if (urlPath.includes('/blog/') || urlPath.includes('/column/') || urlPath.includes('/article/')) {
        seoScore += 3;
    }
    if (urlPath.includes('/product/') || urlPath.includes('/service/')) {
        seoScore += 1;
        directScore += 1;
    }
    if (urlPath === '/' || urlPath === '') {
        directScore += 2;
    }
    
    // ============================================
    // ルール2: コンテンツ訴求による判定
    // ============================================
    // 広告流入の可能性（課題直球、CTA強い）
    if (allText.includes('無料') || allText.includes('free')) {
        adScore += 2;
    }
    if (allText.includes('資料請求') || allText.includes('お問い合わせ') || allText.includes('contact')) {
        adScore += 1;
        if (businessType === 'BtoB') adScore += 1;
    }
    if (allText.includes('今すぐ') || allText.includes('すぐに') || allText.includes('今なら')) {
        adScore += 2;
    }
    if (allText.includes('限定') || allText.includes('limited')) {
        adScore += 1;
    }
    
    // SEO流入の可能性（情報提供、ブログ）
    if (allText.includes('ブログ') || allText.includes('blog')) {
        seoScore += 2;
    }
    if (allText.includes('コラム') || allText.includes('column')) {
        seoScore += 2;
    }
    if (allText.includes('記事') || allText.includes('article')) {
        seoScore += 1;
    }
    if (allText.includes('選び方') || allText.includes('how to') || allText.includes('方法')) {
        seoScore += 2;
    }
    if (allText.includes('比較') || allText.includes('compare')) {
        seoScore += 1;
    }
    
    // 指名流入の可能性（ブランド名、企業情報）
    if (urlPath.includes('/about/') || urlPath.includes('/company/') || urlPath.includes('/corporate/')) {
        directScore += 2;
    }
    if (allText.includes('会社概要') || allText.includes('企業情報')) {
        directScore += 1;
    }
    
    // ============================================
    // ルール3: サイト種別による補正
    // ============================================
    if (siteType === 'EC') {
        seoScore += 1;
        adScore += 1;
    } else if (siteType === 'SaaS') {
        if (businessType === 'BtoB') {
            adScore += 1;
        }
        seoScore += 1;
    } else if (siteType === 'メディア') {
        seoScore += 2;
    } else if (siteType === 'コーポレート') {
        directScore += 1;
    }
    
    // スコアを1-5の範囲に正規化
    const normalizeScore = (score) => {
        if (score <= 0) return 1;
        if (score >= 5) return 5;
        return Math.min(5, Math.max(1, Math.ceil(score)));
    };
    
    seoScore = normalizeScore(seoScore);
    adScore = normalizeScore(adScore);
    directScore = normalizeScore(directScore);
    
    // ============================================
    // ユーザー像の推定
    // ============================================
    let phase = '情報収集';
    let temperature = '低';
    let interests = [];
    
    // フェーズ判定
    if (adScore >= 4 || allText.includes('今すぐ') || allText.includes('すぐに')) {
        phase = '今すぐ';
        temperature = '高';
    } else if (allText.includes('比較') || allText.includes('選び方') || keywords.includes('比較')) {
        phase = '比較検討';
        temperature = '中';
    } else {
        phase = '情報収集';
        temperature = '低';
    }
    
    // 温度感の補正
    if (allText.includes('無料') || allText.includes('資料請求')) {
        if (businessType === 'BtoB') {
            temperature = '中';
        } else {
            temperature = '高';
        }
    }
    
    // 関心事の推定
    if (allText.includes('価格') || allText.includes('料金') || allText.includes('price') || allText.includes('cost')) {
        interests.push('価格');
    }
    if (allText.includes('機能') || allText.includes('feature') || allText.includes('仕様')) {
        interests.push('機能');
    }
    if (allText.includes('事例') || allText.includes('導入') || allText.includes('case study')) {
        interests.push('事例');
    }
    if (allText.includes('信頼') || allText.includes('実績') || allText.includes('安心')) {
        interests.push('信頼性');
    }
    
    // デフォルトの関心事
    if (interests.length === 0) {
        if (businessType === 'BtoB') {
            interests = ['機能', '事例', '信頼性'];
        } else {
            interests = ['価格', '機能'];
        }
    }
    
    return {
        trafficSources: {
            seo: seoScore,
            ad: adScore,
            direct: directScore
        },
        userProfile: {
            phase,
            temperature,
            interests: interests.slice(0, 3) // 最大3つ
        },
        analysisData
    };
}

// ============================================
// ChatAgent活用提案の生成
// ============================================

/**
 * ChatAgentの初回メッセージと選択肢を生成
 */
function generateChatAgentProposal(hypothesis) {
    const { userProfile, trafficSources } = hypothesis;
    const { phase, temperature, interests } = userProfile;
    
    // 初回メッセージの生成
    let message = '';
    
    if (temperature === '高') {
        if (interests.includes('価格')) {
            message = '料金について知りたいですか？1分で要点をご案内します';
        } else if (interests.includes('事例')) {
            message = '導入事例をお探しですか？すぐにご紹介できます';
        } else {
            message = 'お困りの点を教えてください。すぐにサポートします';
        }
    } else if (temperature === '中') {
        if (phase === '比較検討') {
            message = '他社との違いを知りたいですか？比較ポイントをご案内します';
        } else {
            message = 'どのような点でお悩みですか？最適なソリューションをご提案します';
        }
    } else {
        message = 'まずは基本情報から。知りたいことを選んでください';
    }
    
    // 選択肢の生成
    const options = [];
    
    // 関心事に基づいて選択肢を生成
    if (interests.includes('価格')) {
        options.push('料金を知りたい');
    }
    if (interests.includes('機能')) {
        options.push('機能・特徴を見る');
    }
    if (interests.includes('事例')) {
        options.push('導入事例を見る');
    }
    if (interests.includes('信頼性')) {
        options.push('実績・信頼性について');
    }
    
    // デフォルト選択肢
    if (options.length === 0) {
        options.push('料金を知りたい');
        options.push('機能・特徴を見る');
        options.push('導入事例を見る');
    }
    
    // 3つに調整
    if (options.length < 3) {
        const defaultOptions = ['料金を知りたい', '機能・特徴を見る', '導入事例を見る', '他社との違いを知る'];
        for (const opt of defaultOptions) {
            if (!options.includes(opt) && options.length < 3) {
                options.push(opt);
            }
        }
    }
    
    return {
        message,
        options: options.slice(0, 3)
    };
}

// ============================================
// 結果表示関数
// ============================================

/**
 * 結果を画面に表示
 */
function displayResults(hypothesis, analysisData) {
    const { trafficSources, userProfile } = hypothesis;
    const proposal = generateChatAgentProposal(hypothesis);
    
    // ① 想定流入経路
    const trafficSourcesHtml = `
        <div class="traffic-item">
            <span class="traffic-label">SEO</span>
            <span class="traffic-stars">${getStars(trafficSources.seo)}</span>
        </div>
        <div class="traffic-item">
            <span class="traffic-label">広告</span>
            <span class="traffic-stars">${getStars(trafficSources.ad)}</span>
        </div>
        <div class="traffic-item">
            <span class="traffic-label">指名</span>
            <span class="traffic-stars">${getStars(trafficSources.direct)}</span>
        </div>
    `;
    document.getElementById('trafficSources').innerHTML = trafficSourcesHtml;
    
    // ② 想定ユーザー像
    const userProfileHtml = `
        <div class="profile-item">
            <div class="profile-label">フェーズ</div>
            <div class="profile-value">${userProfile.phase}</div>
        </div>
        <div class="profile-item">
            <div class="profile-label">温度感</div>
            <div class="profile-value">${userProfile.temperature}</div>
        </div>
        <div class="profile-item">
            <div class="profile-label">主な関心</div>
            <div class="profile-value">${userProfile.interests.join(' / ')}</div>
        </div>
    `;
    document.getElementById('userProfile').innerHTML = userProfileHtml;
    
    // ③ ChatAgent活用提案
    const proposalHtml = `
        <div class="proposal-message">${proposal.message}</div>
        <ul class="proposal-options">
            ${proposal.options.map(opt => `<li>・${opt}</li>`).join('')}
        </ul>
    `;
    document.getElementById('chatAgentProposal').innerHTML = proposalHtml;
    
    // ④ 広告ライブラリ検索リンク
    const adLibraryLinksHtml = generateAdLibraryLinks(analysisData);
    document.getElementById('adLibraryLinks').innerHTML = adLibraryLinksHtml;
    
    // ⑤ 詳細解析データ
    const analysisDataHtml = generateDetailedAnalysisData(analysisData);
    document.getElementById('analysisData').innerHTML = analysisDataHtml;
    
    // コピー用のデータを保存
    window.lastResults = {
        trafficSources,
        userProfile,
        proposal,
        analysisData
    };
    
    // 結果セクションを表示
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * 広告ライブラリへの検索リンクを生成
 */
function generateAdLibraryLinks(analysisData) {
    const domain = analysisData.domain || '';
    const domainName = domain.replace('www.', '').split('.')[0];
    
    // Facebook広告ライブラリのURL
    const facebookAdLibraryUrl = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=JP&q=${encodeURIComponent(domain)}&search_type=page`;
    
    // Google広告透明性レポートのURL
    const googleAdsTransparencyUrl = `https://adstransparency.google.com/advertiser?advertiser_domain=${encodeURIComponent(domain)}`;
    
    // Twitter広告ライブラリ（利用可能な場合）
    const twitterAdLibraryUrl = `https://transparency.twitter.com/en/reports/ads.html`;
    
    let html = '<div class="ad-library-grid">';
    
    html += `
        <div class="ad-library-item">
            <h3>📘 Facebook広告ライブラリ</h3>
            <p>${domain}のFacebook広告を検索</p>
            <a href="${facebookAdLibraryUrl}" target="_blank" rel="noopener noreferrer" class="ad-library-link">
                Facebook広告を確認する →
            </a>
        </div>
    `;
    
    html += `
        <div class="ad-library-item">
            <h3>🔍 Google広告透明性レポート</h3>
            <p>${domain}のGoogle広告を検索</p>
            <a href="${googleAdsTransparencyUrl}" target="_blank" rel="noopener noreferrer" class="ad-library-link">
                Google広告を確認する →
            </a>
        </div>
    `;
    
    // 広告関連の指標がある場合
    if (analysisData.adIndicators && analysisData.adIndicators.hasAdKeywords) {
        html += `
            <div class="ad-library-item highlight">
                <h3>⚠️ 広告の可能性が高い</h3>
                <p>検出された広告キーワード: ${analysisData.adIndicators.adKeywords.join(', ')}</p>
            </div>
        `;
    }
    
    html += '</div>';
    
    return html;
}

/**
 * 詳細な解析データを生成
 */
function generateDetailedAnalysisData(analysisData) {
    let html = '';
    
    // 基本情報
    html += `
        <div class="data-section">
            <h3 class="data-section-title">基本情報</h3>
            <div class="data-item">
                <div class="data-label">URL</div>
                <div class="data-value">${analysisData.url}</div>
            </div>
            <div class="data-item">
                <div class="data-label">ドメイン</div>
                <div class="data-value">${analysisData.domain || '(なし)'}</div>
            </div>
            <div class="data-item">
                <div class="data-label">URLパス</div>
                <div class="data-value">${analysisData.urlPath}</div>
            </div>
            <div class="data-item">
                <div class="data-label">Title</div>
                <div class="data-value">${analysisData.title || '(なし)'}</div>
            </div>
            <div class="data-item">
                <div class="data-label">Meta Description</div>
                <div class="data-value">${analysisData.metaDescription || '(なし)'}</div>
            </div>
            <div class="data-item">
                <div class="data-label">H1</div>
                <div class="data-value">${analysisData.h1 || '(なし)'}</div>
            </div>
        </div>
    `;
    
    // OGPタグ
    if (analysisData.ogTags && Object.keys(analysisData.ogTags).length > 0) {
        html += `
            <div class="data-section">
                <h3 class="data-section-title">OGPタグ</h3>
        `;
        for (const [key, value] of Object.entries(analysisData.ogTags)) {
            html += `
                <div class="data-item">
                    <div class="data-label">og:${key}</div>
                    <div class="data-value">${value}</div>
                </div>
            `;
        }
        // OGP画像のプレビュー
        if (analysisData.ogTags.image) {
            html += `
                <div class="data-item">
                    <div class="data-label">OGP画像プレビュー</div>
                    <div class="data-value">
                        <img src="${analysisData.ogTags.image}" alt="OGP Image" class="og-image-preview" onerror="this.style.display='none'">
                    </div>
                </div>
            `;
        }
        html += '</div>';
    }
    
    // Twitterカード
    if (analysisData.twitterCards && Object.keys(analysisData.twitterCards).length > 0) {
        html += `
            <div class="data-section">
                <h3 class="data-section-title">Twitterカード</h3>
        `;
        for (const [key, value] of Object.entries(analysisData.twitterCards)) {
            html += `
                <div class="data-item">
                    <div class="data-label">twitter:${key}</div>
                    <div class="data-value">${value}</div>
                </div>
            `;
        }
        html += '</div>';
    }
    
    // 広告関連の指標
    if (analysisData.adIndicators) {
        html += `
            <div class="data-section">
                <h3 class="data-section-title">広告関連の指標</h3>
        `;
        
        if (analysisData.adIndicators.hasAdKeywords) {
            html += `
                <div class="data-item highlight">
                    <div class="data-label">広告キーワード検出</div>
                    <div class="data-value">${analysisData.adIndicators.adKeywords.join(', ')}</div>
                </div>
            `;
        }
        
        if (analysisData.adIndicators.hasCampaignURL) {
            html += `
                <div class="data-item highlight">
                    <div class="data-label">キャンペーンURL構造</div>
                    <div class="data-value">検出されました（LP/キャンペーンページの可能性）</div>
                </div>
            `;
        }
        
        if (analysisData.adIndicators.hasTrackingParams && analysisData.adIndicators.trackingParams.length > 0) {
            html += `
                <div class="data-item highlight">
                    <div class="data-label">トラッキングパラメータ</div>
                    <div class="data-value">
                        ${analysisData.adIndicators.trackingParams.map(tp => 
                            `<strong>${tp.param}</strong>: ${tp.value}`
                        ).join('<br>')}
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
    }
    
    // メタタグ
    if (analysisData.metaTags) {
        html += `
            <div class="data-section">
                <h3 class="data-section-title">メタタグ情報</h3>
        `;
        if (analysisData.metaTags.robots) {
            html += `
                <div class="data-item">
                    <div class="data-label">robots</div>
                    <div class="data-value">${analysisData.metaTags.robots}</div>
                </div>
            `;
        }
        if (analysisData.metaTags.canonical) {
            html += `
                <div class="data-item">
                    <div class="data-label">canonical</div>
                    <div class="data-value">${analysisData.metaTags.canonical}</div>
                </div>
            `;
        }
        if (analysisData.metaTags.keywords) {
            html += `
                <div class="data-item">
                    <div class="data-label">keywords</div>
                    <div class="data-value">${analysisData.metaTags.keywords}</div>
                </div>
            `;
        }
        html += '</div>';
    }
    
    // 構造化データ
    if (analysisData.structuredData && analysisData.structuredData.length > 0) {
        html += `
            <div class="data-section">
                <h3 class="data-section-title">構造化データ（JSON-LD）</h3>
                <div class="data-item">
                    <div class="data-label">検出数</div>
                    <div class="data-value">${analysisData.structuredData.length}件</div>
                </div>
        `;
        analysisData.structuredData.forEach((data, index) => {
            html += `
                <div class="data-item">
                    <div class="data-label">構造化データ #${index + 1}</div>
                    <div class="data-value"><pre>${JSON.stringify(data, null, 2)}</pre></div>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // 検出キーワード
    html += `
        <div class="data-section">
            <h3 class="data-section-title">検出キーワード</h3>
            <div class="data-item">
                <div class="data-label">キーワード</div>
                <div class="data-value">${analysisData.keywords.join(', ') || '(なし)'}</div>
            </div>
        </div>
    `;
    
    return html;
}

/**
 * スコアを星マークに変換
 */
function getStars(score) {
    const fullStars = '★'.repeat(score);
    const emptyStars = '☆'.repeat(5 - score);
    return fullStars + emptyStars;
}

// ============================================
// コピー機能
// ============================================

document.getElementById('copyBtn').addEventListener('click', () => {
    if (!window.lastResults) return;
    
    const { trafficSources, userProfile, proposal } = window.lastResults;
    
    const text = `
【URL分析結果】

① 想定流入経路（仮説）
SEO：${getStars(trafficSources.seo)}
広告：${getStars(trafficSources.ad)}
指名：${getStars(trafficSources.direct)}

② 想定ユーザー像
フェーズ：${userProfile.phase}
温度感：${userProfile.temperature}
主な関心：${userProfile.interests.join(' / ')}

③ ChatAgent活用提案
初回メッセージ：
「${proposal.message}」

選択肢：
${proposal.options.map(opt => `・${opt}`).join('\n')}
    `.trim();
    
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('copyBtn');
        const originalText = btn.textContent;
        btn.textContent = 'コピーしました！';
        btn.style.background = '#28a745';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(err => {
        alert('コピーに失敗しました。手動でコピーしてください。');
    });
});

// ============================================
// ユーティリティ関数
// ============================================

function setLoading(loading) {
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    
    if (loading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        analyzeBtn.disabled = true;
    } else {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        analyzeBtn.disabled = false;
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorSection.style.display = 'block';
    errorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideError() {
    errorSection.style.display = 'none';
}

function hideResults() {
    resultsSection.style.display = 'none';
}
