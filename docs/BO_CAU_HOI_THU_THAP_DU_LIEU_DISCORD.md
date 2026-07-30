# 📋 BỘ CÂU HỎI THU THẬP DỮ LIỆU & KIỂM THỬ TRỢ LÝ DISCORD
## Dành Cho Khảo Sát User (R1), Bộ Golden Set (R4) & User Validation (R6)

Tài liệu này tổng hợp **3 bộ câu hỏi chuẩn** giúp nhóm thu thập bằng chứng thực tế, xây dựng bộ test dataset và lấy phản hồi người dùng đạt tối đa 38/100 điểm Rubric (`R1`, `R4`, `R6`).

---

## PHẦN 1. BỘ CÂU HỎI PHỎNG VẤN HỌC VIÊN (DÙNG CHO EVIDENCE A - RUBRIC R1)

> **Mục tiêu:** Khảo sát $\ge 20$ học viên ngoài nhóm để chứng minh nỗi đau kẹt câu hỏi đêm khuya/cuối tuần là có thật ($\ge 50\%$ xác nhận).
> **Nguyên tắc phỏng vấn:** Hỏi về **lần gần nhất** họ gặp sự cố (không hỏi ý kiến kiều "bạn có thích bot AI không").

### 📝 5 Câu Hỏi Phỏng Vấn Mẫu:

1.  **Hỏi về bối cảnh & lần gần nhất:**
    > *"Trong tuần qua, lần gần nhất bạn gặp thắc mắc về quy định (deadline, nộp bài, role) hoặc lỗi kỹ thuật (Git, SSH, environment) trên Discord là khi nào?"*
2.  **Hỏi về phương án họ đã tự giải quyết (Alternatives):**
    > *"Lúc đó bạn đã xử lý thế nào? (Tự tìm lại tin nhắn trôi, gõ `/ticket create`, hỏi bạn học hay chờ TA phản hồi?)"*
3.  **Hỏi về thời gian lãng phí (Time Loss):**
    > *"Bạn mất bao lâu từ lúc gặp thắc mắc đến khi nhận được câu trả lời chính xác? Có bị gián đoạn bài tập không?"*
4.  **Hỏi về trải nghiệm kẹt đêm khuya/cuối tuần (Off-peak Pain):**
    > *"Có lần nào bạn làm bài vào đêm khuya (sau 22h) hoặc cuối tuần mà bị kẹt không biết hỏi ai chưa? Bạn cảm thấy thế nào lúc đó?"*
5.  **Hỏi về tâm lý ngại hỏi (Silent Majority):**
    > *"Có bao giờ bạn có câu hỏi nhưng ngại không đăng lên kênh chung vì sợ câu hỏi quá cơ bản không?"*

### 📊 Bảng Mẫu Ghi Log Phỏng Vấn (Nộp vào `spec.md` §1):

| STT | Tên / Mã Học Viên | Câu hỏi đã hỏi | Trích dẫn nguyên văn câu trả lời (Verbatim Quote) | Xác nhận Pain? (Có/Không) |
|---|---|---|---|:---:|
| 1 | Nguyễn Văn A (Cohort 4) | Lần gần nhất kẹt lỗi SSH lúc nào? | *"Đêm T7 mình clone repo bài tập lúc 23h bị lỗi Repository not found. Tag TA không ai rep nên đành đi ngủ, sáng CN mới làm tiếp được."* | **Có** |
| 2 | Trần Thị B (Cohort 3) | Có ngại hỏi trên kênh chung không? | *"Mình mới học Python nên nhiều câu hỏi đơn giản không dám gõ lên #💬-chung, sợ các bạn khác cười."* | **Có** |

---

## PHẦN 2. BỘ 25 CÂU HỎI KIỂM THỬ GOLDEN SET (DÙNG CHO EVAL - RUBRIC R4)

> **Mục tiêu:** Lưu vào file `eval/golden_set.json` để chạy tự động kiểm thử độ chính xác (Grounded Rate $\ge 90\%$).

### 🟢 Nhóm 1: Happy Path - In-Scope (10 Cases Thường Gặp)

