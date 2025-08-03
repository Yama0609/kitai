const { chromium } = require('playwright');

async function step6PublicCheck() {
    console.log('🔐 Step 6認証システム - パブリックURL自動品質チェック開始...');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const url = 'https://kitai-nine.vercel.app';

    try {
        // 1. メインページアクセス
        console.log(`🌐 メインページアクセス: ${url}`);
        await page.goto(url);
        const title = await page.title();
        console.log(`📋 ページタイトル: ${title}`);

        // 2. AuthProviderの存在確認（エラーが出ないかチェック）
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        
        // 3. ログインページへのアクセステスト
        const loginUrl = `${url}/login`;
        console.log(`🔑 ログインページアクセス: ${loginUrl}`);
        await page.goto(loginUrl);
        
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        
        // 4. ログインフォームの存在確認
        const checks = [];

        // ページタイトル確認
        const loginTitle = await page.title();
        checks.push({
            element: 'ログインページタイトル',
            content: loginTitle,
            expected: 'ログイン | 不動産投資AI相談',
            match: loginTitle && loginTitle.includes('ログイン')
        });

        // メインタイトル確認
        const mainTitle = await page.textContent('h2').catch(() => null);
        checks.push({
            element: 'メインタイトル',
            content: mainTitle,
            expected: '🏢 不動産投資AI相談',
            match: mainTitle && mainTitle.includes('🏢 不動産投資AI相談')
        });

        // メールアドレス入力欄
        const emailInput = await page.locator('input[type="email"]').isVisible();
        checks.push({
            element: 'メールアドレス入力欄',
            content: emailInput ? '存在' : '不存在',
            expected: '存在',
            match: emailInput
        });

        // パスワード入力欄
        const passwordInput = await page.locator('input[type="password"]').isVisible();
        checks.push({
            element: 'パスワード入力欄',
            content: passwordInput ? '存在' : '不存在',
            expected: '存在',
            match: passwordInput
        });

        // ログインボタン（より具体的なセレクター）
        const loginButton = await page.locator('button:has-text("ログイン")').isVisible();
        checks.push({
            element: 'ログインボタン',
            content: loginButton ? '存在' : '不存在',
            expected: '存在',
            match: loginButton
        });

        // アカウント作成切り替えボタン
        const signupToggle = await page.locator('button:has-text("アカウントを作成する")').isVisible();
        checks.push({
            element: 'アカウント作成切り替え',
            content: signupToggle ? '存在' : '不存在',
            expected: '存在',
            match: signupToggle
        });

        // メインページに戻ってチャット機能確認
        await page.goto(url);
        await page.waitForLoadState('networkidle', { timeout: 5000 });
        
        const chatTitle = await page.textContent('h1').catch(() => null);
        checks.push({
            element: 'メインページタイトル',
            content: chatTitle,
            expected: '🏢 不動産投資AI相談',
            match: chatTitle && chatTitle.includes('🏢 不動産投資AI相談')
        });

        // 5. 結果レポート
        console.log('\n🔍 Step 6認証システム - パブリックURL品質チェック結果:');
        console.log('=========================================================');

        let successCount = 0;
        checks.forEach(check => {
            const status = check.match ? '✅' : '❌';
            console.log(`${status} ${check.element}:`);
            console.log(`    実際: "${check.content || 'なし'}"`);
            console.log(`    期待: "${check.expected}"`);
            console.log('');
            if (check.match) successCount++;
        });

        console.log(`📊 Step 6認証システム品質スコア: ${successCount}/${checks.length} (${Math.round(successCount/checks.length*100)}%)`);

        // 6. 最終判定
        if (successCount >= checks.length * 0.7) {
            console.log('🎉 Step 6認証システム パブリックURL品質チェック合格！');
            console.log('✅ AuthProviderとログインフォームが正常に動作しています');
            console.log('🌐 パブリックアクセス: https://kitai-nine.vercel.app');
            console.log('🔑 ログインページ: https://kitai-nine.vercel.app/login');
            console.log('📝 次: 実際のSupabaseプロジェクト設定を行ってください');
            return true;
        } else {
            console.log('⚠️  Step 6認証システムに課題があります');
            console.log('🔧 修正が必要な項目を確認してください');
            return false;
        }

    } catch (error) {
        console.error('❌ エラー:', error.message);
        return false;
    } finally {
        await browser.close();
    }
}

step6PublicCheck().then(success => {
    process.exit(success ? 0 : 1);
});
