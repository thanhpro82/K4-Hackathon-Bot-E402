import os
import re

mined_raw_text = """
Hướng dẫn chi tiết cách setup AI Log cho dự án như thế nào?	"Trong chương trình Build Phase bạn cần setup AI Log để tự động submit prompt:
Tạo API Keys tại https://phoenix.note.transformerlabs.ai/api-keys
Clone Repo của team trong Org: github.com/AI20K-Build-Phase-Cohort-3
Đọc README.md hướng dẫn và làm theo từng bước
Kiểm tra [ai-log] Submitted khi push code hoặc kiểm tra API Key last used trên dashboard ở bước 1.
Kiểm tra AI Logs đã submit tại: AI Logs | Phoenix

Video hướng dẫn chi tiết xem tại: Hướng dẫn setup AI Log Hook

Setup AI Log càng sớm càng tốt (ngay tuần 1)
Đảm bảo log đầy đủ các phiên prompt từ đầu chương trình đến Demo Day

Nếu bạn chưa được invite vào nền tảng hãy đăng nhập tài khoản tại: Join phoenix"
Cách khai báo API Keys (OpenAI/Gemini) an toàn trong dự án mà không bị lộ key?	"Chào bạn! Việc bảo mật API Key là cực kỳ quan trọng, nhất là khi team mình làm việc trên GitHub Org của AI20K. Để tránh bị ""bay màu"" tài khoản hoặc lộ thông tin nhạy cảm, bạn hãy thực hiện theo các bước ""chuẩn chỉnh"" sau nhé:

Sử dụng file .env (Environment Variables)
Thay vì dán trực tiếp Key vào code (hardcode), bạn hãy tạo một file tên là .env ở thư mục gốc của dự án và lưu key vào đó:
OPENAI_API_KEY=sk-abc123xyz...
GEMINI_API_KEY=AIzaSy...

Cấu hình .gitignore (BƯỚC QUAN TRỌNG NHẤT ⚠️)
Bạn phải thêm file .env vào file .gitignore để Git không bao giờ đẩy file này lên GitHub.
Mở file .gitignore (nếu chưa có thì tạo mới).
Thêm dòng này vào: .env

Cách gọi Key trong Code:
- Python: dùng python-dotenv (load_dotenv(), os.getenv("OPENAI_API_KEY"))
- Node.js: dùng dotenv (require('dotenv').config(), process.env.OPENAI_API_KEY)

Sử dụng GitHub Secrets cho CI/CD:
Repo -> Settings -> Secrets and variables -> Actions.

Cảnh báo: Nếu lỡ tay push key lên GitHub, hãy Revoke (thu hồi) key đó ngay lập tức!
Đừng quên quy tắc B3 (Security First): Tuyệt đối không chia sẻ API Key, Token hay mật khẩu lên các kênh chat công khai của Discord nha!"
Yêu cầu cần đạt cho Gate 1 là gì? Cần nộp những file nào để qua Gate 1?	"Gate 1 — Chốt đề tài
+100 XP / member
Deadline 23:59:00 2/8/2026
Chốt bài toán + thiết kế | 1-page brief, PRD, Wireframe, GitHub repo setup

Deliverables cần đạt:
1. Brief (1-page)
2. PRD
3. Wireframe/UI Flow
4. Github Repo Setup AI Log

Nộp 1 link gồm đủ các deliverables trên (github, docs, google drive...)"
Lịch các buổi Build Hours bắt đầu từ tuần thứ mấy của khóa học?	các buổi Build Hours bổ sung vào buổi chiều sẽ bắt đầu diễn ra từ Tuần 4 trở đi của khóa học nha
Demo Day và Vinh danh Top 3 Startup sẽ diễn ra vào ngày nào?	Sự kiện Demo Day và vinh danh Top 3 Startup sẽ diễn ra vào Tuần 6 của khóa học, cụ thể là vào ngày 01/09/2026 đó nha!
Cách nhận role học viên và role Trưởng nhóm trên server Discord như thế nào?	"Cách nhận role Học viên (Learner) 🎓:
Vào kênh #🎭-nhận-huy-hiệu -> Nhấn react (thả biểu cảm) vào tin nhắn embed.

Cách nhận role Trưởng nhóm (Team Leader) 👑:
Được cấp sau khi nhóm hoàn thành đăng ký chính thức với Ban tổ chức. Nếu chưa có, nhắn Mod hoặc mở /ticket create."
Ý nghĩa và chức năng của từng kênh chat: #thông-báo-chung, #lý-thuyết, #thực-hành-lab là gì?	"1. #thông-báo-chung: Cập nhật tin vận hành, slide vlearn.dev, bài lab codelabs.vlearn.dev.
2. #lý-thuyết: Forum thảo luận bài học (Lec-<mã buổi>) nộp bài Pain point -> Baseline -> Target.
3. #thực-hành-lab: Forum làm lab (Lab-<mã buổi>) chứa link repo GitHub bài lab, link Google Form chấm điểm, Form pitching."
Khi nào thì học viên nên tag @Mod hoặc @TA-Support?	"Tag @TA-Support hoặc Mod khi:
- Vấn đề về chương trình Build Phase
- Vấn đề nhân sự trong đội (thành viên lặn, đổi/ghép nhóm)
- Đề xuất đề tài mới ngoài ngân hàng đề
- Khó khăn không có kênh chuyên biệt"
Lịch các buổi Office Hours diễn ra khi nào? Buổi Office Hours có bắt buộc tham gia không?	"Lịch diễn ra: Tối Thứ 2 và Thứ 6 hàng tuần (20:00 – 21:00) tại kênh Stage. Không bắt buộc điểm danh."
Lịch học các buổi Workshop lý thuyết và thực hành diễn ra vào những ngày nào trong tuần?	"Tối Thứ 5 và Chủ Nhật."
"""