1.  `@Trợ-lý-AI deadline nộp bài CP4 là khi nào?`
    *   *Đáp án kỳ vọng:* 12:00 ngày 2 (Trích nguồn từ `02-guide.md` Mục 2).
2.  `@Trợ-lý-AI lịch học Workshop tuần này vào thứ mấy?`
    *   *Đáp án kỳ vọng:* Tối Thứ 5 & Chủ Nhật (Trích nguồn từ `05_quy_dinh_khoa_hoc_ai20k_build_phase.md`).
3.  `@Trợ-lý-AI lịch Mentoring Duty kiểm tra tiến độ là khi nào?`
    *   *Đáp án kỳ vọng:* Tối Thứ 4 & Thứ 7.
4.  `@Trợ-lý-AI cách tạo ticket hỗ trợ trên Discord gõ lệnh gì?`
    *   *Đáp án kỳ vọng:* Gõ `/ticket create` và điền tiêu đề, chọn đúng loại vấn đề.
5.  `@Trợ-lý-AI link xem slide bài giảng ở đâu?`
    *   *Đáp án kỳ vọng:* `vlearn.dev`.
6.  `@Trợ-lý-AI trang làm bài thực hành Codelabs là gì?`
    *   *Đáp án kỳ vọng:* `codelabs.vlearn.dev`.
7.  `@Trợ-lý-AI cách đặt tên Zoom học tập thế nào cho đúng?`
    *   *Đáp án kỳ vọng:* Đặt theo mẫu `G-YY-TXXX-Họ và tên` (VD: `G01-T004-Nguyễn Văn An`).
8.  `@Trợ-lý-AI tên repo GitHub của nhóm phải đặt như thế nào?`
    *   *Đáp án kỳ vọng:* Đặt theo cấu trúc `P-XXX` (VD: `P-042`).
9.  `@Trợ-lý-AI bị lỗi ERROR: Repository not found khi git clone thì làm sao?`
    *   *Đáp án kỳ vọng:* Hướng dẫn kiểm tra SSH Key bằng `ssh -T git@github.com` và add SSH Key vào GitHub.
10. `@Trợ-lý-AI repo của nhóm thiếu file pyproject.toml thì xử lý thế nào?`
    *   *Đáp án kỳ vọng:* Hướng dẫn tạo venv bằng `python -m venv .venv` và tự khởi tạo file.

### 🟡 Nhóm 2: Mơ Hồ / Thiếu Thông Tin (5 Ambiguous Cases)

11. `@Trợ-lý-AI nộp bài ở đâu?`
    *   *Kỳ vọng:* AI hỏi lại rõ ràng xem nộp bài Lecture (`#lý-thuyết`), nộp form nhóm (`#thực-hành-lab`) hay nộp bài Hackathon (nộp link Repo qua hệ thống).
12. `@Trợ-lý-AI deadline khi nào?`
    *   *Kỳ vọng:* AI hỏi lại học viên đang muốn hỏi deadline mốc Checkpoint nào (CP1-CP5).
13. `@Trợ-lý-AI lỗi SSH sửa làm sao?`
    *   *Kỳ vọng:* AI liệt kê 2 nguyên nhân phổ biến (chưa add key hoặc clone bằng link HTTPS) và hỏi thêm chi tiết log lỗi.
14. `@Trợ-lý-AI tạo ticket không được?`
    *   *Kỳ vọng:* AI nhắc kiểm tra gõ đúng loại `type` trong danh sách gợi ý autocomplete chưa.
15. `@Trợ-lý-AI bài tập tuần này làm gì?`
    *   *Kỳ vọng:* AI nhắc học viên kiểm tra kênh `#lý-thuyết` hoặc `codelabs.vlearn.dev`.

### 🔴 Nhóm 3: Ngoài Phạm Vi / Spam (5 Out-of-Scope Cases)

16. `@Trợ-lý-AI viết hộ mình đoạn code RAG bằng Python với?`
    *   *Kỳ vọng (Non-goal):* Từ chối khéo: *"Mình chỉ là trợ lý tra cứu quy định và hỗ trợ định hướng kỹ thuật, không thể viết code bài tập hộ bạn được nhé!"*
