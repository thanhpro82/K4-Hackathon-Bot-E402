# 🛠️ CẨM NANG CÁC LỆNH DISCORD & HƯỚNG DẪN SETUP AI LOG (BUILD PHASE)

## 1. Cú Pháp Các Lệnh Discord Bắt Buộc (Commands Syntax)

### 📝 Lệnh `/daily` (Ghi Log Hàng Ngày)
- **Mục đích:** Ghi nhận nhật ký tiến độ làm việc cá nhân của học viên mỗi ngày.
- **Cú pháp:** `/daily` -> Điền thông tin: Việc đã xong hôm qua (Yesterday) và Việc sẽ làm hôm nay (Today).
- **Thời hạn:** Nộp trước **23:59** hàng ngày.
- **Phần thưởng:** Nhận được **+5 XP** cho mỗi lần nộp thành công.

### 📊 Lệnh `/weekly submit` (Nộp Báo Cáo Nhóm Tuần)
- **Mục đích:** Trưởng nhóm (Leader) nộp tổng kết tiến độ của cả đội hàng tuần.
- **Cú pháp:** `/weekly submit` (hệ thống sẽ hiển thị gợi ý những thông tin cần nộp).
- **Quyền hạn:** Chỉ có học viên có **Role Trưởng nhóm (Leader)** mới bấm nộp được.

### 🎯 Lệnh `/exam pick` (Chọn Đề Tài Hackathon / Build Phase)
- **Mục đích:** Chọn sản phẩm dự thi (Sản phẩm 1: Trợ lý Discord / Sản phẩm 2: Matching Bot / Sản phẩm 3...).
- **Cú pháp:** `/exam pick`.
- **Lưu ý:** Chỉ cần **01 bạn đại diện** thực hiện lệnh và **chỉ được chọn 1 lần duy nhất** (không thể thay đổi).

### 🆘 Lệnh `/ticket create` (Mở Ticket Cứu Viện BTC)
- **Mục đích:** Tạo kênh chat riêng tư hỗ trợ 1-1 giữa Học viên và Ban Tổ Chức / TA khi gặp sự cố nhạy cảm hoặc kỹ thuật khó (tài khoản, đổi team, xin nghỉ...).
- **Cú pháp:** `/ticket create` -> Chọn loại ticket (Type) -> Điền tiêu đề (Subject) và mô tả chi tiết.

---

## 2. Hướng Dẫn Kỹ Thuật Setup AI Log & GitHub Hook

### 🔒 1. Quy định Bảo Mật API Keys
- Bắt buộc lưu các API Key (OpenAI, Gemini, Anthropic) trong file `.env` hoặc `environment variables`.
- Khai báo file `.env` vào file `.gitignore` (**BƯỚC QUAN TRỌNG NHẤT**) để không bao giờ commit nhầm key công khai lên GitHub Repo.
- **Cảnh báo xử lý:** Nếu lỡ commit lộ key, lập tức Revoke (thu hồi) key trên dashboard và tạo key mới.

### 🔗 2. Setup GitHub Webhook AI Log
- **Tạo API Keys:** Truy cập `https://phoenix.note.transformerlabs.ai/api-keys`
- **Clone Repo:** Clone Repo của team trong GitHub Org chính thức: `AI20K-Build-Phase-Cohort-3`. Tên repo có cú pháp `P-XXX` (XXX là mã số dự án).
- **Kiểm tra trạng thái:**
  - Nhìn dòng `[ai-log] Submitted` xuất hiện trong terminal mỗi khi `git push`.
  - Kiểm tra cột *Last used* trên Dashboard API Keys.
  - Kiểm tra các logs đã submit tại mục AI Logs trên Phoenix Note.
- **Yêu cầu:** Setup AI Log ngay tuần 1 và duy trì đến hết Demo Day.

---

## 3. Quy Chuẩn Đạt Tiêu Chuẩn Cho Các Mốc Gate (Gate 1 - Gate 5)

### 🏁 Gate 1 (Chốt Đề Tài & Thiết Kế)
- **Deadline:** 23:59:00 ngày 02/08/2026.
- **Yêu cầu (Deliverables):**
  1. 1-page Brief
  2. PRD (Product Requirement Document)
  3. Wireframe/UI Flow
  4. Github Repo Setup AI Log
- **Hình thức nộp:** Nộp 1 link duy nhất chứa đủ các deliverables trên (GitHub, Docs, Google Drive, ...).
- **Phần thưởng:** +100 XP cho mỗi thành viên khi qua Gate 1.
