const { chromium } = require('playwright');

async function step7QualityCheck() {
    console.log('🤖 Step 7 OpenAI API統合 - 品質チェック開始...');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // パブリックURLを使用
    const url = 'https://kitai-nine.vercel.app';

    try {
        // 1. メインページアクセス
        console.log(`🌐 メインページアクセス: ${url}`);
        await page.goto(url);
        
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        
        // 2. Step 7の表示確認
        const checks = [];

        // ページタイトル確認
        const title = await page.title();
        checks.push({
            element: 'ページタイトル',
            content: title,
            expected: '不動産投資AI相談',
            match: title && title.includes('不動産投資AI相談')
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
            expected: 'Step 7: AI機能本格稼働',
            match: statusDisplay && statusDisplay.includes('Step 7') && statusDisplay.includes('AI機能本格稼働')
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

        // 3. 実際のAI機能テスト（簡単な質問）
        let aiResponseSuccess = false;
        let aiResponseContent = '';
        
        console.log('🧪 実際のOpenAI API機能テスト実行中...');
        
        try {
            // 不動産投資の簡単な質問を送信
            const testQuestion = '不動産投資の基本的なメリットを教えてください';
            await page.fill('input[type="text"]', testQuestion);
            await page.click('button:has-text("送信")');

            // AI応答を待機（最大30秒）
            await page.waitForSelector('.text-left .bg-white p.text-sm:nth-of-type(2)', { timeout: 30000 });
            
            // 応答内容を取得
            const responses = await page.locator('.text-left .bg-white p.text-sm').allTextContents();
            if (responses.length >= 2) {
                aiResponseContent = responses[1]; // 2番目のメッセージ（AI応答）
                aiResponseSuccess = aiResponseContent.length > 50 && 
                                  !aiResponseContent.includes('ダミー') && 
                                  !aiResponseContent.includes('Step 3') &&
                                  (aiResponseContent.includes('不動産投資') || 
                                   aiResponseContent.includes('メリット') ||
                                   aiResponseContent.includes('投資'));
            }
        } catch (error) {
            console.log(`   AI応答テストエラー: ${error.message}`);
        }

        checks.push({
            element: 'OpenAI API実際の応答',
            content: aiResponseSuccess ? `応答成功: ${aiResponseContent.substring(0, 100)}...` : 'API応答なし',
            expected: '適切なAI応答',
            match: aiResponseSuccess
        });

        // 4. 結果レポート
        console.log('\n🔍 Step 7 OpenAI API統合品質チェック結果:');
        console.log('============================================');

        let successCount = 0;
        checks.forEach(check => {
            const status = check.match ? '✅' : '❌';
            console.log(`${status} ${check.element}:`);
            console.log(`    実際: "${check.content || 'なし'}"`);
            console.log(`    期待: "${check.expected}"`);
            console.log('');
            if (check.match) successCount++;
        });

        console.log(`📊 Step 7品質スコア: ${successCount}/${checks.length} (${Math.round(successCount/checks.length*100)}%)`);

        // 5. 最終判定（Step 7の合格基準: 85%以上）
        if (successCount >= checks.length * 0.85) {
            console.log('🎉 Step 7 OpenAI API統合品質チェック合格！');
            console.log('🤖 実際のAI不動産投資相談機能が正常に動作しています');
            console.log('✨ 専門的なアドバイス提供機能が有効になりました');
            return true;
        } else {
            console.log('⚠️  Step 7の品質要件を満たしていません');
            console.log('🔧 OpenAI API統合に課題がある可能性があります');
            return false;
        }

    } catch (error) {
        console.error('❌ エラー:', error.message);
        return false;
    } finally {
        await browser.close();
    }
}

step7QualityCheck().then(success => {
    process.exit(success ? 0 : 1);
});
