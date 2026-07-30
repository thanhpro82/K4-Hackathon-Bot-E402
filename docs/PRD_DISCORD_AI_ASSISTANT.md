# Product Requirements Document (PRD)
## Trợ Lý Học Viên Discord (AI Thực Chiến)

---

| **Document Metadata** | **Information** |
|---|---|
| **Product Name** | Trợ Lý Học Viên Discord (Discord AI Course Assistant) |
| **Document Owner** | Product Owner (PO) |
| **Target Release** | Hackathon Batch 03 MVP / Production Phase 1 |
| **Status** | Approved & Ready for Development |
| **Last Updated** | 2026-07-30 |

---

## 1. Executive Summary & Vision

### 1.1 Product Mission
Cung cấp một trợ lý AI thông minh, hoạt động 24/7 trực tiếp trên Discord của khóa học "AI Thực Chiến", giúp học viên tra cứu quy định (rules), tài liệu hướng dẫn và gỡ lỗi kỹ thuật tức thì với **độ chính xác 100% dựa trên căn cứ chính thức**, đồng thời giảm 50%+ tải phản hồi lặp lại cho đội ngũ TA/Admin.

### 1.2 Elevator Pitch (MỘT CÂU)
> **Một học viên** gõ câu hỏi về quy định/tài liệu vào kênh Discord · **AI quyết định** có tìm thấy căn cứ rõ ràng trong tài liệu chính thức hay không · **AI trả về** câu trả lời ngắn gọn kèm trích dẫn nguồn, hoặc tự động tag TA/Admin nếu chưa tìm thấy căn cứ — không tự suy đoán.

---

## 2. Problem Statement & Market Evidence

### 2.1 The Problem
- **Kẹt kênh & Loạn thông tin:** Server có quá nhiều kênh, tài liệu rải rác. 579 câu hỏi trong log Discord bị học viên gõ nhầm vị trí kênh.
- **Lệch khung giờ (Off-peak Gap):** 33.5% câu hỏi tập trung vào đêm khuya (20h–23h) và 47.1% dồn vào cuối tuần (T7–CN). Học viên bị vướng bài tập đêm khuya phải chờ trung bình 8–11 tiếng mới được hỗ trợ.
- **Tâm lý ngại hỏi:** 90.2% học viên (275/305 người) chọn im lặng hoặc rất ít hỏi; 60% khảo sát báo ngại hỏi vì sợ câu hỏi quá cơ bản.
- **TA Quá tải:** 46.2% tổng tin nhắn học viên là câu hỏi (1,970 câu), trong đó 30.7% là lỗi gõ lệnh/ticket thủ công và 15.0% là lỗi lặp đi lặp lại về Git/SSH.

### 2.2 Quantitative Evidence Summary (n=5,898 messages)
- **Total Messages Analyzed:** 5,898 (4,265 Human / 1,633 Bot).
- **Logistics Questions:** 1,178 messages (ticket creation, commands, rules).
- **Technical Questions:** 792 messages (Git clone, SSH keys, `pyproject.toml`, AI log).
- **Time Distribution:** Peak hour at 22:00 (120 questions); 496 questions on weekends.

---

## 3. User Personas & Jobs-To-Be-Done (JTBD)

### 3.1 Persona 1: Cú Đêm Lập Trình (Night-Owl Stretcher)
- **Need:** Tra cứu quy định & gỡ lỗi kỹ thuật lúc 22h-23h đêm khi TA đã nghỉ.
- **JTBD:** *"When I am working on my assignment late at night and hit a roadblock, I want an instant accurate answer grounded in official docs, so that I can finish my task without losing momentum."*

### 3.2 Persona 2: Chiến Sĩ Cuối Tuần (Weekend Sprinter)
- **Need:** Tra cứu tiêu chuẩn nộp bài & deadline gấp vào Chủ Nhật.
- **JTBD:** *"When deadline is approaching on Sunday, I want to confirm submission rules in 3 seconds, so that I don't get penalized."*

### 3.3 Persona 3: Học Viên Thầm Lặng (Silent Majority - 90%)
- **Need:** Đặt câu hỏi cơ bản mà không bị ngượng hoặc làm phiền người thật.
- **JTBD:** *"When I have a basic question, I want to ask an empathetic AI in a judgment-free space, so that I can keep learning with confidence."*

---

## 4. Scope & Feature Requirements (MoSCoW)

### 4.1 In-Scope (Must Have for MVP)
- **FR-1: Scoped Channel & Mention Trigger:** Bot chỉ lắng nghe/trả lời khi được `@mention` hoặc trong kênh `#hỏi-đáp-trợ-lý-ai`.
- **FR-2: Grounded RAG Retrieval:** Truy xuất chính xác đoạn văn bản liên quan từ thư mục `docs/` (Rules, FAQ, Guides).
- **FR-3: Conditional Automation & Thresholding:**
  - `Relevance Score >= Threshold`: Trả lời câu hỏi + trích dẫn chính xác (Tên file, Mục/Trang).
  - `Relevance Score < Threshold`: Trả lời *"Hiện chưa tìm thấy căn cứ trong tài liệu, mình đã báo TA hỗ trợ"* + tag `@TA-Role`.
- **FR-4: Anti-Spam & Rate Limiting:** Tối đa 3 câu hỏi / user / phút để chống spam rác kênh chat.

