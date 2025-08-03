const { chromium } = require('playwright');

async function authTimingTest() {
    console.log('🕐 認証要求タイミング詳細テスト開始...');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const baseUrl = 'https://kitai-nine.vercel.app';

    try {
        const testScenarios = [
            {
                name: 'メインページ（チャット機能）',
                url: baseUrl,
                expectedAuth: false,
                description: '基本的なAI相談機能'
            },
            {
                name: 'ログインページ',
                url: `${baseUrl}/login`,
                expectedAuth: false,
                description: 'ログインフォーム表示'
            },
            {
                name: 'ダッシュボード（存在しない）',
                url: `${baseUrl}/dashboard`,
                expectedAuth: true,
                description: '保護されたページ（理論上）'
            },
            {
                name: 'プロフィール（存在しない）',
                url: `${baseUrl}/profile`,
                expectedAuth: true,
                description: '保護されたページ（理論上）'
            },
            {
                name: '設定（存在しない）',
                url: `${baseUrl}/settings`,
                expectedAuth: true,
                description: '保護されたページ（理論上）'
            },
            {
                name: '存在しないページ',
                url: `${baseUrl}/nonexistent`,
                expectedAuth: false,
                description: '404ページテスト'
            }
        ];

        const results = [];

        for (const scenario of testScenarios) {
            console.log(`\n🧪 テスト: ${scenario.name}`);
            console.log(`📍 URL: ${scenario.url}`);
            
            try {
                await page.goto(scenario.url, { timeout: 10000 });
                await page.waitForLoadState('networkidle', { timeout: 5000 });
                
                const currentUrl = page.url();
                const title = await page.title();
                const isLoginPage = currentUrl.includes('/login');
                const authRequired = isLoginPage && !scenario.url.includes('/login');
                
                results.push({
                    scenario: scenario.name,
                    testUrl: scenario.url,
                    actualUrl: currentUrl,
                    title: title,
                    authRequired: authRequired,
                    expectedAuth: scenario.expectedAuth,
                    match: authRequired === scenario.expectedAuth,
                    description: scenario.description
                });
                
                console.log(`   現在URL: ${currentUrl}`);
                console.log(`   ページタイトル: ${title}`);
                console.log(`   認証要求: ${authRequired ? 'あり' : 'なし'}`);
                
            } catch (error) {
                console.log(`   エラー: ${error.message}`);
                results.push({
                    scenario: scenario.name,
                    testUrl: scenario.url,
                    actualUrl: 'エラー',
                    title: 'エラー',
                    authRequired: false,
                    expectedAuth: scenario.expectedAuth,
                    match: false,
                    description: scenario.description,
                    error: error.message
                });
            }
        }

        // 結果レポート
        console.log('\n🔍 認証要求タイミング詳細分析結果:');
        console.log('===========================================');

        let correctPredictions = 0;
        results.forEach(result => {
            const status = result.match ? '✅' : '❌';
            const authStatus = result.authRequired ? '🔐 認証要求' : '🆓 認証不要';
            
            console.log(`${status} ${result.scenario}:`);
            console.log(`    URL: ${result.testUrl}`);
            console.log(`    実際: ${authStatus}`);
            console.log(`    タイトル: ${result.title}`);
            console.log(`    説明: ${result.description}`);
            if (result.error) {
                console.log(`    エラー: ${result.error}`);
            }
            console.log('');
            
            if (result.match) correctPredictions++;
        });

        console.log(`📊 予測精度: ${correctPredictions}/${results.length} (${Math.round(correctPredictions/results.length*100)}%)`);

        // 重要な発見事項の報告
        console.log('\n🎯 重要な発見事項:');
        console.log('================');

        const noAuthRequired = results.filter(r => !r.authRequired);
        const authRequired = results.filter(r => r.authRequired);

        console.log(`🆓 認証不要なページ: ${noAuthRequired.length}個`);
        noAuthRequired.forEach(r => console.log(`   - ${r.scenario}`));

        console.log(`🔐 認証必要なページ: ${authRequired.length}個`);
        authRequired.forEach(r => console.log(`   - ${r.scenario}`));

        // メインのチャット機能の確認
        const mainChatResult = results.find(r => r.scenario.includes('メインページ'));
        if (mainChatResult && !mainChatResult.authRequired) {
            console.log('\n🎉 結論: メインのチャット機能は完全に認証不要です！');
            console.log('✅ ユーザーは会員登録なしで即座にAI相談を開始できます');
        }

        return true;

    } catch (error) {
        console.error('❌ テスト実行エラー:', error.message);
        return false;
    } finally {
        await browser.close();
    }
}

authTimingTest().then(success => {
    process.exit(success ? 0 : 1);
});
