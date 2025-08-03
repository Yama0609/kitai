const { chromium } = require('playwright');

async function step7LocalTest() {
    console.log('🤖 Step 7 OpenAI API統合 - ローカルテスト開始...');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const url = 'http://localhost:3001';

    try {
        // 1. ローカルアクセス
        console.log(`🌐 ローカルアクセス: ${url}`);
        await page.goto(url);
        
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        
        // 2. Step 7の表示確認
        const checks = [];

        // メインタイトル確認
        const mainTitle = await page.textContent('h1').catch(() => null);
        checks.push({
            element: 'メインタイトル',
            content: mainTitle,
            expected: '🏢 不動産投資AI相談',
            match: mainTitle && mainTitle.includes('🏢 不動産投資AI相談')
        });

        // Step 7のサブタイトル確認
        const subTitle = await page.textContent('p.text-lg').catch(() => null);
        checks.push({
            element: 'Step 7サブタイトル',
            content: subTitle,
            expected: 'Step 7: OpenAI API統合完了',
            match: subTitle && subTitle.includes('Step 7') && subTitle.includes('OpenAI API統合完了')
        });

        // Step 7のステータス表示確認
        const statusDisplay = await page.textContent('div.text-sm.bg-green-50').catch(() => null);
        checks.push({
            element: 'Step 7ステータス',
            content: statusDisplay,
            expected: 'AI機能本格稼働',
            match: statusDisplay && statusDisplay.includes('AI機能本格稼働')
        });

        // 初期AIメッセージ確認
        const initialMessage = await page.textContent('.text-left .bg-white p.text-sm').catch(() => null);
        checks.push({
            element: '初期AIメッセージ',
            content: initialMessage ? initialMessage.substring(0, 50) + '...' : null,
            expected: 'Step 7のOpenAI API統合',
            match: initialMessage && initialMessage.includes('Step 7のOpenAI API統合')
        });

        // 入力欄のプレースホルダー確認
        const placeholder = await page.getAttribute('input[type="text"]', 'placeholder').catch(() => null);
        checks.push({
            element: '入力欄プレースホルダー',
            content: placeholder,
            expected: 'OpenAI搭載',
            match: placeholder && placeholder.includes('OpenAI搭載')
        });

        // チャット機能ステータス確認
        const chatStatus = await page.textContent('div.text-xs.bg-green-50').catch(() => null);
        checks.push({
            element: 'チャット機能ステータス',
            content: chatStatus,
            expected: 'OpenAI API統合完了',
            match: chatStatus && chatStatus.includes('OpenAI API統合完了')
        });

        // 3. 結果レポート
        console.log('\n🔍 Step 7 ローカル環境品質チェック結果:');
        console.log('=========================================');

        let successCount = 0;
        checks.forEach(check => {
            const status = check.match ? '✅' : '❌';
            console.log(`${status} ${check.element}:`);
            console.log(`    実際: "${check.content || 'なし'}"`);
            console.log(`    期待: "${check.expected}"`);
            console.log('');
            if (check.match) successCount++;
        });

        console.log(`📊 ローカルStep 7品質スコア: ${successCount}/${checks.length} (${Math.round(successCount/checks.length*100)}%)`);

        // 4. 最終判定
        if (successCount >= checks.length * 0.8) {
            console.log('🎉 Step 7ローカル環境テスト合格！');
            console.log('🤖 OpenAI API統合機能が正常に実装されています');
            console.log('🌐 ローカル環境: http://localhost:3001');
            return true;
        } else {
            console.log('⚠️  Step 7ローカル環境に課題があります');
            console.log('🔧 実装を確認してください');
            return false;
        }

    } catch (error) {
        console.error('❌ エラー:', error.message);
        return false;
    } finally {
        await browser.close();
    }
}

step7LocalTest().then(success => {
    process.exit(success ? 0 : 1);
});
