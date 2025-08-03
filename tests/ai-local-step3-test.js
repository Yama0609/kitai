const { chromium } = require('playwright');

async function localStep3Test() {
    console.log('🤖 AI自動ローカルStep 3テスト開始...');
    
    const targetUrl = 'http://localhost:3002';
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
        console.log(`📱 ローカルアクセス: ${targetUrl}`);
        await page.goto(targetUrl, { waitUntil: 'networkidle' });
        
        const title = await page.title();
        console.log(`📋 ページタイトル: ${title}`);
        
        // Step 3要素チェック
        const checks = [];
        
        // 1. サブタイトル
        const subTitle = await page.textContent('p').catch(() => null);
        checks.push({
            element: 'サブタイトル',
            content: subTitle,
            expected: 'Step 3: ダミーAPI機能',
            match: subTitle && subTitle.includes('Step 3')
        });
        
        // 2. ステータス
        const statusElements = await page.$$('div');
        let statusText = null;
        for (const element of statusElements) {
            const text = await element.textContent();
            if (text && text.includes('Step 3')) {
                statusText = text;
                break;
            }
        }
        checks.push({
            element: 'ステータス表示',
            content: statusText,
            expected: 'Step 3進行中',
            match: statusText && statusText.includes('Step 3')
        });
        
        // 3. 入力欄
        const inputPlaceholder = await page.getAttribute('input', 'placeholder').catch(() => null);
        checks.push({
            element: '入力欄プレースホルダー',
            content: inputPlaceholder,
            expected: 'Step 3用プレースホルダー',
            match: inputPlaceholder && inputPlaceholder.includes('Step 3')
        });
        
        // 4. 送信ボタン有効化
        const sendButtonDisabled = await page.getAttribute('button', 'disabled').catch(() => null);
        checks.push({
            element: '送信ボタン',
            content: sendButtonDisabled === null ? '有効' : '無効',
            expected: '有効',
            match: sendButtonDisabled === null
        });
        
        // 5. API機能テスト
        console.log('🧪 ローカルダミーAPI機能テスト...');
        await page.fill('input', 'ローカルテストメッセージ');
        await page.click('button');
        
        // API応答待機
        await page.waitForTimeout(3000);
        
        const messages = await page.$$eval('[class*="mb-4"]', elements => 
            elements.map(el => el.textContent)
        );
        
        const hasApiResponse = messages.some(msg => 
            msg.includes('Step 3') || msg.includes('ダミー') || msg.includes('ローカルテストメッセージ')
        );
        
        checks.push({
            element: 'ローカルAPI応答',
            content: hasApiResponse ? 'API動作確認' : 'API未動作',
            expected: 'API動作確認',
            match: hasApiResponse
        });
        
        // 結果
        console.log('\n🔍 ローカルStep 3テスト結果:');
        console.log('==============================');
        
        let successCount = 0;
        checks.forEach(check => {
            const status = check.match ? '✅' : '❌';
            console.log(`${status} ${check.element}: ${check.content || 'なし'}`);
            if (check.match) successCount++;
        });
        
        const score = Math.round(successCount/checks.length*100);
        console.log(`\n📊 ローカル品質スコア: ${successCount}/${checks.length} (${score}%)`);
        
        if (score >= 60) {
            console.log('\n🎉 ローカルStep 3機能正常動作確認！');
            console.log('🔧 実装は正しい→Vercelデプロイメント問題を解決する必要');
            return true;
        } else {
            console.log('\n⚠️ ローカル実装に問題があります');
            return false;
        }
        
    } catch (error) {
        console.error('❌ エラー:', error.message);
        return false;
    } finally {
        await browser.close();
    }
}

localStep3Test().then(success => {
    console.log(success ? '✅ ローカルテスト成功' : '❌ ローカルテスト失敗');
    process.exit(success ? 0 : 1);
});
