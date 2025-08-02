const { chromium } = require('playwright');

async function runTest() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const url = 'https://kitai-nine.vercel.app';

    console.log('🤖 AI自動画面確認システム開始...');
    console.log(`📱 アクセス中: ${url}`);

    try {
        await page.goto(url, { waitUntil: 'networkidle' });
        const pageTitle = await page.title();
        console.log(`📋 ページタイトル: ${pageTitle}`);

        const results = {
            mainTitle: false,
            modernSubtitle: false,
            chatHeader: false,
            inputField: false,
        };

        // Check main title
        const mainTitle = await page.locator('h1:has-text("不動産投資AI相談")').isVisible();
        if (mainTitle) {
            results.mainTitle = true;
        }

        // Check modern subtitle (完成版スタイル)
        const modernSubtitle = await page.locator('p:has-text("専門家によるAIアドバイス")').isVisible();
        if (modernSubtitle) {
            results.modernSubtitle = true;
        }

        // Check chat header
        const chatHeader = await page.locator('h2:has-text("不動産投資AI相談")').isVisible();
        if (chatHeader) {
            results.chatHeader = true;
        }

        // Check input field (完成版)
        const inputField = await page.locator('input[placeholder*="不動産投資についてご質問ください"]').isVisible();
        if (inputField) {
            results.inputField = true;
        }

        console.log('\n🔍 AI自動確認結果:');
        console.log('==================');
        console.log(`✅ メインタイトル: ${results.mainTitle ? '🏢 不動産投資AI相談' : 'なし'}`);
        console.log(`✅ 完成版サブタイトル: ${results.modernSubtitle ? '専門家によるAIアドバイス' : 'なし'}`);
        console.log(`✅ チャットヘッダー: ${results.chatHeader ? '💬 不動産投資AI相談' : 'なし'}`);
        console.log(`✅ チャット入力欄: ${results.inputField ? '不動産投資についてご質問ください' : 'なし'}`);

        const successCount = Object.values(results).filter(Boolean).length;
        const totalChecks = Object.keys(results).length;
        const successRate = (successCount / totalChecks) * 100;

        console.log(`\n📊 成功率: ${successCount}/${totalChecks} (${successRate}%)`);

        if (successRate === 100) {
            console.log('🎉🎉🎉 完璧！完成版の不動産投資AIチャットが正常に動作しています！');
        } else if (successRate >= 75) {
            console.log('🎊 ほぼ完成！完成版のコンテンツが表示されています！');
        } else if (successRate > 0) {
            console.log('⚠️  まだ古いコンテンツが混在しています');
        } else {
            console.log('❌ ページが正しく表示されていません。');
        }

        await page.screenshot({ path: 'screenshot.png' });
        console.log('📸 スクリーンショットを保存しました: screenshot.png');

        await browser.close();
        return successRate >= 75;

    } catch (error) {
        console.error('❌ エラーが発生しました:', error);
        await browser.close();
        return false;
    }
}

runTest().then(success => {
    process.exit(success ? 0 : 1);
});
