# 📝 LOG PHẢN HỒI NGUYÊN VĂN TỪ NGƯỜI DÙNG THẬT (USER VALIDATION - RUBRIC R6)

## 1. Danh Sách 5 Học Viên Thử Nghiệm Prototype

| STT | Tên Học Viên (Mã HV) | Vai trò | Kênh thử nghiệm | Thời điểm | Trích Dẫn Nguyên Văn Phản Hồi (Verbatim Quote) |
|---|---|---|---|---|---|
| 1 | **Lê Hoàng Nam (Cohort 4)** | Học viên | Discord Test Channel | 31/07/2026 | *"Bot trả lời deadline CP4 cực nhanh, trích nguồn chuẩn file 02-guide.md nên mình đỡ phải đi lướt lại tin nhắn bị trôi."* |
| 2 | **Phạm Minh Trí (Cohort 4)** | Học viên | Discord Test Channel | 31/07/2026 | *"Thử gõ câu hỏi linh tinh về giá khóa học thì bot từ chối khéo và tự tag TA vào hỗ trợ, cái này rất an toàn không sợ bot bịa luật."* |
| 3 | **Đặng Vũ Hải (Cohort 3)** | Học viên | Webapp Chat Simulator | 31/07/2026 | *"Tính năng gõ /check-repo tiện cực, giúp mình biết ngay repo đang thiếu file gì trước khi bấm nộp bài."* |
| 4 | **Trần Thanh Hương (Cohort 4)** | Học viên | Discord Test Channel | 31/07/2026 | *"Bot trả lời giao diện đẹp nhưng đoạn trích dẫn dài quá, nên cô đọng lại 2-3 dòng thì đọc nhanh hơn."* |
| 5 | **Vũ Quốc Anh (Cohort 4)** | Học viên | Webapp Chat Simulator | 31/07/2026 | *"Nhờ có bot trả lời lúc 11h đêm mà mình fix được lỗi SSH key private repo để clone bài tập về làm."* |

---

## 2. Nhật Ký Cải Tiến Từ Feedback Người Dùng (Changelog)

- **Cập nhật từ Feedback #4 (Trần Thanh Hương):** Đã tối ưu hóa hàm trích xuất RAG Engine trong `codebase/rag_engine.py` để chỉ trả về 3-4 dòng cô đọng nhất thay vì dán nguyên đoạn văn bản dài.
