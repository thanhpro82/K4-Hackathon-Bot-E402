# PO Master Strategy & Market Research: Trợ Lý Học Viên Discord (AI Thực Chiến)

> Document dành cho **Product Owner (PO)** quản lý chiến lược sản phẩm, nghiên cứu thị trường, trải nghiệm người dùng và thúc đẩy người dùng thật (User Adoption).

---

## 1. Nghiên cứu Thị trường & Phân tích Đối thủ (Market Benchmarks)

| Tiêu chí | **Discord AI Bots (Botpress/eesel AI)** | **Khanmigo (Khan Academy)** | **NotebookLM (Google)** | **Sản phẩm của chúng ta (Discord AI Assistant)** |
|---|---|---|---|---|
| **Trọng tâm chính** | Tự động hóa hỗ trợ cộng đồng | Gia sư gợi mở (Socratic Tutoring) | Tổng hợp & Đọc hiểu tài liệu chuẩn | **Hỏi-đáp Rules & Kỹ thuật dựa trên Căn cứ chính xác** |
| **Môi trường** | Discord / Slack | Web App riêng | Web Workspace | **Ngay trong Discord Chat (Kênh học tập)** |
| **Độ tin cậy (Groundedness)** | Trung bình (Dễ bị hallucination nếu config kém) | Cao (Giới hạn theo chương trình học) | Cực cao (Chỉ trả lời dựa trên file đính kèm) | **Cực cao ($\ge$90% Grounded Rate, không có nguồn = tag Admin)** |
| **Đặc điểm nổi bật** | Trả lời nhanh, kết nối Webhook | Đặt câu hỏi gợi mở, không cho sẵn đáp án | Tạo Podcast audio, tóm tắt PDF | **Không làm rác kênh chat (Rate-limit), Tag Admin khi nghi ngờ** |
| **Điểm yếu** | Trả lời tràn lan gây spam kênh | Không tích hợp kênh chat real-time của cộng đồng | Không có tính năng thông báo/chuyển tiếp cho người thật | **Cần dữ liệu đầu vào (Docs/Rules) được chuẩn hóa tốt** |

### 💡 Bài học chiến lược cho PO:
1. **Học NotebookLM ở tính Groundedness (Căn cứ):** Không được để AI "bịa câu trả lời" (Hallucination) vì sai quy định khóa học sẽ dẫn đến khiếu nại.
2. **Học Khanmigo ở tính an toàn:** Nếu không chắc chắn, hướng dẫn người dùng tìm đến đúng tài liệu thay vì cho câu trả lời bừa.
3. **Né điểm yếu của Discord AI Bot thông thường:** Tránh việc bot "tự động nhảy vào mọi câu chat" gây rác kênh. **Chỉ trả lời khi được mention hoặc trong kênh chỉ định**.

---

## 2. Chân dung Người dùng & Hành vi (User Personas & JTBD)

Dựa trên việc khai thác dữ liệu từ **5,898 tin nhắn Discord thực tế**, chúng ta xác định 3 nhóm người dùng tiêu biểu:

### 👤 Persona 1: "Cú Đêm Lập Trình" (Night-Owl Stretcher)
- **Đặc điểm:** Chiếm **33.5% lượng câu hỏi (20h - 23h, cao nhất lúc 22h đêm)**. Học viên đi làm ban ngày, chỉ học được ban đêm.
- **Pain point:** Khi bị lỗi Git/SSH hoặc không biết quy trình lúc 22h, TA đã nghỉ. Phải chờ 11 tiếng đến 9h sáng hôm sau mới được hỗ trợ.
- **JTBD (Job-to-be-Done):** *"Khi tôi bị kẹt lỗi lúc 11h đêm, tôi muốn có câu trả lời chính xác ngay lập tức, để tôi có thể làm xong bài tập mà không bị đứt mạch suy nghĩ."*

### 👤 Persona 2: "Chiến Sĩ Cuối Tuần" (Weekend Sprinter)
- **Đặc điểm:** Chiếm **47.1% lượng câu hỏi (Thứ 7 & Chủ Nhật)**. Dồn toàn bộ thời gian học vào 2 ngày nghỉ.
- **Pain point:** Cần nộp bài gấp trong ngày nhưng thông tin quy định nộp bài bị trôi rải rác trên Discord.
- **JTBD:** *"Khi tôi cần nộp bài gấp vào Chủ Nhật, tôi muốn tra cứu nhanh tiêu chí nộp bài trong 3 giây, để không bị trễ hạn chót."*

