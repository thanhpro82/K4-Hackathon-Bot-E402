# Spec: Trợ Lý Học Viên (Discord) — AI Thực Chiến

> Trạng thái: bản nháp — cần nhóm điền số liệu thật, tên thật, và xác nhận trước khi nộp CP1-CP5.

---

## §1. Bối cảnh & vấn đề

**Chiến tuyến:** Discord — kênh hỏi-đáp của khóa học.

**Ai đang gặp vấn đề:** Một học viên (mới hoặc đang học) khi cần tìm quy định (rules), tài liệu hướng dẫn, hoặc trả lời cho một câu hỏi kỹ thuật/quy trình trong server Discord của khóa.

**Họ vướng gì:**
- Server có quá nhiều kênh, không biết bắt đầu từ đâu.
- Không biết rules/guideline nằm ở kênh nào.
- Ngại hỏi vì sợ câu hỏi quá cơ bản hoặc đã có người hỏi trước đó.
- Khi tự tìm: phải dùng nhiều từ khóa, lướt lại lịch sử chat — tốn thời gian, dễ mất mạch.

**Hậu quả:**
- Một phần học viên chọn im lặng, bỏ qua vấn đề, mất động lực thay vì hỏi (theo khảo sát n=25: 24% chán nản bỏ qua, 32% phải tự tìm công cụ bên ngoài).
- TA/admin quá tải trả lời các câu hỏi lặp lại (40% học viên chọn tag admin/người có chuyên môn).

---

## §2. Bằng chứng & impact

**Bằng chứng định tính (khảo sát mở rộng, n=25):**
- **Khó khăn phổ biến (multi-select):**
  - 80% (20/25) "Quá nhiều kênh, không biết bắt đầu từ đâu".
  - 72% (18/25) "Không biết tìm rules/guideline ở đâu".
  - 60% (15/25) "Ngại hỏi vì sợ câu hỏi quá cơ bản".
- **Tần suất gặp khó khăn:** 88% gặp vấn đề ở mức độ nhất định (44% Rất thường xuyên, 44% Thỉnh thoảng, 12% Hiếm khi/không quan tâm).
- **Độ khó tìm kiếm thông tin cũ:** 84% (21/25) đánh giá việc tìm lại thông tin cũ trong Discord là "hơi khó" (72%) đến "cực kỳ khó" (12%).
- **Cách xử lý hiện tại (insight mới từ n=25):**
  - 40% (10/25) "Tag admin/người có chuyên môn".
  - 24% (6/25) "Chán nản, bỏ qua".
  - 32% (8/25) dùng giải pháp ngoài (16% copy sang server/nhóm khác, 16% tự tìm Google/ChatGPT).
- **Mối lo ngại về AI (insight quan trọng từ n=25):**
  - 56% (14/25) lo ngại hallucination / câu trả lời chung chung.
  - 20% (5/25) lo ngại bot phản hồi quá nhiều gây "rác" (spam) kênh chat.
  - 16% (4/25) không e ngại, sẵn sàng trải nghiệm.
  - 8% (2/25) lo giảm tương tác người-người.

**Hạn chế của bằng chứng này:** dữ liệu tự đánh giá (self-report), cỡ mẫu khảo sát (n=25) còn nhỏ. Cần bổ sung:

**Bằng chứng định lượng cần đếm trực tiếp từ log Discord thật của khóa** *(nhóm điền sau khi có quyền truy cập)*:
- [ ] Số câu hỏi trong kênh hỏi-đáp không có phản hồi trong X giờ: `__/__`
- [ ] Số câu hỏi trùng lặp với câu đã từng được hỏi/trả lời trước đó: `__/__`
- [ ] Thời gian phản hồi trung bình của TA/admin: `__ phút/giờ`

**Impact nếu giải quyết được:** giảm thời gian chờ trả lời, giảm số câu hỏi lặp lại TA phải xử lý, giảm tỷ lệ học viên bỏ cuộc không hỏi hoặc rời sang công cụ ngoài.

---

## §3. Đối tượng mục tiêu & phạm vi

**Đối tượng chính:** học viên đang hoạt động trong server Discord của khóa "AI Thực Chiến", đặt câu hỏi về quy định, tài liệu, hoặc nội dung học thuật trong kênh hỏi-đáp.

**Trong phạm vi (in-scope):**
- Trả lời câu hỏi có căn cứ trong rules/tài liệu chính thức của khóa.
- Trích dẫn nguồn (kênh, tài liệu, số dòng/trang) khi trả lời.
- Chuyển tiếp cho admin/TA khi không tìm được căn cứ.

**Ngoài phạm vi (out-of-scope):**
- Không tự sinh câu trả lời khi không có căn cứ (không đoán, không suy luận mở).
- Không thay thế hoàn toàn vai trò TA cho câu hỏi phức tạp/mang tính cá nhân hóa.
- Không xử lý report vi phạm, xử lý mâu thuẫn giữa thành viên.

---

## §4. Lát cắt & thiết kế (MỘT CÂU)

> **Một học viên** gõ một câu hỏi về quy định/tài liệu vào kênh hỏi-đáp Discord · **AI quyết định** có tìm thấy căn cứ rõ ràng trong rules/tài liệu chính thức của khóa hay không · **AI trả về** câu trả lời kèm trích dẫn nguồn, hoặc nói rõ "chưa tìm thấy căn cứ, đã chuyển cho admin" — không tự suy đoán.

