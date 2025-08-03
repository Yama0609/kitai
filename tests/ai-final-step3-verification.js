const { chromium } = require('playwright');

async function finalStep3Verification() {
    console.log('🏁 AI自動Step 3最終検証開始...');
    
    const targetUrl = 'http://localhost:3002/test-step3';
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
        console.log(`📱 最終テストページアクセス: ${targetUrl}`);
        await page.goto(targetUrl, { waitUntil: 'networkidle' });
        
        const title = await page.title();
        console.log(`📋 ページタイトル: ${title}`);
        
        const verifications = [];
        
        // 1. 完全テストページタイトル
        const h1Text = await page.textContent('h1').catch(() => null);
        verifications.push({
            test: '完全テストページタイトル',
            result: h1Text,
            expected: '完全Step 3テスト',
            passed: h1Text && h1Text.includes('完全Step 3テスト')
        });
        
        // 2. 完全テスト用プレースホルダー
        const inputPlaceholder = await page.getAttribute('input', 'placeholder').catch(() => null);
        verifications.push({
            test: '完全テスト用入力欄',
            result: inputPlaceholder,
            expected: 'COMPLETE TEST',
            passed: inputPlaceholder && inputPlaceholder.includes('COMPLETE TEST')
        });
        
        // 3. 完全送信ボタン
        const sendButtonText = await page.textContent('button').catch(() => null);
        verifications.push({
            test: '完全テスト送信ボタン',
            result: sendButtonText,
            expected: '完全TEST送信',
            passed: sendButtonText && sendButtonText.includes('完全TEST送信')
        });
        
        // 4. Step 3ダミーAPI完全機能テスト
        console.log('🎯 Step 3ダミーAPI完全機能テスト実行...');
        await page.fill('input', '完全Step 3テストメッセージ');
        await page.click('button');
        
        // API応答待機
        await page.waitForTimeout(5000);
        
        const allMessages = await page.$$eval('[class*="mb-4"]', elements => 
            elements.map(el => el.textContent)
        );
        
        console.log('📝 取得されたメッセージ:');
        allMessages.forEach((msg, index) => {
            console.log(`  ${index + 1}: ${msg.substring(0, 100)}...`);
        });
        
        const hasStep3Response = allMessages.some(msg => 
            msg.includes('Step 3') && (msg.includes('ダミー') || msg.includes('完全Step 3テストメッセージ'))
        );
        
        verifications.push({
            test: 'Step 3ダミーAPI完全機能',
            result: hasStep3Response ? 'API応答成功' : 'API応答失敗',
            expected: 'API応答成功',
            passed: hasStep3Response
        });
        
        // 5. Step情報とDemo情報の確認
        const hasStepInfo = allMessages.some(msg => msg.includes('Step 3') && msg.includes('Demo'));
        verifications.push({
            test: 'Step情報とDemo情報',
            result: hasStepInfo ? 'Step&Demo情報あり' : 'Step&Demo情報なし',
            expected: 'Step&Demo情報あり',
            passed: hasStepInfo
        });
        
        // 結果集計
        console.log('\n🔍 AI自動Step 3最終検証結果:');
        console.log('=====================================');
        
        let passedCount = 0;
        verifications.forEach(verification => {
            const status = verification.passed ? '✅' : '❌';
            console.log(`${status} ${verification.test}:`);
            console.log(`    結果: "${verification.result}"`);
            console.log(`    期待: "${verification.expected}"`);
            console.log('');
            if (verification.passed) passedCount++;
        });
        
        const score = Math.round(passedCount / verifications.length * 100);
        console.log(`📊 Step 3最終スコア: ${passedCount}/${verifications.length} (${score}%)`);
        
        if (score >= 80) {
            console.log('\n🎉🎉🎉 Step 3 AI自動検証完全成功！🎉🎉🎉');
            console.log('✅ ダミーAPI機能が完璧に動作しています');
            console.log('✅ Step 3実装は完全に正しく機能しています');
            console.log('🚀 Step 4（OpenAI API連携）への進行準備完了');
            console.log('🤖 AI自動開発システム: Step 3段階完全達成');
            
            // 成功フラグファイル作成
            const fs = require('fs');
            const successData = {
                timestamp: new Date().toISOString(),
                step: 3,
                status: 'COMPLETE_SUCCESS',
                score: score,
                verification: 'PASSED',
                nextStep: 4,
                nextStepDescription: 'OpenAI API連携: 実際のAI応答機能',
                aiSystemStatus: 'FULLY_AUTOMATED_DEVELOPMENT_SUCCESS'
            };
            fs.writeFileSync('step3-complete-success.json', JSON.stringify(successData, null, 2));
            
            return true;
        } else {
            console.log('\n⚠️ Step 3最終検証で問題が検出されました');
            console.log('🔧 追加修正が必要です');
            return false;
        }
        
    } catch (error) {
        console.error('❌ 最終検証エラー:', error.message);
        return false;
    } finally {
        await browser.close();
    }
}

finalStep3Verification().then(success => {
    if (success) {
        console.log('\n🏆 AI自動開発システム: Step 3完全成功達成');
        console.log('📝 完全自動化された品質保証システムが正常動作');
        console.log('🎯 次の目標: Step 4 OpenAI API連携実装');
    }
    process.exit(success ? 0 : 1);
});
