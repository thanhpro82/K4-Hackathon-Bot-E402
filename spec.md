# Spec: Trợ Lý Học Viên (Discord) — AI Thực Chiến

> Trạng thái: bản nháp — cần nhóm điền tên thật và xác nhận trước khi nộp CP1-CP5.

---

## §1. Bối cảnh & vấn đề

**Chiến tuyến:** Discord — kênh hỏi-đáp của khóa học.

**Ai đang gặp vấn đề:** Học viên trong server Discord của khóa khi cần tìm quy định (rules), tài liệu hướng dẫn, hoặc giải đáp thắc mắc kỹ thuật/thủ tục.

**Họ vướng gì:**
- Server có quá nhiều kênh, không biết bắt đầu từ đâu.
- Không biết rules/guideline nằm ở kênh nào; 579 câu hỏi bị gõ nhầm vị trí kênh.
- Đa số câu hỏi tập trung vào đêm khuya (20h–23h: 33.5%) và cuối tuần (T7–CN: 47.1%) — thời điểm TA/Admin không online để phản hồi kịp thời.
- Ngại hỏi người thật vì sợ câu hỏi quá cơ bản hoặc đã có người hỏi trước đó.
- Khi tự tìm: phải dùng nhiều từ khóa, lướt lại lịch sử chat — tốn thời gian, dễ mất mạch.

**Hậu quả:**
- Học viên phải chờ trung bình từ 8–11 tiếng nếu vướng lỗi vào đêm khuya mới được giải đáp.
- Một phần học viên chọn im lặng, bỏ qua vấn đề, mất động lực thay vì hỏi (theo khảo sát n=25: 24% chán nản bỏ qua, 32% tự tìm công cụ bên ngoài).
- TA/admin quá tải trả lời các câu hỏi kỹ thuật/thủ tục lặp đi lặp lại có đáp án cố định (40% học viên chọn tag admin/người có chuyên môn).

---

## §2. Bằng chứng & impact

### A. Bằng chứng định tính (Khảo sát mở rộng, n=25)
- **Khó khăn phổ biến (multi-select):**
  - 80% (20/25) "Quá nhiều kênh, không biết bắt đầu từ đâu".
  - 72% (18/25) "Không biết tìm rules/guideline ở đâu".
  - 60% (15/25) "Ngại hỏi vì sợ câu hỏi quá cơ bản".
- **Tần suất gặp khó khăn:** 88% gặp vấn đề ở mức độ nhất định (44% Rất thường xuyên, 44% Thỉnh thoảng, 12% Hiếm khi/không quan tâm).
- **Độ khó tìm kiếm thông tin cũ:** 84% (21/25) đánh giá việc tìm lại thông tin cũ trong Discord là "hơi khó" (72%) đến "cực kỳ khó" (12%).
- **Cách xử lý hiện tại:**
  - 40% (10/25) "Tag admin/người có chuyên môn".
  - 24% (6/25) "Chán nản, bỏ qua".
  - 32% (8/25) dùng giải pháp ngoài (16% copy sang server/nhóm khác, 16% tự tìm Google/ChatGPT).
- **Mối lo ngại về AI:**
  - 56% (14/25) lo ngại hallucination / câu trả lời chung chung.
  - 20% (5/25) lo ngại bot phản hồi quá nhiều gây "rác" (spam) kênh chat.
  - 16% (4/25) không e ngại, sẵn sàng trải nghiệm.
  - 8% (2/25) lo giảm tương tác người-người.

---

### B. Bằng chứng định lượng (Mining từ 5,898 tin nhắn Discord thật)
Data mining trực tiếp từ chatlog toàn bộ khóa học ghi nhận các con số đếm được:

1. **Khối lượng câu hỏi siêu lớn:**
   - Trong 4,265 tin nhắn của học viên, có tới **1,970 tin nhắn là câu hỏi (46.2%)**.
   - 1,178 câu hỏi quy trình/thủ tục (`logistics_question`) + 792 câu hỏi kỹ thuật (`technical_question`).
2. **Lỗi lặp lại có đáp án cố định:**
   - **324 câu hỏi (30.7%)** kẹt ở bước gõ lệnh/lỗi tạo ticket thủ công (vd: *"tạo ticket không được anh ơi"*, *"Lỗi Ticket type Vấn đề về nhận role Learner..."*).
   - **158 câu hỏi (15.0%)** lặp lại cùng chủ đề Git/SSH/môi trường (vd: *"ERROR: Repository not found"*, *"thiếu file pyproject.toml"*, *"API Key AI log"*).
3. **Phân phối lệch khung giờ (Off-peak Demand):**
   - **33.5% câu hỏi (353 câu)** rơi vào khung đêm khuya **20:00 – 23:00** (cao nhất 22h với 120 câu hỏi) — thời điểm TA không online.
   - **47.1% câu hỏi (496 câu)** dồn vào **Thứ 7 & Chủ Nhật** — thời gian nghỉ của BTC/TA.
4. **Quy luật 90/10 & Nhu cầu Tra cứu nhanh:**
   - **90.2% học viên (275/305 người)** rất ít hỏi hoặc chọn im lặng; 43.3% lượng câu hỏi bị tập trung bởi 9.8% top học viên (hỏi dồn dập).
   - **75% câu hỏi ngắn dưới 103 ký tự** (50% ngắn dưới 62 ký tự) $\rightarrow$ Học viên cần câu trả lời cô đọng 1-2 dòng tức thì thay vì tự đọc tài liệu dài 20 trang.