17. `@Trợ-lý-AI giá khóa học AI20K tiếp theo là bao nhiêu?`
    *   *Kỳ vọng:* Từ chối + Tag TA: *"Thông tin khóa học tiếp theo chưa có trong tài liệu chính thức. Mình đã tag @Mod vào tư vấn thêm cho bạn!"*
18. `@Trợ-lý-AI thời tiết hôm nay thế nào?`
    *   *Kỳ vọng:* Từ chối khéo: *"Mình chỉ hỗ trợ thắc mắc liên quan đến khóa học AI Thực Chiến thôi nhé!"*
19. `@Trợ-lý-AI bạn là mô hình GPT-4 hay Claude 3.5?`
    *   *Kỳ vọng:* Trả lời đúng phạm vi giới thiệu sản phẩm.
20. `@Trợ-lý-AI (gõ câu lệnh lặp đi lặp lại 5 lần liên tiếp)`
    *   *Kỳ vọng:* Kích hoạt luồng **Anti-Spam / Rate limit** (Báo vui lòng đợi 30 giây).

### 🟣 Nhóm 4: Low-Confidence / Nhạy Cảm (5 Rare Cases $\rightarrow$ Tag TA)

21. `@Trợ-lý-AI nếu nhóm mình nộp trễ CP4 5 phút thì có bị trừ điểm không?`
    *   *Kỳ vọng (Tag TA):* *"Theo quy định nộp muộn bị 0đ mốc đó, tuy nhiên case đặc biệt mình đã chuyển cho @Admin xem xét."*
22. `@Trợ-lý-AI mình muốn đổi sang nhóm khác bây giờ được không?`
    *   *Kỳ vọng (Tag TA):* *"Việc đổi nhóm cần sự phê duyệt của BTC. Mình đã tag @Mod hỗ trợ bạn."*
23. `@Trợ-lý-AI điểm thi của nhóm P-012 là bao nhiêu?`
    *   *Kỳ vọng:* Từ chối vì bảo mật thông tin điểm cá nhân/nhóm khác.
24. `@Trợ-lý-AI tài khoản VLearn của mình bị khóa không đăng nhập được?`
    *   *Kỳ vọng (Tag TA):* *"Lỗi tài khoản cá nhân cần hỗ trợ trực tiếp. Mình đã báo @Admin hỗ trợ kiểm tra lại tài khoản cho bạn."*
25. `@Trợ-lý-AI thầy giáo dạy buổi tiếp theo là ai?`
    *   *Kỳ vọng (Low confidence < 0.75):* Báo chưa tìm thấy thông tin chính thức trong tài liệu và tự động tag `@TA-Team`.

---

## PHẦN 3. BỘ CÂU HỎI THU THẬP PHẢN HỒI DÙNG THỬ PROTOTYPE (RUBRIC R6)

> **Mục tiêu:** Cho $\ge 5$ học viên ngoài nhóm gõ thử Bot trên kênh Discord test và ghi lại phản hồi (lưu vào `validation/user_feedback.md`).

### 💬 3 Câu Hỏi Phỏng Vấn Sau Khi Dùng Thử:

1.  **Hỏi về độ chính xác & Hữu ích:**
    > *"Câu trả lời của Bot có đúng thắc mắc của bạn không? Trích dẫn nguồn có giúp bạn tự tin đây là quy định thật không?"*
2.  **Hỏi về trải nghiệm thời gian:**
    > *"So với việc gõ câu hỏi chờ TA trả lời hoặc tìm tin nhắn cũ trôi trên Discord, việc nhận câu trả lời sau 3 giây từ Bot cảm giác thế nào?"*
3.  **Hỏi về điểm cần cải tiến (Góp ý để ghi Changelog):**
    > *"Có điểm nào ở câu trả lời của Bot khiến bạn chưa hài lòng hoặc thấy phiền không? (Ví dụ: câu trả lời dài quá, giọng điệu chưa thân thiện...?)"*
