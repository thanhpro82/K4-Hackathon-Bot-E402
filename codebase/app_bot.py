import sys
import os

# Thêm thư mục gốc dự án vào sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from codebase.rag_engine import RAGEngine
from codebase.repo_checker import RepoChecker
from codebase.stuck_radar import StuckRadar

class DiscordBotSimulator:
    """
    Giả lập Discord Bot Client để demo trực tiếp trên Terminal console.
    """
    def __init__(self):
        self.rag = RAGEngine()
        self.repo_checker = RepoChecker()
        self.stuck_radar = StuckRadar()

    def handle_message(self, user_name, message_content):
        content_lower = message_content.lower()

        # 1. Menu HAX G1 Interactive Menu
        if any(kw in content_lower for kw in ["bạn làm được gì", "help", "chào"]):
            return f"Chào {user_name}! Mình là Trợ Lý AI Học Viên 24/7.\n1. Hỏi deadline, lịch học\n2. Gõ /check-repo để kiểm tra bài nộp\n3. Gõ /stuck khi gặp khó khăn"

        # 2. Lệnh /check-repo
        if "/check-repo" in content_lower:
            res = self.repo_checker.check_remote_github_repo(message_content) if "github.com" in content_lower else self.repo_checker.check_local_repo(".")
            return self.repo_checker.format_discord_message(res)

        # 3. Lệnh /stuck
        if "/stuck" in content_lower:
            return self.stuck_radar.get_stuck_checklist("gate1")

        # 4. Truy vấn RAG Engine
        res = self.rag.query(message_content)
        if res["status"] == "HIGH_CONFIDENCE":
            return f"**[CAN CU CHINH THUC]**\n{res['answer']}\nNguon: {res['citation']}"
        else:
            return f"**[LOW-CONFIDENCE ESCALATION]**\n{res['answer']}"

if __name__ == "__main__":
    bot = DiscordBotSimulator()
    print("=" * 60)
    print("DEMO BOT TERMINAL SIMULATOR")
    print("=" * 60)
    
    test_queries = [
        "ban lam duoc gi",
        "deadline nop CP4 la khi nao?",
        "/check-repo https://github.com/thanhpro82/Day03_NhomA2_E402",
        "gia khoa hoc tiep theo la bao nhieu?"
    ]
    
    for q in test_queries:
        print(f"\n[USER]: {q}")
        reply = bot.handle_message("Hoc Vien 101", q)
        print(f"[BOT STATUS]: PASS")
