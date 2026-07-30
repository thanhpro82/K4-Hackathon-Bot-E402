/**
 * Playwright E2E Test Runner in Node.js
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runPlaywrightE2E() {
    console.log("================================================================================");
    console.log("🎭 CHẠY KIỂM THỬ AUTOMATED E2E PLAYWRIGHT DÀNH CHO TRỢ LÝ DISCORD WEB APP");
    console.log("================================================================================\n");

    const htmlPath = path.resolve(__dirname, '../fully_functional_webapp/index.html');
    const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;

    console.log(`🌐 1. Mở giao diện Web App: ${fileUrl}`);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    await page.goto(fileUrl);
    await page.waitForSelector('#messages-container');

    // 2. Test Live Chat
    console.log("\n💬 2. Kiểm thử Chat Live Discord:");
    await page.fill('#chat-input', 'deadline nộp bài CP4 là khi nào?');
    await page.keyboard.press('Enter');
    console.log("   - Đã gửi câu hỏi: 'deadline nộp bài CP4 là khi nào?'");

    await page.waitForSelector('text=02-guide.md', { timeout: 5000 });
    console.log("   - ✅ Đã nhận câu trả lời từ Agent có trích dẫn nguồn '02-guide.md'");

    const chatImgPath = path.resolve(__dirname, 'playwright_chat_test.png');
    await page.screenshot({ path: chatImgPath });
    console.log(`   - 📸 Đã lưu ảnh chụp Chat: ${chatImgPath}`);

    // 3. Test PO Dashboard
    console.log("\n📊 3. Kiểm thử PO Dashboard & Bản Tin Cuối Ngày TA:");
    await page.click('#nav-dashboard');
    await page.waitForTimeout(500);

    await page.click('#btn-generate-digest');
    await page.waitForSelector('#digest-content-container text=BẢN TIN CUỐI NGÀY', { timeout: 5000 });
    console.log("   - ✅ Đã tạo thành công Bản Tin Cuối Ngày Dành Cho TA");

    const stuckBadge = await page.textContent('#stuck-badge');
    console.log(`   - ✅ Cảnh báo Học Viên Stuck: Status '${stuckBadge.trim()}'`);

    const dashboardImgPath = path.resolve(__dirname, 'playwright_dashboard_test.png');
    await page.screenshot({ path: dashboardImgPath });
    console.log(`   - 📸 Đã lưu ảnh chụp Dashboard: ${dashboardImgPath}`);

    // 4. Test Benchmark
    console.log("\n🏆 4. Kiểm thử Benchmark Test Runner (Golden Set 25 Cases):");
    await page.click('#nav-benchmark');
    await page.waitForTimeout(500);

    await page.click('#btn-run-benchmark');
    await page.waitForSelector('#bench-total-score:has-text("100 / 100")', { timeout: 5000 });

    const totalScore = await page.textContent('#bench-total-score');
    const passRate = await page.textContent('#bench-pass-rate');

    console.log(`   - 🏆 Điểm số tổng hợp : ${totalScore.trim()}`);
    printPassRate = passRate.trim();
    console.log(`   - 📈 Tỉ lệ Pass        : ${printPassRate}`);

    const benchImgPath = path.resolve(__dirname, 'playwright_benchmark_test.png');
    await page.screenshot({ path: benchImgPath });
    console.log(`   - 📸 Đã lưu ảnh chụp Benchmark UI: ${benchImgPath}`);

    await browser.close();

    console.log("\n================================================================================");
    console.log("🎉 TẤT CẢ KỊCH BẢN PLAYWRIGHT E2E ĐÃ CHẠY THÀNH CÔNG (100% PASS)!");
    console.log("================================================================================\n");
}

runPlaywrightE2E().catch(err => {
    console.error("❌ Lỗi chạy Playwright:", err);
    process.exit(1);
});
