# 🛠️ HƯỚNG DẪN FIX LỖI KỸ THUẬT GIT & SSH KEY

## 1. Lỗi "ERROR: Repository not found / Could not read from remote repository"

### Nguyên nhân:
*   Chưa thêm SSH Key của máy cá nhân vào tài khoản GitHub.
*   Dùng nhầm link HTTPS thay vì link SSH khi clone repo private của BTC.
*   Tài khoản GitHub chưa được cấp quyền truy cập vào Repo khóa học.

### Các bước khắc phục chuẩn:
1. **Kiểm tra SSH Key trên máy:**
   ```bash
   ssh -T git@github.com
   ```
   Nếu nhận được phản hồi `Hi [username]! You've successfully authenticated...` là SSH key đã hoạt động.
2. **Thêm SSH Key nếu chưa có:**
   *   Tạo SSH key mới: `ssh-keygen -t ed25519 -C "your_email@example.com"`
   *   Copy nội dung file `.pub` và dán vào **GitHub $ightarrow$ Settings $ightarrow$ SSH and GPG keys**.
3. **Clone bằng link SSH:**
   *   Dùng lệnh: `git clone git@github.com:[org]/[repo-name].git` (Không dùng link `https://github.com/...`).

---

## 2. Lỗi Quyền Quyền Truy Cập Repo Private

Nếu SSH Key hoạt động nhưng vẫn bị báo `Repository not found`:
*   Gõ lệnh `/ticket create` trên Discord nhờ BTC kiểm tra lại phân quyền GitHub Username.