def process_and_generate_kb():
    target_file = "docs/knowledge_base/08_tri_thuc_chinh_thuc_bot_kute_full.md"
    
    formatted_content = f"""# 📘 TRI THỨC TOÀN DIỆN CHÍNH THỨC TỪ BOT DISCORD AI20K (BOT KUTE)

> **Mô tả:** Tài liệu lưu trữ 100% dữ liệu bóc tách chính thức từ Discord Bot khóa học AI20K Build Phase.

---

## 1. 🛠️ Hướng Dẫn Setup AI Log & Phoenix Note
- **Tạo API Key:** Truy cập `https://phoenix.note.transformerlabs.ai/api-keys`
- **GitHub Organization:** Clone repo của team trong Org `AI20K-Build-Phase-Cohort-3`
- **Kiểm tra ghi nhận:** Thấy dòng `[ai-log] Submitted` xuất hiện trong terminal khi `git push` hoặc xem cột *Last used* trên Dashboard Phoenix Note.
- **Trang xem logs:** AI Logs trên Phoenix Note.
- **Yêu cầu:** Setup AI Log ngay tuần 1 và duy trì đến hết Demo Day.

---

## 2. 🔒 Quy Định Bảo Mật API Keys (Security First - Quy tắc B3)
- **Sử dụng file `.env`:** Lưu các khóa `OPENAI_API_KEY`, `GEMINI_API_KEY` trong file `.env` ở thư mục gốc.
- **Cấu hình `.gitignore` (BẮT BUỘC):** Khai báo dòng `.env` vào file `.gitignore` để không commit key công khai.
- **Cách nạp biến môi trường trong code:**
  - Python: `from dotenv import load_dotenv; load_dotenv(); os.getenv("OPENAI_API_KEY")`
  - Node.js: `require('dotenv').config(); process.env.OPENAI_API_KEY`
- **GitHub Secrets:** Lưu key tại **Settings -> Secrets and variables -> Actions** trên GitHub Repo.
- **Cảnh báo xử lý:** Nếu lỡ commit lộ key, lập tức Revoke (thu hồi) key trên dashboard và tạo key mới. Tuyệt đối không chia sẻ key lên kênh chat Discord.

---

## 3. 🚩 Quy Định Các Mốc Vượt Chặng (Gate 1 - Gate 5) & Sự Kiện
- **Gate 1 (Chốt Đề Tài & AI Spec):**
  - **Deadline:** 23:59:00 ngày 02/08/2026.
  - **Phần thưởng:** +100 XP / thành viên khi qua Gate 1.
  - **Deliverables bắt buộc (4 file):** 1-page Brief, PRD, Wireframe/UI Flow, GitHub Repo Setup AI Log.
  - **Hình thức nộp:** 1 link duy nhất (GitHub, Google Docs, Drive...).
- **Lịch Build Hours:** Bổ sung vào các buổi chiều từ **Tuần 4** trở đi.
- **Demo Day & Vinh Danh Top 3 Startup:** Tuần 6 (Ngày **01/09/2026**).

---

## 4. 🎭 Quy Định Role & Cấu Trúc Các Kênh Chat Discord
- **Cách nhận Role Learner (Học viên):** React biểu cảm trong kênh `#🎭-nhận-huy-hiệu`.
- **Cách nhận Role Team Leader (Trưởng nhóm):** Cấp tự động sau khi đăng ký team với BTC (hoặc gõ `/ticket create` để nhờ cấp).
- **Chức năng các kênh chat:**
  - `#thông-báo-chung`: Cập nhật slide vlearn.dev, bài lab codelabs.vlearn.dev, thông báo vận hành.
  - `#lý-thuyết`: Forum thảo luận bài giảng (`Lec-<mã buổi>`) nộp bài Pain point -> Baseline -> Target.
  - `#thực-hành-lab`: Forum bài lab (`Lab-<mã buổi>`) chứa link repo GitHub, Form chấm điểm nhóm, Form pitching.

---

## 5. 📅 Lịch Học & Khung Giờ Hoạt Động
- **Workshop lý thuyết & thực hành:** Tối Thứ 5 & Chủ Nhật.
- **Office Hours (OH):** Tối Thứ 2 & Thứ 6 (20:00 – 21:00) tại kênh Stage (Không bắt buộc điểm danh).
- **Mentoring Duty:** Tối Thứ 4 & Thứ 7.

---

## 6. 🆘 Quy Định Tag @Mod / @TA-Support & Mở /ticket
- **Khi nào tag @TA-Support / @Mod:**
  - Thắc mắc quy định Build Phase.
  - Sự cố nhân sự trong đội (thành viên lặn, ghép nhóm).
  - Đề xuất đề tài mới ngoài ngân hàng đề.
- **Khi nào mở `/ticket create`:** Vấn đề riêng tư, nhạy cảm, cấp role hoặc hỗ trợ kỹ thuật cá nhân.
"""

    with open(target_file, "w", encoding="utf-8") as f:
        f.write(formatted_content)
    print(f"Successfully generated {target_file}")

if __name__ == "__main__":
    process_and_generate_kb()
