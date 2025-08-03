const { chromium } = require('playwright');

async function simpleRouteTest() {
    console.log('🧪 AI自動シンプルルートテスト開始...');
    
    const targetUrl = 'http://localhost:3002/test-step3';
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
        console.log(`📱 新ルートアクセス: ${targetUrl}`);
        await page.goto(targetUrl, { waitUntil: 'networkidle' });
        
        const title = await page.title();
        console.log(`📋 ページタイトル: ${title}`);
        
        const content = await page.textContent('body').catch(() => null);
        console.log(`📝 ページ内容: ${content}`);
        
        if (content && content.includes('Test Page')) {
            console.log('✅ 新しいルートが正しく動作しています');
            return true;
        } else {
            console.log('❌ ルートに問題があります');
            return false;
        }
        
    } catch (error) {
        console.error('❌ エラー:', error.message);
        return false;
    } finally {
        await browser.close();
    }
}

simpleRouteTest().then(success => {
    console.log(success ? '✅ ルートテスト成功' : '❌ ルートテスト失敗');
    process.exit(success ? 0 : 1);
});
