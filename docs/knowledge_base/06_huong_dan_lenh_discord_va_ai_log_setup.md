# 🛠️ CẨM NANG CÁC LỆNH DISCORD & HƯỚNG DẪN SETUP AI LOG (BUILD PHASE)

## 1. Cú Pháp Các Lệnh Discord Bắt Buộc (Commands Syntax)

### 📝 Lệnh `/daily` (Ghi Log Hàng Ngày)
- **Mục đích:** Ghi nhận nhật ký tiến độ làm việc cá nhân của học viên mỗi ngày.
- **Cú pháp:** `/daily [nội_dung_công_việc_đã_làm]`
- **Thời hạn:** Nộp trước **23:59** hàng ngày để được tính điểm chuyên cần.

### 📊 Lệnh `/weekly submit` (Nộp Báo Cáo Nhóm Tuần)
- **Mục đích:** Trưởng nhóm (Leader) nộp tổng kết tiến độ của cả đội hàng tuần.
- **Cú pháp:** `/weekly submit [link_repo] [báo_cáo_tiến_độ]`
- **Quyền hạn:** Chỉ có học viên có **Role Trưởng nhóm (Leader)** mới bấm nộp được.

### 🎯 Lệnh `/exam pick` (Chọn Đề Tài Hackathon / Build Phase)
- **Mục đích:** Chọn sản phẩm dự thi (Sản phẩm 1: Trợ lý Discord / Sản phẩm 2: Matching Bot / Sản phẩm 3...).
- **Cú pháp:** `/exam pick [mã_đề_tài]` (Ví dụ: `/exam pick Product_1`).

### 🆘 Lệnh `/ticket` (Mở Ticket Cứu Viện BTC)
- **Mục đích:** Tạo kênh chat riêng tư hỗ trợ 1-1 giữa Học viên và Ban Tổ Chức / TA khi gặp sự cố nhạy cảm hoặc kỹ thuật khó.
- **Cú pháp:** `/ticket open [lý_do_cần_hỗ_trợ]`

---

## 2. Hướng Dẫn Kỹ Thuật Setup AI Log & GitHub Hook

### 🔒 1. Quy định Bảo Mật API Keys
- Bắt buộc lưu các API Key (OpenAI, Gemini, Anthropic) trong file `.env` hoặc `environment variables`.
- Khai báo file `.env` vào file `.gitignore` để không bao giờ commit nhầm key công khai lên GitHub Repo.

### 🔗 2. Setup GitHub Webhook AI Log
- Kết nối GitHub Repository Webhook trỏ về endpoint kiểm tra AI Log của khóa học để hệ thống tự động chấm điểm tính minh bạch của mã nguồn.

---

## 3. Quy Chuẩn Đạt Tiêu Chuẩn Cho Các Mốc Gate (Gate 1 - Gate 5)

### 🏁 Gate 1 (Chốt Đề Tài & AI Spec)
- **Yêu cầu:** Hoàn thiện `spec.md` (§1-§8), chốt đề tài qua `/exam pick`, phân công đặt tên Zoom `G-YY-TXXX` và Repo `P-XXX`.
- **Thưởng XP:** +100 XP cho mỗi thành viên khi qua Gate 1.
