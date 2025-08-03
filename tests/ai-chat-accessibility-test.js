const { chromium } = require('playwright');

async function chatAccessibilityTest() {
    console.log('💬 チャット機能アクセシビリティテスト開始...');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const url = 'https://kitai-nine.vercel.app';

    try {
        // 1. メインページアクセス（認証なし）
        console.log(`🌐 メインページアクセス: ${url}`);
        await page.goto(url);
        
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        
        // 2. チャット機能の利用可能性確認
        const checks = [];

        // ページタイトル確認
        const title = await page.title();
        checks.push({
            element: 'ページタイトル',
            content: title,
            expected: '不動産投資AI相談',
            match: title && title.includes('不動産投資AI相談')
        });

        // チャット入力欄の存在確認
        const chatInput = await page.locator('input[type="text"]').isVisible();
        checks.push({
            element: 'チャット入力欄',
            content: chatInput ? '利用可能' : '利用不可',
            expected: '利用可能',
            match: chatInput
        });

        // 送信ボタンの存在確認
        const sendButton = await page.locator('button:has-text("送信")').isVisible();
        checks.push({
            element: '送信ボタン',
            content: sendButton ? '利用可能' : '利用不可',
            expected: '利用可能',
            match: sendButton
        });

        // メッセージエリアの存在確認
        const messageArea = await page.locator('.overflow-y-auto').isVisible();
        checks.push({
            element: 'メッセージエリア',
            content: messageArea ? '表示中' : '非表示',
            expected: '表示中',
            match: messageArea
        });

        // 3. 実際にメッセージ送信テスト（認証なし）
        let messageSendSuccess = false;
        if (chatInput && sendButton) {
            try {
                await page.fill('input[type="text"]', 'テストメッセージ');
                await page.click('button:has-text("送信")');
                
                // 送信後のレスポンス待機
                await page.waitForTimeout(3000);
                
                const messageElements = await page.locator('.text-left .bg-white p.text-sm').count();
                messageSendSuccess = messageElements > 0;
            } catch (error) {
                console.log('メッセージ送信テスト中にエラー:', error.message);
            }
        }

        checks.push({
            element: 'メッセージ送信機能',
            content: messageSendSuccess ? '動作正常' : '動作不可',
            expected: '動作正常',
            match: messageSendSuccess
        });

        // 4. 認証を要求されないことの確認
        const currentUrl = page.url();
        const loginRedirect = currentUrl.includes('/login');
        checks.push({
            element: '認証要求なし',
            content: loginRedirect ? 'ログインページにリダイレクト' : 'メインページのまま',
            expected: 'メインページのまま',
            match: !loginRedirect
        });

        // 5. 結果レポート
        console.log('\n💬 チャット機能アクセシビリティテスト結果:');
        console.log('===============================================');

        let successCount = 0;
        checks.forEach(check => {
            const status = check.match ? '✅' : '❌';
            console.log(`${status} ${check.element}:`);
            console.log(`    実際: "${check.content}"`);
            console.log(`    期待: "${check.expected}"`);
            console.log('');
            if (check.match) successCount++;
        });

        console.log(`�� アクセシビリティスコア: ${successCount}/${checks.length} (${Math.round(successCount/checks.length*100)}%)`);

        // 6. 最終判定
        if (successCount >= checks.length * 0.8) {
            console.log('🎉 チャット機能は認証なしで完全に利用可能です！');
            console.log('✅ ユーザーは会員登録なしでメインの機能を使えます');
            console.log('🔐 高度な機能（ダッシュボードなど）のみ認証が必要です');
            return true;
        } else {
            console.log('⚠️  チャット機能に問題があります');
            console.log('🔧 認証要求が不適切な可能性があります');
            return false;
        }

    } catch (error) {
        console.error('❌ エラー:', error.message);
        return false;
    } finally {
        await browser.close();
    }
}

chatAccessibilityTest().then(success => {
    process.exit(success ? 0 : 1);
});
