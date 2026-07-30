# 🐍 HƯỚNG DẪN THIẾT LẬP MÔI TRƯỜNG PYTHON & AI LOG

## 1. Cấu Hình Môi Trường Ảo (.venv) & pyproject.toml

### Câu hỏi: "Repo của nhóm không có file pyproject.toml thì sao?"
*   File `pyproject.toml` hoặc `requirements.txt` có thể tự tạo hoặc khởi tạo bằng `poetry init` / `pip freeze`.
*   Tạo môi trường ảo cách chuẩn:
    ```bash
    python -m venv .venv
    # On Windows:
    .venv\Scripts\activate
    # On Mac/Linux:
    source .venv/bin/activate
    ```

### Đánh giá tương thích phiên bản Python:
*   Nên thống nhất cả nhóm dùng cùng phiên bản Python (khuyến nghị Python 3.11 hoặc 3.12).
*   Tránh cài đặt gói thư viện trực tiếp vào Python toàn cục máy để không bị xung đột với teammate.

---

## 2. Hướng Dẫn Tích Hợp AI Log & API Key

*   **API Key của AI Log:** Dùng API Key do BTC cung cấp trong file cấu hình `.env` mẫu.
*   **Kiểm tra AI Log có hoạt động không:**
    *   Sau khi gọi lệnh AI trong code, kiểm tra xem log có bắn về hệ thống logging không.
    *   Tuyệt đối **KHÔNG commit file `.env` chứa API Key thật** lên GitHub public.
