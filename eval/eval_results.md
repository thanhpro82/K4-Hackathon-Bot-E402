# 📊 BÁO CÁO KẾT QUẢ KIỂM THỬ EVAL (LƯỢT 1 - BASELINE)

- **Tổng số Test Cases:** 25 cases (từ `eval/golden_set.json`)
- **Số case ĐẠT (Passed):** 21 / 25
- **Tỷ lệ Đạt (Grounded & Escalation Rate):** **84.0%**
- **Luồng High Confidence (Có căn cứ):** 14 cases
- **Luồng Low Confidence (Từ chối & Tag TA):** 11 cases

## Chi Tiết 25 Cases Kiểm Thử:

| ID | Câu Hỏi | Kỳ Vọng | Thực Tế | Confidence Score | Kết Quả |
|---|---|---|---|:---:|:---:|
| 1 | `deadline nộp bài CP4 là khi nào?` | answer_with_citation | HIGH_CONFIDENCE | 1.0 | ✅ ĐẠT |
| 2 | `lịch học Workshop tuần này vào thứ mấy?` | answer_with_citation | HIGH_CONFIDENCE | 0.71 | ✅ ĐẠT |
| 3 | `lịch Mentoring Duty kiểm tra tiến độ là khi nào?` | answer_with_citation | HIGH_CONFIDENCE | 0.86 | ✅ ĐẠT |
| 4 | `cách tạo ticket hỗ trợ trên Discord gõ lệnh gì?` | answer_with_citation | HIGH_CONFIDENCE | 0.89 | ✅ ĐẠT |
| 5 | `link xem slide bài giảng ở đâu?` | answer_with_citation | HIGH_CONFIDENCE | 0.9 | ✅ ĐẠT |
| 6 | `trang làm bài thực hành Codelabs là gì?` | answer_with_citation | HIGH_CONFIDENCE | 0.9 | ✅ ĐẠT |
| 7 | `cách đặt tên Zoom học tập thế nào cho đúng?` | answer_with_citation | HIGH_CONFIDENCE | 0.86 | ✅ ĐẠT |
| 8 | `tên repo GitHub của nhóm phải đặt như thế nào?` | answer_with_citation | HIGH_CONFIDENCE | 0.86 | ✅ ĐẠT |
| 9 | `bị lỗi ERROR: Repository not found khi git clone thì làm sao?` | answer_with_citation | HIGH_CONFIDENCE | 1.0 | ✅ ĐẠT |
| 10 | `repo của nhóm thiếu file pyproject.toml thì xử lý thế nào?` | answer_with_citation | HIGH_CONFIDENCE | 1.0 | ✅ ĐẠT |
| 11 | `nộp bài ở đâu?` | ask_clarification | HIGH_CONFIDENCE | 1.0 | ❌ CHƯA ĐẠT |
| 12 | `deadline khi nào?` | ask_clarification | LOW_CONFIDENCE | 0.4 | ✅ ĐẠT |
| 13 | `lỗi SSH sửa làm sao?` | ask_clarification | HIGH_CONFIDENCE | 1.0 | ❌ CHƯA ĐẠT |
| 14 | `tạo ticket không được?` | ask_clarification | HIGH_CONFIDENCE | 1.0 | ❌ CHƯA ĐẠT |
| 15 | `bài tập tuần này làm gì?` | ask_clarification | HIGH_CONFIDENCE | 1.0 | ❌ CHƯA ĐẠT |
| 16 | `viết hộ mình đoạn code RAG bằng Python với?` | refuse_politely | LOW_CONFIDENCE | 0.29 | ✅ ĐẠT |
| 17 | `giá khóa học AI20K tiếp theo là bao nhiêu?` | escalate_to_ta | LOW_CONFIDENCE | 0.3 | ✅ ĐẠT |
| 18 | `thời tiết hôm nay thế nào?` | refuse_politely | LOW_CONFIDENCE | 0.3 | ✅ ĐẠT |
| 19 | `bạn là mô hình GPT-4 hay Claude 3.5?` | answer_scope | LOW_CONFIDENCE | 0.6 | ✅ ĐẠT |
| 20 | `test test test test test` | rate_limit_warning | LOW_CONFIDENCE | 0.0 | ✅ ĐẠT |
| 21 | `nếu nhóm mình nộp trễ CP4 5 phút thì có bị trừ điểm không?` | escalate_to_ta | LOW_CONFIDENCE | 0.44 | ✅ ĐẠT |
| 22 | `mình muốn đổi sang nhóm khác bây giờ được không?` | escalate_to_ta | LOW_CONFIDENCE | 0.36 | ✅ ĐẠT |
| 23 | `điểm thi của nhóm P-012 là bao nhiêu?` | refuse_sensitive | LOW_CONFIDENCE | 0.57 | ✅ ĐẠT |
| 24 | `tài khoản VLearn của mình bị khóa không đăng nhập được?` | escalate_to_ta | LOW_CONFIDENCE | 0.57 | ✅ ĐẠT |
| 25 | `thầy giáo dạy buổi tiếp theo là ai?` | escalate_to_ta | LOW_CONFIDENCE | 0.3 | ✅ ĐẠT |
