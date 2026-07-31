# 📘 TRI THỨC TOÀN DIỆN CHÍNH THỨC TỪ BOT DISCORD AI20K (BOT KUTE)

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
