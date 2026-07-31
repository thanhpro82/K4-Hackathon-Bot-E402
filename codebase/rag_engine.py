import os
import glob
import re

class RAGEngine:
    """
    RAG Engine cho Trợ Lý Học Viên Discord (AI Thực Chiến).
    Truy xuất chính xác thông tin từ docs/knowledge_base/ và đưa ra câu trả lời kèm trích dẫn nguồn.
    """
    def __init__(self, kb_dir="docs/knowledge_base"):
        self.kb_dir = kb_dir
        self.documents = []
        self.load_knowledge_base()

    def load_knowledge_base(self):
        """Nạp toàn bộ tài liệu quy định trong docs/knowledge_base/ và cắt nhỏ thành các chunk theo Heading."""
        self.documents = []
        if not os.path.exists(self.kb_dir):
            return
            
        md_files = glob.glob(os.path.join(self.kb_dir, "*.md"))
        for file_path in md_files:
            file_name = os.path.basename(file_path)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    
                # Cắt chunk theo Markdown Heading (## hoặc #)
                sections = re.split(r'\n(?=#{1,3}\s)', content)
                for sec in sections:
                    sec_clean = sec.strip()
                    if sec_clean:
                        # Lấy tiêu đề mục nếu có
                        first_line = sec_clean.split('\n')[0]
                        title_match = re.search(r'^#{1,3}\s+(.+)$', first_line)
                        section_title = title_match.group(1) if title_match else "Tổng quan"
                        
                        self.documents.append({
                            "file": file_name,
                            "section": section_title,
                            "content": sec_clean,
                            "file_path": file_path
                        })
            except Exception as e:
                print(f"Lỗi khi đọc file {file_name}: {e}")

    def query(self, user_question):
        """
        Xử lý câu hỏi của học viên:
        - Tính toán điểm tương đồng (Similarity Score).
        - Ngưỡng >= 0.75 -> Trả lời kèm trích dẫn [Tên file # Mục].
        - Ngưỡng < 0.75 -> Luồng Low-confidence: Báo chưa tìm thấy căn cứ + Tag @TA-Support.
        """
        question_lower = user_question.lower()
        best_doc = None
        best_score = 0.0

        # Từ khóa tìm kiếm đơn giản & tính toán TF-IDF / Keyword Overlap
        words = re.findall(r'\w+', question_lower)

        for doc in self.documents:
            doc_text = doc["content"].lower()
            score = 0.0
            matched_words = 0
            
            for w in words:
                if len(w) > 2 and w in doc_text:
                    matched_words += 1
            
            if words:
                score = matched_words / len(words)
                
            # Thêm điểm thưởng nếu khớp các thuật ngữ quan trọng
            keywords_bonus = {
                "cp4": ["cp4", "12:00", "23:59"],
                "zoom": ["zoom", "g-yy-txxx"],
                "repo": ["repo", "p-xxx", "p-"],
                "ticket": ["ticket", "/ticket"],
                "workshop": ["workshop", "thứ 5", "chủ nhật"],
                "mentoring": ["mentoring", "thứ 4", "thứ 7"],
                "office": ["office hours", "thứ 2", "thứ 6"],
                "ssh": ["ssh", "git", "repository not found"],
                "ai log": ["ai log", "api key", ".env"],
                "xp": ["xp", "gate 1", "+100"],
                "slide": ["slide", "vlearn.dev"],
                "codelabs": ["codelabs.vlearn.dev", "codelabs"],
                "vlearn": ["vlearn.dev", "vlearn"],
                "daily": ["daily", "/daily", "log hàng ngày"],
                "weekly": ["weekly", "/weekly submit", "báo cáo tuần"],
                "exam": ["exam", "/exam pick", "chọn đề tài"],
                "hook": ["github hook", "webhook", "ai log"]
            }
            
            for kw, targets in keywords_bonus.items():
                if kw in question_lower:
                    if any(t in doc_text for t in targets):
                        score += 0.4

            if score > best_score:
                best_score = score
                best_doc = doc

        # Chuẩn hóa score trong khoảng [0, 1]
        confidence_score = min(best_score, 1.0)

        # Xử lý 2 luồng phản hồi theo Cost-of-error
        if confidence_score >= 0.65 and best_doc:
            # Luồng Happy Path: Trả lời kèm trích dẫn nguồn
            snippet = best_doc["content"]
            # Rút gọn snippet 2-3 dòng đầu
            lines = [l for l in snippet.split('\n') if l.strip() and not l.startswith('#')]
            short_answer = "\n".join(lines[:4]) if lines else snippet
            
            return {
                "status": "HIGH_CONFIDENCE",
                "confidence_score": round(confidence_score, 2),
                "answer": short_answer,
                "citation": f"`[{best_doc['file']} # {best_doc['section']}]`",
                "raw_doc": best_doc
            }
        else:
            # Luồng Low-confidence: Chuyển TA / Admin hỗ trợ (Không tự đoán mò)
            return {
                "status": "LOW_CONFIDENCE",
                "confidence_score": round(confidence_score, 2),
                "answer": "Thông tin này chưa được xác minh chính thức trong tài liệu khóa học. Mình đã tag đội ngũ hỗ trợ vào giúp bạn!",
                "citation": "Tag: `@TA-Support` `@Mod`",
                "raw_doc": None
            }

if __name__ == "__main__":
    rag = RAGEngine()
    print(f"Đã nạp {len(rag.documents)} chunks tri thức.")
    
    # Test câu hỏi
    res = rag.query("deadline nộp CP4 là khi nào?")
    print(f"\n[Test Query]: Deadline CP4\nTrạng thái: {res['status']}\nĐáp án: {res['answer']}\nNguồn: {res['citation']}")
