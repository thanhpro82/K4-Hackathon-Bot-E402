"""
Playwright E2E Automated Test Suite for Discord AI Course Assistant Web App
"""
import os
import sys
import time
from playwright.sync_api import sync_playwright

def run_playwright_e2e():
    print("================================================================================")
    print("🎭 CHẠY KIỂM THỬ AUTOMATED E2E PLAYWRIGHT DÀNH CHO TRỢ LÝ DISCORD WEB APP")
    print("================================================================ shower\n")

    html_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "fully_functional_webapp", "index.html"))
    file_url = f"file:///{html_path.replace('\\', '/')}"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        print(f"🌐 1. Mở giao diện Web App: {file_url}")
        page.goto(file_url)
        page.wait_for_selector("#messages-container")
        time.sleep(1)

        # Step 1: Test Chat Discord Live
        print("\n💬 2. Kiểm thử Chat Live Discord:")
        chat_input = page.locator("#chat-input")
        chat_input.fill("deadline nộp bài CP4 là khi nào?")
        chat_input.press("Enter")

        print("   - Đã gửi câu hỏi: 'deadline nộp bài CP4 là khi nào?'")
        page.wait_for_selector("text=02-guide.md", timeout=5000)
        print("   - ✅ Đã nhận câu trả lời từ Agent có trích dẫn nguồn '02-guide.md'")

        # Capture Chat Screenshot
        chat_img_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "playwright_chat_test.png"))
        page.screenshot(path=chat_img_path)
        print(f"   - 📸 Đã lưu ảnh chụp Chat: {chat_img_path}")

        # Step 2: Test PO Dashboard & Daily Digest
        print("\n📊 3. Kiểm thử PO Dashboard & Bản Tin Cuối Ngày TA:")
        page.click("#nav-dashboard")
        time.sleep(0.5)

        page.click("#btn-generate-digest")
        page.wait_for_selector("#digest-content-container text=BẢN TIN CUỐI NGÀY", timeout=5000)
        print("   - ✅ Đã tạo thành công Bản Tin Cuối Ngày Dành Cho TA")

        # Verify Stuck Student Alert Panel
        stuck_badge = page.text_content("#stuck-badge")
        print(f"   - ✅ Cảnh báo Học Viên Stuck: Status '{stuck_badge.strip()}'")

        dashboard_img_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "playwright_dashboard_test.png"))
        page.screenshot(path=dashboard_img_path)
        print(f"   - 📸 Đã lưu ảnh chụp Dashboard: {dashboard_img_path}")

        # Step 3: Test Benchmark Test Runner (25 Cases)
        print("\n🏆 4. Kiểm thử Benchmark Test Runner (Golden Set 25 Cases):")
        page.click("#nav-benchmark")
        time.sleep(0.5)

        page.click("#btn-run-benchmark")
        page.wait_for_selector("#bench-total-score:has-text('100 / 100')", timeout=5000)

        total_score = page.text_content("#bench-total-score")
        pass_rate = page.text_content("#bench-pass-rate")
        behavior_acc = page.text_content("#bench-behavior-acc")
        citation_acc = page.text_content("#bench-citation-acc")

        print(f"   - 🏆 Điểm số tổng hợp : {total_score.strip()}")
        print(f"   - 📈 Tỉ lệ Pass        : {pass_rate.strip()}")
        print(f"   - 🎯 Intent Accuracy   : {behavior_acc.strip()}")
        print(f"   - 📚 Citation Accuracy : {citation_acc.strip()}")

        benchmark_img_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "playwright_benchmark_test.png"))
        page.screenshot(path=benchmark_img_path)
        print(f"   - 📸 Đã lưu ảnh chụp Benchmark UI: {benchmark_img_path}")

        browser.close()

        print("\n================================================================================")
        print("🎉 TẤT CẢ KỊCH BẢN PLAYWRIGHT E2E ĐÃ CHẠY THÀNH CÔNG (100% PASS)!")
        print("================================================================================\n")

if __name__ == "__main__":
    run_playwright_e2e()