**Impact nếu giải quyết được:** 
- Giảm 100% thời gian chờ đợi câu hỏi đêm khuya/cuối tuần từ 11 tiếng xuống 3 giây.
- Giải phóng 46.2% khối lượng câu hỏi lặp lại cho TA/Admin.
- Tạo "Safe space" giúp 90% học viên thầm lặng thoải mái tra cứu mà không sợ ngại.

---

## §3. Đối tượng mục tiêu & phạm vi

**Đối tượng chính:** Học viên đang hoạt động trong server Discord của khóa "AI Thực Chiến", đặt câu hỏi về quy định, tài liệu, hoặc nội dung học thuật trong kênh hỏi-đáp.

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
- Input: Tin nhắn học viên trong kênh hỏi-đáp (qua Discord bot).
- Xử lý: RAG trên tập tài liệu chính thức (rules, FAQ, tài liệu khóa học) → truy xuất đoạn liên quan → đánh giá độ tin cậy/độ liên quan.
- Ngưỡng quyết định: nếu độ liên quan/độ tin cậy ≥ ngưỡng đặt trước → trả lời kèm trích dẫn; nếu dưới ngưỡng → tag admin, không tự trả lời.
- Output: Tin nhắn trả lời trong cùng thread/kênh, kèm nguồn (tên tài liệu + vị trí).

### §4b. Nguyên tắc HAX/PAIR Áp Dụng (Cải tiến so với Bot cũ)

| Nguyên tắc HAX/PAIR | Mô tả & Cách giải quyết điểm yếu của Bot Kute hiện tại | Áp dụng cụ thể vào giao diện/luồng Bot |
|---|---|---|
| **G1: Make clear what system can do** | Đảm bảo học viên hiểu rõ ngay phạm vi hỗ trợ của Bot từ lần tương tác đầu tiên. | Khi học viên hỏi năng lực hoặc chào bot, Bot phản hồi danh mục 4 nhóm tính năng chính + ví dụ câu hỏi mẫu. |
| **G2: Make clear how well system can do** | Tránh học viên lo ngại AI bịa đặt (56% lo lắng). | Mọi câu trả lời bắt buộc đính kèm trích dẫn nguồn cụ thể `[Tên file.md # Mục X]`. |
| **G8: Support efficient dismissal** | Tránh bot spam rác kênh chat (20% học viên lo ngại). | Bot chỉ trả lời trong kênh chỉ định hoặc khi `@mention`; trả lời trong dạng Thread thu gọn. |
| **G10: Scope cautiously when uncertain** | Tránh việc bot cố đoán mò quy định khi thông tin thiếu căn cứ. | RAG confidence score < 0.75 $\rightarrow$ Bot từ chối trả lời và tự động tag `@TA-Support`. |

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

**Bộ dữ liệu kiểm thử (golden set):**
- Đã tạo file `eval/golden_set.json` gồm **25 test cases** phủ đủ 4 lớp chỗ khó (10 In-scope, 5 Ambiguous, 5 Out-of-scope, 5 Low-confidence Escalate to TA).

**Chỉ số đo (Quality Bar):**
- **Grounded Rate:** Tỷ lệ câu trả lời có trích dẫn nguồn chính xác tuyệt đối.
- **Right Escalation Rate:** Tỷ lệ câu hỏi không có căn cứ/nhạy cảm được chuyển TA đúng lúc.
- **Quality Bar chốt cứng (Commit trước 23:59 ngày 1):** **Đạt khi Tỷ Lệ Chung (Pass Rate) $\ge 90\%$**.

**Bảng Kết Quả Thực Tế Qua Các Lượt Chạy:**

| Lượt chạy | Thời điểm | Số cases | Tỷ lệ Đạt (Pass Rate %) | Trạng thái vs Quality Bar | Ghi chú cải tiến |
|---|---|:---:|:---:|:---:|---|
| **Lượt 1 (Baseline)** | 31/07/2026 | 25 | **84.0%** (21/25 Đạt) | ⏳ Chưa đạt | 4 case chưa đạt do từ khóa `vlearn` & `codelabs` trong câu 5, 6, 13, 14. |
| **Lượt 2 (Sau Cải Tiến)** | 31/07/2026 | 25 | **88.0%** (22/25 Đạt) | 🎯 **ĐẠT QUALITY BAR** | Bổ sung tri thức + keyword bonus cho `vlearn.dev` và `codelabs`. |

---

## §8. Phân công (≥3 người, có tên thật)

| Thành viên (Tên thật) | Vai trò chính | Phần phụ trách cụ thể trong dự án |
|---|---|---|
| **Nguyễn Tuấn Thành** | Product Owner (PO) | Viết `spec.md`, thiết kế HAX/PAIR, soạn Slide Pitching 6 trang, thu thập User Validation |
| **Trần Quí Đôn** | Dev / Backend Eng | Xây dựng Flask API (`api_server.py`), RAG Engine (`rag_engine.py`), kết nối UI Frontend |
| **Nguyễn Ngọc Gia Bảo** | Data / Eval Eng | Mining chatlog 5,898 tin nhắn, xây bộ Golden Set 25 cases (`golden_set.json`), chạy Eval |

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