### 👤 Persona 3: "90% Học Viên Thầm Lặng" (Silent Majority)
- **Đặc điểm:** Dữ liệu cho thấy **90.2% học viên (275/305 người)** rất ít hoặc chưa bao giờ đặt câu hỏi công khai. Khảo sát chỉ ra 60% ngại hỏi vì sợ câu hỏi "quá cơ bản".
- **Pain point:** Ngại bị đồng nghiệp/bạn học đánh giá nếu hỏi câu đơn giản trên kênh chung.
- **JTBD:** *"Khi tôi có câu hỏi cơ bản, tôi muốn hỏi một trợ lý AI an toàn mà không sợ bị phán xét, để tôi tự tin tiếp tục học."*

---

## 3. Ma Trận Ưu Tiên Tính Năng (PO Backlog & MoSCoW)

Là PO, bạn sẽ điều phối team tập trung làm đúng những tính năng có giá trị cao nhất cho người dùng:

```text
               GIÁ TRỊ CAO (HIGH VALUE)
                      │
      MUST HAVE       │       SHOULD HAVE
  (Làm ngay MVP)      │    (Làm ở giai đoạn 2)
                      │
  • Trả lời RAG kèm   │  • Nút bấm Feedback
    trích dẫn nguồn   │    👍 / 👎 trực tiếp
  • Rate-limit /      │  • Auto-create ticket
    Mention-only      │    khi Bot không biết
  • Auto-tag Admin    │  • Dashboard đo lường
    khi Low score     │    câu hỏi lặp cho TA
──────────────────────┼──────────────────────
      COULD HAVE      │       WON'T HAVE
   (Làm nếu thừa time)│     (Loại khỏi scope)
                      │
  • Phân tích giọng   │  • AI tự chấm bài tập
    điệu thân thiện   │  • AI tự sửa code hộ
  • Gợi ý câu hỏi     │  • Tự động chat dạo
    liên quan         │    trên kênh chung
                      │
               GIÁ TRỊ THẤP (LOW VALUE)
```

---

## 4. Chiến lược Thúc đẩy Người dùng Thật (User Adoption Plan)

Làm sao để **300+ học viên thật trên Discord** thực sự sử dụng và thích sản phẩm?

### Phase 1: Thử nghiệm An toàn (Soft Launch - Kênh Test)
1. Thêm Bot vào một kênh riêng biệt: `#hỏi-đáp-trợ-lý-ai`.
2. Pin bài hướng dẫn ngắn (2 dòng):
   > 💡 *Cần tra cứu quy định khóa học hay lỗi Git? Hãy tag `@Trợ-lý-AI [câu hỏi]` để nhận câu trả lời kèm trích dẫn ngay lập tức!*

### Phase 2: Kích hoạt Vòng lặp Phản hồi (Feedback Loop)
- Mỗi câu trả lời của Bot luôn có 2 nút bấm: `👍 Hữu ích` và `👎 Chưa đúng`.
- Nếu chọn `👎 Chưa đúng`, Bot hiện khung nhỏ: *"Cảm ơn bạn, mình đã báo Admin xem lại tài liệu này!"*.

### Phase 3: Đo lường & Tinh chỉnh (PO Dashboard & Metrics)
PO theo dõi 3 chỉ số vàng hàng tuần:
1. **Adoption Rate:** Số lượng học viên duy nhất sử dụng Bot / Tổng học viên active.
2. **First Contact Resolution (FCR):** % câu hỏi Bot giải quyết xong mà học viên không cần hỏi lại TA.
3. **Time-to-Answer:** Thời gian chờ trung bình giảm từ **11 tiếng đêm khuya xuống còn 3 giây**.

---

## 5. Phân công Vai trò PO trong Nhóm

Với vai trò PO, bạn sẽ làm việc với 2 thành viên còn lại như sau:

- **Bạn (Product Owner / Strategist):**
  - Quản lý Document này + Cập nhật `spec.md`.
  - Định nghĩa Golden Set (các kịch bản test thật).
  - Thu thập feedback từ học viên thật trên Discord.
  - Thuyết trình Slide / Demo về bài toán & impact kinh doanh ở CP5/CP6.
- **Thành viên 1 (AI / Backend Dev):** Code RAG engine + Discord Bot theo yêu cầu của PO.
  - **Thành viên 2 (Data / Eval Eng):** Nạp dữ liệu `docs/` + Chạy script đo điểm `eval/`.
