const { chromium } = require('playwright');

async function findValidUrl() {
    console.log('🔍 AI自動URL検証システム開始...');
    
    const urls = [
        'https://kitai-nine.vercel.app',
        'https://kitai-q8cz6b8ww-yama0609s-projects.vercel.app',
        'https://kitai-jncd61iyn-yama0609s-projects.vercel.app',
        'https://kitai-pmnyvdq7j-yama0609s-projects.vercel.app'
    ];
    
    const browser = await chromium.launch();
    
    for (const url of urls) {
        console.log(`\n🌐 テスト中: ${url}`);
        const page = await browser.newPage();
        
        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
            const title = await page.title();
            const h1Text = await page.textContent('h1').catch(() => null);
            
            console.log(`📋 タイトル: ${title}`);
            console.log(`🎯 H1テキスト: ${h1Text || 'なし'}`);
            
            // 不動産投資AI相談が含まれているかチェック
            if (title.includes('不動産投資AI相談') || (h1Text && h1Text.includes('不動産投資AI相談'))) {
                console.log('✅ 正しいアプリケーションを発見！');
                await page.close();
                await browser.close();
                return url;
            } else if (title.includes('Login') || title.includes('Vercel')) {
                console.log('❌ ログイン画面またはVercelページ');
            } else {
                console.log('❓ 不明なページ');
            }
            
        } catch (error) {
            console.log(`❌ エラー: ${error.message}`);
        }
        
        await page.close();
    }
    
    await browser.close();
    console.log('\n⚠️  有効なURLが見つかりませんでした');
    return null;
}

findValidUrl().then(validUrl => {
    if (validUrl) {
        console.log(`\n🎯 有効URL: ${validUrl}`);
        console.log('🤖 このURLでStep 2品質チェックを実行します');
        
        // 有効URLを保存
        const fs = require('fs');
        fs.writeFileSync('valid-app-url.txt', validUrl);
    }
    process.exit(validUrl ? 0 : 1);
});
