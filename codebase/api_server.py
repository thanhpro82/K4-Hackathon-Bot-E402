import sys
import os
import json
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler

# Thêm thư mục gốc vào path để import codebase
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from codebase.rag_engine import RAGEngine
from codebase.repo_checker import RepoChecker
from codebase.stuck_radar import StuckRadar

# Khởi tạo các module backend
rag_engine = RAGEngine()
repo_checker = RepoChecker()
stuck_radar = StuckRadar()

# Thống kê PO Dashboard
dashboard_stats = {
    "total_queries": 0,
    "high_confidence_queries": 0,
    "low_confidence_queries": 0,
    "escalated_to_ta": 0,
    "feedback_positive": 0,
    "feedback_negative": 0
}

class RequestHandler(BaseHTTPRequestHandler):
    """Zero-dependency HTTP API Request Handler với CORS hỗ trợ đầy đủ."""

    def _set_headers(self, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        """Xử lý CORS Preflight Request."""
        self._set_headers(200)

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)

        if parsed_path.path == '/api/health':
            self._set_headers(200)
            res = {
                "status": "ONLINE",
                "kb_chunks_loaded": len(rag_engine.documents),
                "message": "Tro Ly AI Hoc Vien Backend API Ready"
            }
            self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))

        elif parsed_path.path == '/api/stats':
            self._set_headers(200)
            total = dashboard_stats["total_queries"]
            grounded_rate = round((dashboard_stats["high_confidence_queries"] / total * 100), 1) if total > 0 else 100.0
            escalation_rate = round((dashboard_stats["escalated_to_ta"] / total * 100), 1) if total > 0 else 0.0

            res = {
                "total_queries": total,
                "grounded_rate_percent": grounded_rate,
                "escalation_rate_percent": escalation_rate,
                "high_confidence_queries": dashboard_stats["high_confidence_queries"],
                "low_confidence_queries": dashboard_stats["low_confidence_queries"],
                "feedback_positive": dashboard_stats["feedback_positive"],
                "feedback_negative": dashboard_stats["feedback_negative"]
            }
            self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

    def do_POST(self):
        parsed_path = urllib.parse.urlparse(self.path)

        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else "{}"
        
        try:
            data = json.loads(post_data)
        except Exception:
            data = {}

        if parsed_path.path == '/api/query':
            user_query = data.get("query", "").strip()
            user_name = data.get("user_name", "Học viên")

            if not user_query:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Query cannot be empty"}).encode('utf-8'))
                return

            dashboard_stats["total_queries"] += 1
            query_lower = user_query.lower()

            # 1. HAX G1 Interactive Onboarding Menu
            if any(kw in query_lower for kw in ["bạn làm được gì", "bạn làm dc gì", "help", "chào", "hello", "giúp"]):
                response_payload = {
                    "status": "HIGH_CONFIDENCE",
                    "confidence_score": 1.0,
                    "answer": f"👋 **Chào bạn {user_name}! Mình là Trợ Lý Học Viên Discord.**\n\nMình có thể hỗ trợ bạn 4 nhóm việc:\n1. 📅 **Lịch học:** Workshop (T5, CN), Mentoring Duty (T4, T7), Office Hours (T2, T6).\n2. 📝 **Quy định:** Deadline CP1-CP5, Đặt tên Zoom `G-YY-TXXX`, Repo `P-XXX`.\n3. 🛠️ **Kỹ thuật:** Gỡ lỗi Git SSH (`Repository not found`), `.venv`, `pyproject.toml`.\n4. 🔍 **Bài nộp:** Gõ `/check-repo` hoặc `/check-repo [link-github]` để quét lỗi repo trước khi nộp Codelabs.",
                    "citation": "`[Tài liệu Vận Hành AI20K]`"
                }
                dashboard_stats["high_confidence_queries"] += 1
                self._set_headers(200)
                self.wfile.write(json.dumps(response_payload, ensure_ascii=False).encode('utf-8'))
                return


            # 3. Lệnh /check-repo
            if "/check-repo" in query_lower:
                if "github.com" in query_lower:
                    check_res = repo_checker.check_remote_github_repo(user_query)
                else:
                    check_res = repo_checker.check_local_repo(".")
                formatted_msg = repo_checker.format_discord_message(check_res)
                response_payload = {
                    "status": "HIGH_CONFIDENCE",
                    "confidence_score": 1.0,
                    "answer": formatted_msg,
                    "citation": "`[Pre-Flight Repo Checker API]`"
                }
                dashboard_stats["high_confidence_queries"] += 1
                self._set_headers(200)
                self.wfile.write(json.dumps(response_payload, ensure_ascii=False).encode('utf-8'))
                return

            # 4. Lệnh /stuck
            if "/stuck" in query_lower:
                checklist_msg = stuck_radar.get_stuck_checklist("gate1")
                response_payload = {
                    "status": "HIGH_CONFIDENCE",
                    "confidence_score": 1.0,
                    "answer": checklist_msg,
                    "citation": "`[Proactive Stuck Radar]`"
                }
                dashboard_stats["high_confidence_queries"] += 1
                self._set_headers(200)
                self.wfile.write(json.dumps(response_payload, ensure_ascii=False).encode('utf-8'))
                return

            # 5. RAG Query Engine
            rag_res = rag_engine.query(user_query)

            if rag_res["status"] == "HIGH_CONFIDENCE":
                dashboard_stats["high_confidence_queries"] += 1
            else:
                dashboard_stats["low_confidence_queries"] += 1
                dashboard_stats["escalated_to_ta"] += 1

            self._set_headers(200)
            self.wfile.write(json.dumps(rag_res, ensure_ascii=False).encode('utf-8'))

        elif parsed_path.path == '/api/feedback':
            feedback_type = data.get("type")
            if feedback_type == 'positive':
                dashboard_stats["feedback_positive"] += 1
            elif feedback_type == 'negative':
                dashboard_stats["feedback_negative"] += 1
                
            self._set_headers(200)
            self.wfile.write(json.dumps({"status": "SUCCESS", "current_feedback": dashboard_stats}).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

def run_server(port=5000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, RequestHandler)
    print("=" * 60)
    print(f"Backend Server running at http://localhost:{port}")
    print(f"Loaded Knowledge Chunks: {len(rag_engine.documents)}")
    print("=" * 60)
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