**Tự kiểm:**
- Bấm vào đâu, gõ gì, ra gì? → Gõ câu hỏi vào kênh chỉ định → bot trả lời kèm nguồn hoặc báo "đã chuyển tag admin".
- Bỏ AI đi việc còn tồn tại không? → Có — hiện admin/TA vẫn đang làm thủ công.

**Thiết kế sơ bộ:**
- Input: tin nhắn học viên trong kênh hỏi-đáp (qua Discord bot).
- Xử lý: RAG trên tập tài liệu chính thức (rules, FAQ, tài liệu khóa học) → truy xuất đoạn liên quan → đánh giá độ tin cậy/độ liên quan.
- Ngưỡng quyết định: nếu độ liên quan/độ tin cậy ≥ ngưỡng đặt trước → trả lời kèm trích dẫn; nếu dưới ngưỡng → tag admin, không tự trả lời.
- Output: tin nhắn trả lời trong cùng thread/kênh, kèm nguồn (tên tài liệu + vị trí).

---

## §5. Chỗ khó (kỹ thuật)

- Xác định ngưỡng "đủ căn cứ" để quyết định trả lời hay chuyển tiếp — quá thấp thì hallucination, quá cao thì bot gần như không trả lời được gì.
- Chất lượng và độ bao phủ của tập tài liệu RAG (rules/FAQ có thể chưa được cấu trúc tốt, thiếu, hoặc rải rác nhiều nơi).
- Nhận diện được câu hỏi nào thuộc phạm vi (quy định/tài liệu) và câu hỏi nào ngoài phạm vi (mang tính cá nhân, tranh luận) để không trả lời sai chỗ.
- Độ trễ phản hồi phải đủ nhanh để không làm giảm trải nghiệm chat (Discord là kênh real-time).

---

## §6. Rủi ro & phương án giảm thiểu

| Rủi ro | Phương án giảm thiểu |
|---|---|
| AI trả lời sai/hallucination gây hiểu nhầm quy định | Bắt buộc có trích dẫn nguồn; không có nguồn = không trả lời, chuyển admin |
| Bot phản hồi quá nhiều gây "rác" (spam) kênh chat (20% học viên lo ngại) | Chỉ phản hồi khi được mention/hỏi trực tiếp hoặc trong kênh chỉ định; áp dụng rate-limit theo user |
| Tập tài liệu RAG không đủ/lỗi thời | Có quy trình cập nhật tài liệu định kỳ; đánh version rõ ràng |
| Học viên spam/test bot với câu hỏi vô nghĩa | Rate-limit theo user; log lại để review |
| Admin/TA không tin tưởng, không muốn dùng | Cho admin xem log + có nút phản hồi "đúng/sai" để cải thiện theo thời gian |
| Không đủ dữ liệu thật (log Discord) để đo bằng chứng | Xin quyền truy cập từ BTC/admin server sớm, có phương án đếm thủ công dự phòng nếu không được cấp quyền bot |

---

## §7. Kiểm thử + quality bar (eval)

**Bộ dữ liệu kiểm thử (golden set):** *(cần nhóm xây dựng — tối thiểu ~20-30 câu hỏi mẫu)*
- Câu hỏi có căn cứ rõ trong tài liệu → kỳ vọng bot trả lời đúng kèm nguồn.
- Câu hỏi KHÔNG có căn cứ trong tài liệu → kỳ vọng bot từ chối trả lời, chuyển admin (không được tự bịa).
- Câu hỏi ngoài phạm vi (cá nhân, tranh luận) → kỳ vọng bot nhận diện và không cố trả lời.

**Chỉ số đo (quality bar):**
- Grounded rate: tỷ lệ câu trả lời có trích dẫn nguồn chính xác / tổng câu trả lời đã trả lời.
- Tỷ lệ từ chối đúng: % câu hỏi không có căn cứ mà bot chuyển admin đúng (không tự bịa).
- Tỷ lệ nhận diện sai phạm vi: % câu hỏi ngoài phạm vi bị bot trả lời nhầm.
- Thời gian phản hồi trung bình.

**Ngưỡng chấp nhận (đề xuất, nhóm điều chỉnh theo thực tế):**
- Grounded rate ≥ 90%.
- Tỷ lệ từ chối đúng ≥ 90% (ưu tiên an toàn hơn là trả lời nhiều).

---

## Phân công (≥3 người, có tên thật)

*(điền tên thật thành viên nhóm — ví dụ cấu trúc theo mẫu CP1)*

| Tên | Vai |
|---|---|
| ___ | Bằng chứng (đếm log Discord, xây golden set) |
| ___ | Prompt / thiết kế RAG |
| ___ | Build (bot + pipeline) |
| ___ | Spec / tài liệu |
| ___ | Validation với user thật |

---

## Cấu trúc repo đề xuất (R7)

```
repo/
├── spec.md              ← file này
├── codebase/            ← code bot, RAG pipeline
├── eval/                ← golden set + script chấm điểm
├── validation/          ← kết quả test với user thật
└── docs/                ← tài liệu tham khảo, rules gốc
```
