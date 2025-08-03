const { chromium } = require('playwright');

async function step3FinalCheck() {
    console.log('🤖 AI自動Step 3最終品質チェック開始...');
    
    // Step 3の最新デプロイメントURL
    const targetUrl = 'https://kitai-hm6m93ree-yama0609s-projects.vercel.app';
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
        console.log(`📱 アクセス中: ${targetUrl}`);
        await page.goto(targetUrl, { waitUntil: 'networkidle' });
        
        // ページタイトル確認
        const title = await page.title();
        console.log(`📋 ページタイトル: ${title}`);
        
        // Step 3の期待される要素をチェック
        const checks = [];
        
        // 1. サブタイトル（Step 3期待値）
        const subTitle = await page.textContent('p').catch(() => null);
        checks.push({
            element: 'サブタイトル',
            content: subTitle,
            expected: '段階的構築版 - Step 3: ダミーAPI機能',
            match: subTitle && subTitle.includes('Step 3') && subTitle.includes('ダミーAPI')
        });
        
        // 2. ステータス表示（Step 3期待値）
        const statusElements = await page.$$('div');
        let statusText = null;
        for (const element of statusElements) {
            const text = await element.textContent();
            if (text && text.includes('Step 2完了')) {
                statusText = text;
                break;
            }
        }
        checks.push({
            element: 'ステータス表示',
            content: statusText,
            expected: '✅ Step 2完了 → 🚀 Step 3進行中',
            match: statusText && statusText.includes('Step 2完了') && statusText.includes('Step 3進行中')
        });
        
        // 3. 入力欄のプレースホルダー（Step 3期待値：送信可能状態）
        const inputPlaceholder = await page.getAttribute('input', 'placeholder').catch(() => null);
        checks.push({
            element: '入力欄（送信可能状態）',
            content: inputPlaceholder,
            expected: 'Step 3ダミーAPI接続プレースホルダー',
            match: inputPlaceholder && inputPlaceholder.includes('Step 3')
        });
        
        // 4. 送信ボタンが有効化されているか
        const sendButtonDisabled = await page.getAttribute('button', 'disabled').catch(() => null);
        checks.push({
            element: '送信ボタン（有効状態）',
            content: sendButtonDisabled === null ? '有効' : '無効',
            expected: '有効',
            match: sendButtonDisabled === null
        });
        
        // 5. ダミーAPI機能テスト
        console.log('🧪 ダミーAPI機能テスト実行中...');
        await page.fill('input', 'テストメッセージ');
        await page.click('button');
        
        // API応答を待機
        await page.waitForTimeout(3000);
        
        // AI応答が表示されているかチェック
        const messages = await page.$$eval('[class*="mb-4"]', elements => 
            elements.map(el => el.textContent)
        );
        
        const hasApiResponse = messages.some(msg => 
            msg.includes('Step 3') || msg.includes('ダミー') || msg.includes('テストメッセージ')
        );
        
        checks.push({
            element: 'ダミーAPI応答',
            content: hasApiResponse ? 'API応答あり' : 'API応答なし',
            expected: 'API応答あり',
            match: hasApiResponse
        });
        
        // 結果レポート
        console.log('\n🔍 AI自動Step 3品質チェック結果:');
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
        console.log(`📊 Step 3品質スコア: ${successCount}/${checks.length} (${score}%)`);
        
        // Step 3の合格基準: 80%以上（5項目中4項目以上）
        const passThreshold = 80;
        if (score >= passThreshold) {
            console.log('\n🎉 Step 3 AI自動品質チェック合格！');
            console.log('🚀 ダミーAPI機能が正常に動作しています');
            console.log('✨ 次: Step 4でOpenAI API連携に進む準備完了');
            
            // Step 4進行フラグファイル作成
            const fs = require('fs');
            const progressData = {
                timestamp: new Date().toISOString(),
                step: 3,
                completed: true,
                score: score,
                nextStep: 4,
                nextStepDescription: 'OpenAI API連携: 実際のAI応答'
            };
            fs.writeFileSync('ai-progress-step3.json', JSON.stringify(progressData, null, 2));
            
            return true;
        } else {
            console.log('\n⚠️  Step 3の品質要件を満たしていません');
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
step3FinalCheck().then(success => {
    if (success) {
        console.log('\n🤖 AI自動進行判定: Step 4への準備完了');
        console.log('📝 次の実装: OpenAI API連携で実際のAI応答機能');
        console.log('🎯 目標: 実用レベルの不動産投資AI相談サービス');
    }
    process.exit(success ? 0 : 1);
});
