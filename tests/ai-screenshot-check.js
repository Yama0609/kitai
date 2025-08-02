const { chromium } = require('playwright');

async function aiScreenshotCheck() {
    console.log('�� AI自動画面確認システム開始...');
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
        // 1. ページアクセス
        console.log('📱 アクセス中: https://kitai-nine.vercel.app');
        await page.goto('https://kitai-nine.vercel.app');
        
        // 2. ページタイトル確認
        const title = await page.title();
        console.log(`📋 ページタイトル: ${title}`);
        
        // 3. 重要な要素をチェック
        const checks = [];
        
        // メインタイトル
        const mainTitle = await page.textContent('h1').catch(() => null);
        checks.push({
            element: 'メインタイトル',
            content: mainTitle,
            expected: '🏢 不動産投資AI相談',
            match: mainTitle && mainTitle.includes('不動産投資AI相談')
        });
        
        // サブタイトル
        const subTitle = await page.textContent('p').catch(() => null);
        checks.push({
            element: 'サブタイトル', 
            content: subTitle,
            expected: 'Step 2: 静的チャットUI',
            match: subTitle && subTitle.includes('Step 2')
        });
        
        // チャットヘッダー
        const chatHeader = await page.textContent('[class*="bg-blue-600"]').catch(() => null);
        checks.push({
            element: 'チャットヘッダー',
            content: chatHeader,
            expected: '💬 不動産投資AI相談',
            match: chatHeader && chatHeader.includes('💬')
        });
        
        // 入力欄
        const inputPlaceholder = await page.getAttribute('input', 'placeholder').catch(() => null);
        checks.push({
            element: '入力欄',
            content: inputPlaceholder,
            expected: 'メッセージを入力（まだ送信できません）',
            match: inputPlaceholder && inputPlaceholder.includes('まだ送信できません')
        });
        
        // 4. 結果レポート
        console.log('\n🔍 AI自動確認結果:');
        console.log('==================');
        
        let successCount = 0;
        checks.forEach(check => {
            const status = check.match ? '✅' : '❌';
            console.log(`${status} ${check.element}: ${check.content || 'なし'}`);
            if (check.match) successCount++;
        });
        
        console.log(`\n📊 成功率: ${successCount}/${checks.length} (${Math.round(successCount/checks.length*100)}%)`);
        
        // 5. 最終判定
        if (successCount >= checks.length * 0.75) {
            console.log('🎉 Step 2 チャットUI正常表示確認！');
            return true;
        } else {
            console.log('⚠️  まだStep 1の古い内容が表示されています');
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
aiScreenshotCheck().then(success => {
    process.exit(success ? 0 : 1);
});
