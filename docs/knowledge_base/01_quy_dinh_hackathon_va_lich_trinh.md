# 📋 QUY ĐỊNH HACKATHON & LỊCH TRÌNH CHÍNH THỨC (AI THỰC CHIẾN)

## 1. Lịch Trình 6 Mốc Checkpoint (Khoá 3 & Khoá 4)

| Mốc | Khoá 3 | Khoá 4 | Yêu cầu nghiệm thu tại Mốc |
|---|---|---|---|
| **CP1 · Chốt Canvas** | 10:00 N1 | 15:00 N1 | Canvas 7 dòng (hướng, pain 1 câu, evidence, lát cắt 1 câu, willing users, phân công). |
| **CP2 · Show được thứ bấm được** | 12:00 N1 | 17:00 N1 | Prototype Sketch/Mock: Flow chính bấm đi hết được + repo có commit đầu. |
| **CP3 · AI chạy thật + đo lượt 1** | 16:00 N1 | 10:30 N2 | Lời gọi API AI thật ở quyết định trung tâm + Golden Set >=20 cases + Bảng kết quả đo lượt 1. |
| **CP4 · Chốt tiến độ & Spec** | 17:30 N1 | 12:00 N2 | Spec hoàn thiện. **HẠN CỨNG: spec.md commit 23:59 N1 (Quality Bar chốt từ thời điểm này)**. |
| **CP5 · Validation & Dry Run** | 09:00 N2 | 14:00 N2 | Feedback log >=5 mẩu có tên + Changelog + Slide final + Dry run xong. |
| **CP6 · Demo & Pitching** | 10:00 N2 | 15:00 N2 | 5 phút trình bày (Slide 6 trang, live demo 2 case) + 5 phút Q&A. |

---

## 2. Quy Định Nộp Bài & Cấu Trúc Repo Bắt Buộc

Link Repo nhóm được commit trước mốc deadline. Cấu trúc repo chuẩn:

```text
repo/
├── README.md          ← Thành viên (mã HV + tên) + phân công rõ ràng từng phần
├── spec.md            ← AI Spec chi tiết chốt lúc 23:59 N1
├── demo-slides.pdf    ← Slide 6 trang thuyết trình
├── codebase/          ← Prototype code (ghi rõ phần mock)
├── eval/              ← Golden Set 25 cases + bảng đo lường các lượt
├── validation/        ← Feedback log từ >=5 người dùng thật ngoài nhóm
└── docs/              ← Tài liệu nghiên cứu, chiến lược & Knowledge Base
```

---

## 3. Luật Thi & Quy Định Bảo Mật Dữ Liệu

1. **Working Prototype Rule:** Bắt buộc có **>=1 lời gọi API AI thật** ở quyết định trung tâm.
2. **Vibe-Coding Rule:** Dùng AI hỗ trợ code thoải mái, nhưng thành viên không giải thích được phần có tên mình sẽ bị **0 điểm** cá nhân tương ứng (kiểm tra ngẫu nhiên tại CP5/CP6).
3. **Bảo mật Dữ liệu:**
   - Dữ liệu trong `data/` chỉ dùng trong phạm vi Hackathon, không chia sẻ ra ngoài.
   - **Không commit data pack vào repo nộp bài** (chỉ trích dẫn ngắn).
   - Không cố suy ngược danh tính học viên từ data ẩn danh.
   - Không commit API Key cá nhân lên GitHub.
