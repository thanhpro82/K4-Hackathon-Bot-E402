import os
import re
import urllib.request
import json

class RepoChecker:
    """
    Codelab Submission & Pre-Flight Repo Checker.
    Hỗ trợ kiểm tra cả Repo Cục Bộ lẫn Repo GitHub Từ Xa của bất kỳ học viên nào qua GitHub REST API.
    """
    
    REQUIRED_FILES = [
        "spec.md",
        "README.md",
        "codebase",
        "eval",
        "validation"
    ]
    
    API_KEY_PATTERNS = [
        (r'sk-[a-zA-Z0-9]{32,}', "OpenAI API Key"),
        (r'AIzaSy[a-zA-Z0-9_-]{33}', "Google Gemini API Key"),
        (r'ghp_[a-zA-Z0-9]{36}', "GitHub Personal Access Token"),
        (r'sk-ant-[a-zA-Z0-9_-]{32,}', "Anthropic API Key")
    ]

    def check_local_repo(self, repo_path="."):
        results = {
            "repo_name": os.path.basename(os.path.abspath(repo_path)),
            "missing_files": [],
            "found_files": [],
            "leaked_keys": [],
            "naming_valid": True,
            "status": "PASS"
        }
        
        for req in self.REQUIRED_FILES:
            full_p = os.path.join(repo_path, req)
            if os.path.exists(full_p):
                results["found_files"].append(req)
            else:
                results["missing_files"].append(req)
                
        for root, dirs, files in os.walk(repo_path):
            if '.git' in root or '.venv' in root or 'node_modules' in root:
                continue
            for file in files:
                if file.endswith(('.md', '.py', '.js', '.json', '.env', '.txt', '.yml', '.yaml')):
                    file_p = os.path.join(root, file)
                    try:
                        with open(file_p, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            for pattern, key_type in self.API_KEY_PATTERNS:
                                matches = re.findall(pattern, content)
                                if matches:
                                    results["leaked_keys"].append({
                                        "file": os.path.relpath(file_p, repo_path),
                                        "key_type": key_type
                                    })
                    except Exception:
                        pass
                        
        if results["leaked_keys"]:
            results["status"] = "DANGER (LO API KEY)"
        elif results["missing_files"]:
            results["status"] = "WARNING (THIEU FILE BAT BUOC)"
        else:
            results["status"] = "PASS (SAN SANG NOP CODELABS)"
            
        return results

    def check_remote_github_repo(self, repo_url):
        """
        Kiểm tra đường link GitHub của bất kỳ học viên nào qua GitHub API công khai:
        GET https://api.github.com/repos/{owner}/{repo}/git/trees/main?recursive=1
        """
        match = re.search(r'github\.com/([^/]+)/([^/\s#]+)', repo_url)
        if not match:
            return self.check_local_repo(".")

        owner, repo_name = match.group(1), match.group(2).replace('.git', '')
        
        # Kiểm tra quy chuẩn đặt tên Repo P-XXX
        naming_valid = bool(re.match(r'^P-\d+', repo_name, re.IGNORECASE))

        results = {
            "repo_name": repo_name,
            "naming_valid": naming_valid,
            "missing_files": [],
            "found_files": [],
            "leaked_keys": [],
            "status": "PASS",
            "error_msg": None
        }

        # Thử lấy cây file của nhánh main hoặc master
        branches = ["main", "master"]
        tree = None

        for branch in branches:
            api_url = f"https://api.github.com/repos/{owner}/{repo_name}/git/trees/{branch}?recursive=1"
            req = urllib.request.Request(api_url, headers={'User-Agent': 'DiscordBot-RepoChecker'})
            try:
                with urllib.request.urlopen(req) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    tree = [item['path'] for item in data.get('tree', [])]
                    break
            except Exception:
                continue

        if tree is None:
            results["status"] = "FAIL (KHONG TIM THAY REPO HOAC REPO PRIVATE)"
            results["error_msg"] = f"Không thể truy cập GitHub Repo `{owner}/{repo_name}`. Vui lòng kiểm tra lại link hoặc chuyển Repo sang chế độ Public."
            results["missing_files"] = self.REQUIRED_FILES
            return results

        for req_f in self.REQUIRED_FILES:
            if any(path == req_f or path.startswith(req_f + '/') for path in tree):
                results["found_files"].append(req_f)
            else:
                results["missing_files"].append(req_f)

        if not naming_valid:
            results["status"] = "WARNING (VI PHAM QUY CHUAN TEN P-XXX)"
        elif results["missing_files"]:
            results["status"] = "WARNING (THIEU FILE BAT BUOC)"
        else:
            results["status"] = "PASS (SAN SANG NOP CODELABS)"

        return results

    def format_discord_message(self, results):
        msg = ["🔍 **KẾT QUẢ KIỂM TRA REPO TRƯỚC KHI NỘP CODELABS**\n"]
        msg.append(f"**Tên Repo:** `{results.get('repo_name', 'N/A')}`")
        msg.append(f"**Trạng thái:** `{results['status']}`\n")

        if results.get("error_msg"):
            msg.append(f"❌ **Lỗi:** {results['error_msg']}\n")

        # Cảnh báo tên repo nếu vi phạm quy chuẩn P-XXX
        if not results.get("naming_valid", True):
            msg.append(f"⚠️ **Cảnh báo tên Repo:** Tên `{results.get('repo_name')}` không tuân thủ quy chuẩn `P-XXX` của khóa học (Ví dụ: `P-042`).\n")
        
        msg.append("📁 **Cấu trúc File Nộp Bắt Buộc:**")
        for f in results["found_files"]:
            msg.append(f"  └ ✅ `{f}`: Đã có")
        for f in results["missing_files"]:
            msg.append(f"  └ ❌ `{f}`: **CHƯA CÓ** (Cần bổ sung)")
            
        msg.append("\n🔒 **Kiểm Tra Bảo Mật API Key:**")
        if results["leaked_keys"]:
            msg.append("  ⚠️ **CẢNH BÁO:** Phát hiện rò rỉ API Key!")
            for leak in results["leaked_keys"]:
                msg.append(f"  └ 🚨 File `{leak['file']}` chứa `{leak['key_type']}`")
        else:
            msg.append("  ✅ Tuyệt vời! Không phát hiện API Key lộ trong Repo.")
            
        return "\n".join(msg)

if __name__ == "__main__":
    checker = RepoChecker()
    res = checker.check_remote_github_repo("https://github.com/thanhpro82/Day03_NhomA2_E402")
    print("Status:", res["status"])
    print("Missing files:", res["missing_files"])
    print("Naming valid:", res["naming_valid"])
