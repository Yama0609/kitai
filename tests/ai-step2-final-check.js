const { chromium } = require('playwright');

async function step2FinalCheck() {
    console.log('🤖 AI自動Step 2最終品質チェック開始...');
    
    // 最新のデプロイメントURL
    const targetUrl = 'https://kitai-nine.vercel.app';
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
        console.log(`📱 アクセス中: ${targetUrl}`);
        await page.goto(targetUrl, { waitUntil: 'networkidle' });
        
        // ページタイトル確認
        const title = await page.title();
        console.log(`📋 ページタイトル: ${title}`);
        
        // Step 2の期待される要素をチェック
        const checks = [];
        
        // 1. メインタイトル
        const mainTitle = await page.textContent('h1').catch(() => null);
        checks.push({
            element: 'メインタイトル',
            content: mainTitle,
            expected: '🏢 不動産投資AI相談',
            match: mainTitle && mainTitle.includes('不動産投資AI相談')
        });
        
        // 2. サブタイトル（Step 2期待値）
        const subTitle = await page.textContent('p').catch(() => null);
        checks.push({
            element: 'サブタイトル',
            content: subTitle,
            expected: '段階的構築版 - Step 2: 静的チャットUI',
            match: subTitle && subTitle.includes('段階的構築版') && subTitle.includes('Step 2')
        });
        
        // 3. ステータス表示（Step 2期待値）
        const statusElements = await page.$$('div');
        let statusText = null;
        for (const element of statusElements) {
            const text = await element.textContent();
            if (text && text.includes('Step 1完了')) {
                statusText = text;
                break;
            }
        }
        checks.push({
            element: 'ステータス表示',
            content: statusText,
            expected: '✅ Step 1完了 → 🔄 Step 2進行中',
            match: statusText && statusText.includes('Step 1完了') && statusText.includes('Step 2進行中')
        });
        
        // 4. チャットヘッダー
        const chatHeader = await page.textContent('[class*="bg-blue-600"], [class*="bg-blue"]').catch(() => null);
        checks.push({
            element: 'チャットヘッダー',
            content: chatHeader,
            expected: '💬 不動産投資AI相談',
            match: chatHeader && chatHeader.includes('💬')
        });
        
        // 5. 入力欄の状態確認
        const inputPlaceholder = await page.getAttribute('input', 'placeholder').catch(() => null);
        const inputDisabled = await page.getAttribute('input', 'disabled').catch(() => null);
        checks.push({
            element: '入力欄状態',
            content: inputPlaceholder,
            expected: '無効化またはStep 2用プレースホルダー',
            match: inputPlaceholder !== null
        });
        
        // 結果レポート
        console.log('\n🔍 AI自動Step 2品質チェック結果:');
        console.log('==========================================');
        
        let successCount = 0;
        checks.forEach(check => {
            const status = check.match ? '✅' : '❌';
            console.log(`${status} ${check.element}:`);
            console.log(`    実際: "${check.content || 'なし'}"`);
            console.log(`    期待: "${check.expected}"`);
            console.log('');
            if (check.match) successCount++;
        });
        
        const score = Math.round(successCount/checks.length*100);
        console.log(`📊 Step 2品質スコア: ${successCount}/${checks.length} (${score}%)`);
        
        // Step 2の合格基準: 60%以上（5項目中3項目以上）
        const passThreshold = 60;
        if (score >= passThreshold) {
            console.log('\n🎉 Step 2 AI自動品質チェック合格！');
            console.log('🚀 AIが自動でStep 3（ダミーAPI作成）への進行を決定します');
            console.log('✨ 次: ダミーAPIエンドポイント作成を開始します...');
            
            // Step 3進行フラグファイル作成
            const fs = require('fs');
            const progressData = {
                timestamp: new Date().toISOString(),
                step: 2,
                completed: true,
                score: score,
                nextStep: 3,
                nextStepDescription: 'ダミーAPI作成: 固定レスポンス返却'
            };
            fs.writeFileSync('ai-progress-step2.json', JSON.stringify(progressData, null, 2));
            
            return true;
        } else {
            console.log('\n⚠️  Step 2の品質要件を満たしていません');
            console.log('🔧 修正後に再度AI自動チェックを実行します');
            return false;
        }
        
    } catch (error) {
        console.error('❌ エラー:', error.message);
        return false;
    } finally {
        await browser.close();
    }
}

// 実行
step2FinalCheck().then(success => {
    if (success) {
        console.log('\n🤖 AIが次のアクションを決定中...');
        setTimeout(() => {
            console.log('📝 Step 3計画: /api/chat エンドポイントでダミーレスポンス実装');
            console.log('🎯 目標: ユーザーからのメッセージに対して固定の返答を返す');
        }, 1000);
    }
    process.exit(success ? 0 : 1);
});