### 4.2 Out-of-Scope (Non-Goals)
- **N-1:** Không tự sinh câu trả lời khi không có căn cứ (Không tự bịa/guess).
- **N-2:** Không tự động sửa code hoặc viết code hộ bài tập cho học viên.
- **N-3:** Không xử lý tranh chấp, vi phạm kỷ luật hoặc mâu thuẫn cá nhân.

---

## 5. System Architecture & Conversation Flow

### 5.1 Technical Architecture
```text
[Discord User Message] 
       │
       ▼
[Discord Bot Listener] ──(Check Rate-limit & Channel)
       │
       ▼
[RAG Retrieval Engine] ──(Vector Search in /docs)
       │
       ▼
[Confidence Evaluator]
       ├── Score >= 0.75 ──► [Generate Answer + Citation Source]
       └── Score < 0.75  ──► [Escalate: Tag TA Role + Low Confidence Msg]
```

### 5.2 User Experience & 4 Conversation Paths

#### Path 1: Happy Path (High Confidence)
- **User:** `@Trợ-lý-AI deadline nộp bài sprint 1 là khi nào?`
- **Bot:** `Theo file 01-de-bai.md (Mục 4), deadline nộp bài sprint 1 là 23:59 ngày 1. Bạn chú ý nộp đúng hạn nhé!`

#### Path 2: Low-Confidence / Failure Path (Out of Knowledge)
- **User:** `@Trợ-lý-AI thầy giáo khóa sau là ai vậy?`
- **Bot:** `Hiện trong tài liệu chính thức chưa có thông tin về thầy giáo khóa sau. Mình đã tag @TA-Team vào để hỗ trợ bạn thêm nhé!`

#### Path 3: Anti-Spam & Rate Limit Path
- **User:** *(Gõ liên tục 5 tin nhắn trong 10 giây)*
- **Bot:** `Bạn đang gửi câu hỏi quá nhanh. Vui lòng đợi 30 giây trước khi thử lại nhé!`

#### Path 4: User Correction Path
- **User:** `@Trợ-lý-AI không phải, ý mình là deadline nộp bài CP4`
- **Bot:** `À hiểu rồi! Theo file 02-guide.md (Mục 2), deadline nộp bài CP4 là 12:00 ngày 2.`

---

## 6. AI Safety, HAX/PAIR Guidelines & Risk Matrix

### 6.1 Microsoft HAX & Google PAIR Compliance
- **G1 (Make clear what system can do):** Bot hiển thị câu chào: *"Mình là Trợ lý AI, chỉ trả lời dựa trên tài liệu chính thức của khóa học."*
- **G2 (Make clear how well system can do):** Hiển thị rõ nguồn trích dẫn đính kèm để học viên tự đối soát.
- **G8 (Support efficient dismissal):** Học viên có thể bỏ qua phản hồi của bot bất kỳ lúc nào mà không bị đứt luồng chat.
- **G10 (Scope cautiously when uncertain):** Khi không chắc chắn $\rightarrow$ Từ chối trả lời và chuyển Admin.

### 6.2 Risk Mitigation Matrix

| Identified Risk | Severity | Mitigation Strategy (In Spec) |
|---|---|---|
| AI bịa quy định sai (Hallucination) | HIGH | Bắt buộc có trích dẫn nguồn; Score < Threshold = Không trả lời, tag TA. |
| Bot bị coi là spam rác kênh chat | MEDIUM | Rate-limit theo user; chỉ phản hồi khi được mention hoặc gõ đúng kênh. |
| Tài liệu RAG cũ/lỗi thời | MEDIUM | Đánh versioning file trong `docs/`; quy trình cập nhật tài liệu định kỳ. |
| Học viên cố tình hack prompt | LOW | System Prompt siết chặt phạm vi: *"Chỉ trả lời câu hỏi liên quan tới khóa học"*. |

---

## 7. Quality Bar & Testing Plan (Eval)

### 7.1 Key Quality Metrics
- **Grounded Rate:** $\ge 90\%$ (Tỷ lệ câu trả lời có trích dẫn nguồn chính xác tuyệt đối).
- **Right Escalation Rate:** $\ge 90\%$ (Tỷ lệ câu hỏi ngoài tài liệu được bot chuyển TA đúng lúc).
- **Response Latency:** $< 3$ giây cho mỗi câu trả lời.

### 7.2 Golden Set Dataset (`eval/golden_set.json`)
- **Total Test Cases:** 25 cases.
  - 12 High-confidence in-scope cases (Rules, Logistics, SSH setup).
  - 8 Out-of-knowledge cases (Kỳ vọng bot từ chối & tag TA).
  - 5 Out-of-scope / Spam cases (Kỳ vọng bot từ chối khéo).

---

## 8. Validation Plan & Acceptance Criteria

### 8.1 Acceptance Criteria for MVP Release
1. ✅ **Spec Signed Off:** `spec.md` và `PRD` được duyệt đầy đủ.
2. ✅ **Golden Set Executed:** Đạt $\ge 90\%$ trên bộ test dataset trong `eval/`.
3. ✅ **Working Prototype:** Bot phản hồi real-time trên kênh Discord test.
4. ✅ **User Validation:** Có log feedback thực tế từ $\ge 3$ học viên thật trong `validation/`.
