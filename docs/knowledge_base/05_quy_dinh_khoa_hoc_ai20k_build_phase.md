# 📌 QUY ĐỊNH VẬN HÀNH KHÓA HỌC AI20K BUILD PHASE (COHORT 3 & 4)

## 1. Lịch Trình & Mục Tiêu Tổng Thể
*   **Thời gian:** Sprint kéo dài 6 tuần (từ 23/07/2026 đến 01/09/2026).
*   **Mục tiêu:** Xây dựng sản phẩm AI thực chiến từ ý tưởng ban đầu đến ngày **Demo Day**.

---

## 2. Nhịp Vận Hành Hàng Tuần (Weekly Schedule)

| Buổi | Khung giờ / Thứ trong tuần | Mục đích & Hoạt động |
|---|---|---|
| **Workshop** | **Tối Thứ 5 & Chủ Nhật** | Các buổi học lý thuyết & thực hành chính của khóa. |
| **Mentoring Duty** | **Tối Thứ 4 & Thứ 7** | Đội ngũ Mentor/TA kiểm tra tiến độ, chấm điểm & gỡ khó cho các nhóm. |
| **Office Hours** | **Tối Thứ 2 & Thứ 6** | Hỗ trợ giải đáp các thắc mắc kỹ thuật & vận hành. |
| **Build Hours** | **Buổi chiều (Từ Tuần 4 trở đi)** | Tập trung Optimize, hoàn thiện và Deploy sản phẩm AI. |

---

## 3. Quy Định Đặt Tên Chuẩn (Naming Conventions)

Việc đặt tên đúng quy chuẩn giúp hệ thống tự động nhận diện thành viên và nhóm bài làm:

*   **Tạo nhóm (Team):** Ghép đội tự do đến hết ngày **25/07**. Sau hạn này, hệ thống sẽ tự động ghép những học viên chưa có đội.
*   **GitHub Repo:** Đặt theo cấu trúc `Khóa(K4/K3)-Hackathon-TênNhóm-PhòngLab` *(Ví dụ: K4-Hackathon-Bot-E402)* hoặc `P-XXX` *(Ví dụ: P-042)*.
*   **Discord Channel:** Đặt theo mẫu `#t-XXX` *(Ví dụ: #t-042)*.
*   **Tên hiển thị Zoom:** Đặt theo cấu trúc `G-YY-TXXX-Họ và tên` *(Ví dụ: G01-T004-Nguyễn Văn An)*.

---

## 4. Hệ Thống Nền Tảng Học Tập & Nộp Bài

| Nền tảng / Kênh | Địa chỉ / Kênh Discord | Mục đích sử dụng chính |
|---|---|---|
| **VLearn Slide** | `vlearn.dev` | Nơi cập nhật toàn bộ slide bài giảng của khóa học. |
| **VLearn Codelabs** | `codelabs.vlearn.dev` | Nền tảng làm bài thực hành Lab. |
| **Discord - Thông báo** | `#thông-báo-chung` | Cập nhật lịch học, thông báo vận hành chính thức từ BTC. |
| **Discord - Lý thuyết** | `#lý-thuyết` | Thảo luận kiến thức & nộp bài phân tích theo từng buổi Lecture. |
| **Discord - Thực hành** | `#thực-hành-lab` | Lấy link repo GitHub nhóm & nộp Form chấm điểm nhóm. |
| **Hỗ trợ trực tiếp** | `@Mod` / Tag Admin | Tag `@Mod` trên Discord khi cần sự hỗ trợ khẩn cấp từ ban tổ chức. |

---

## 5. Cấu Trúc Các Gate (Cột Mốc), Hệ Thống XP & Quy Định AI Log

*   **Cấu trúc các Gate:** Chương trình được chia thành nhiều cột mốc (Gates). Mỗi Gate có yêu cầu sản phẩm (deliverables) riêng. Hiện tại đang ở **Gate 1 - Chốt đề tài**.
*   **Hệ thống XP:** Khi hoàn thành mỗi Gate hoặc tham gia tích cực, các thành viên trong team sẽ được cộng XP vào hệ thống. *(Ví dụ: Hoàn thành Gate 1 nhận ngay +100 XP cho mỗi thành viên)*.
*   **Quy định về AI Log:** Học viên bắt buộc phải setup **AI Log** để ghi lại toàn bộ lịch sử tương tác với AI trong suốt dự án, đảm bảo tính minh bạch.

---

## 6. Quy Định Nộp Bài Codelabs & Checklist 5 Mốc Rà Soát Trước CP6

### Quy định nộp bài trên Codelabs (`codelabs.vlearn.dev`):
*   **Cơ chế:** Nút *Nộp bài* trên Codelabs chỉ lưu bản ghi thời gian nộp bài cho BTC (Ví dụ: *Lần 1 · 15:58:05 30/7/2026 · Đã gửi*). **Điểm số và nhận xét KHÔNG hiển thị công khai** trên Codelabs.
*   **Giới hạn lần nộp:** Được phép nộp tối đa **3 lần nộp** (Codelabs lấy bản nộp cuối cùng trước hạn chót).
*   **Đội ngũ thành viên:** Mỗi thành viên trong team đều dùng chung 1 link Repository của nhóm để gửi.

### Checklist 5 mốc bắt buộc phải tự rà soát trước CP6:
1.  🔒 **Bảo mật:** Repository không chứa API Key hoặc Data Pack trong `data/`.
2.  💻 **Demo & Dự phòng:** Prototype demo chạy được và team có sẵn phương án fallback (video quay sẵn/slide dự phòng).
3.  📑 **Khớp tài liệu:** Nội dung `spec.md`, `eval/`, `validation/` và `reflection/` khớp 100% với những gì team pitch.
4.  🧠 **Vibe-coding rule:** Mỗi thành viên nắm vững phần code/tài liệu có tên mình.
5.  🎯 **Tư duy Pitching:** Pitch giải thích *vì sao sản phẩm cần tồn tại* (Problem & Evidence), không chỉ khoe UI. *"Đừng pitch để được vỗ tay. Hãy pitch để được đặt cược."*
