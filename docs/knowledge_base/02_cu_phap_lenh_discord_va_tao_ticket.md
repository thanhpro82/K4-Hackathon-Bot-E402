# 🤖 HƯỚNG DẪN CÚ PHÁP LỆNH DISCORD & QUY TRÌNH TẠO TICKET

## 1. Danh Sách Lệnh Discord Thường Dùng (Command Cheatsheet)

*   **Tạo Ticket hỗ trợ:** `/ticket create`
    *   *Cú pháp chuẩn:* `/ticket create subject:[Tiêu đề ngắn] type:[Loại vấn đề] description:[Mô tả chi tiết lỗi]`
    *   *Ví dụ:* `/ticket create subject:Lỗi không clone được repo type:Vấn đề về chương trình build phase description:Tài khoản GitHub bị báo Permission denied khi clone repo private`
    *   *Các type hợp lệ:* Chọn đúng loại từ danh sách gợi ý autocomplete khi gõ lệnh (Ví dụ: `Vấn đề về nhận role Learner`, `Vấn đề về chương trình build phase`).
*   **Báo cáo hàng ngày (Daily report):** `/daily`
    *   *Mục đích:* Ghi rõ việc đã làm xong hôm qua và việc dự kiến làm hôm nay (Thực hiện mỗi ngày).
*   **Nộp báo cáo tuần (Weekly report):** `/weekly submit`
    *   *Mục đích:* Nộp báo cáo tiến độ tuần cho team (2 lần / tuần).
*   **Xem danh sách đề tài:** `/exam view`
*   **Chọn đề tài dự án:** `/exam pick`

---

## 2. Quy Trình Xử Lý Ticket Của BTC & TA

1. **Khởi tạo:** Học viên gõ đúng cú pháp `/ticket create` tại kênh chỉ định.
2. **Xử lý:** Đội ngũ BTC & TA sẽ nhận notification, vào hỗ trợ *case-by-case* theo thứ tự ticket được tạo.
3. **Lưu ý quan trọng:** Không tag vô cớ các Admin/Coach trên kênh chung nếu chưa tạo Ticket hỗ trợ.
