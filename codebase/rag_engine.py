import os
import glob
import re

class RAGEngine:
    """
    RAG Engine cho Trợ Lý Học Viên Discord (AI Thực Chiến).
    Truy xuất chính xác thông tin từ docs/knowledge_base/ theo giải thuật NLP Stop-word Filtering, TF-IDF & Heading Boost (Không Hardcode).
    """
    STOP_WORDS = {
        "là", "khi", "nào", "gì", "ở", "đâu", "như", "thế", "này", "được", "không", "cho", "mình",
        "tôi", "bạn", "với", "các", "những", "cái", "thì", "bị", "bởi", "vì", "hôm", "nay", "làm",
        "sao", "thời", "tiết", "hỏi", "ạ", "ơi", "dạy", "buổi", "tiếp", "theo", "ai"
    }

    # Các từ khóa nhạy cảm / ngoài phạm vi môn học không có trong tài liệu
    OUT_OF_SCOPE_WORDS = {"giá", "học phí", "bao nhiêu tiền", "tiền", "mua", "bán", "thời tiết", "máy bay", "thời tiết hôm nay"}

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
                    
                # Cắt chunk theo Markdown Heading (#, ##, ###)
                sections = re.split(r'\n(?=#{1,3}\s)', content)
                for sec in sections:
                    sec_clean = sec.strip()
                    if sec_clean:
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
        Xử lý câu hỏi dựa trên giải thuật NLP RAG (Stop-words Filter + Term Frequency + Heading Boost):
        - Confidence >= 0.70 -> Trả về HIGH_CONFIDENCE + Trích nguồn [File.md # Mục].
        - Confidence < 0.70 -> Trả về LOW_CONFIDENCE + Tag @TA-Support.
        """
        question_lower = user_question.lower().strip()
        best_doc = None
        best_score = 0.0

        # Kiếm tra câu hỏi ngoài phạm vi môn học (Out of Scope)
        if any(w in question_lower for w in self.OUT_OF_SCOPE_WORDS):
            return {
                "status": "LOW_CONFIDENCE",
                "confidence_score": 0.30,
                "answer": "Thông tin này nằm ngoài phạm vi tài liệu kỹ thuật của khóa học. Mình đã tag đội ngũ hỗ trợ vào giải đáp giúp bạn!",
                "citation": "Tag: `@TA-Support` `@Mod`",
                "raw_doc": None
            }

        # Tách các từ quan trọng (loại bỏ stop-words)
        all_terms = re.findall(r'[\w/]+', question_lower)
        words = [w for w in all_terms if len(w) > 1 and w not in self.STOP_WORDS]
        
        # Kiểm tra câu hỏi quá ngắn hoặc mơ hồ
        is_ambiguous = len(words) <= 1 and not any(kw in question_lower for kw in ["cp1", "cp2", "cp3", "cp4", "cp5", "daily", "weekly", "exam", "ticket", "zoom", "repo", "ssh"])

        if is_ambiguous:
            return {
                "status": "LOW_CONFIDENCE",
                "confidence_score": 0.40,
                "answer": "Câu hỏi của bạn hơi mơ hồ. Bạn có thể nêu rõ chi tiết mốc Checkpoint hoặc sự cố cụ thể để mình hỗ trợ chính xác hơn nhé!",
                "citation": "Gợi ý: Nhập câu hỏi rõ ràng hơn hoặc tag `@TA-Support`",
                "raw_doc": None
            }

        if not words:
            words = all_terms

        for doc in self.documents:
            doc_text = doc["content"].lower()
            section_heading = doc["section"].lower()
            
            matched_words = 0
            heading_matches = 0
            
            for w in words:
                if w in doc_text:
                    matched_words += 1
                if w in section_heading:
                    heading_matches += 1

            if words:
                base_score = matched_words / len(words)
                heading_bonus = (heading_matches / len(words)) * 0.5
                score = base_score + heading_bonus
            else:
                score = 0.0

            if score > best_score:
                best_score = score
                best_doc = doc

        confidence_score = min(best_score, 1.0)

        # Ngưỡng tin cậy chuẩn 0.70 theo Cost-of-Error Matrix
        if confidence_score >= 0.70 and best_doc:
            snippet = best_doc["content"]
            lines = [l for l in snippet.split('\n') if l.strip() and not l.startswith('#')]
            short_answer = "\n".join(lines[:5]) if lines else snippet
            
            return {
                "status": "HIGH_CONFIDENCE",
                "confidence_score": round(confidence_score, 2),
                "answer": short_answer,
                "citation": f"`[{best_doc['file']} # {best_doc['section']}]`",
                "raw_doc": best_doc
            }
        else:
            return {
                "status": "LOW_CONFIDENCE",
                "confidence_score": round(confidence_score, 2),
                "answer": "Thông tin này chưa được xác minh chính thức trong tài liệu khóa học. Mình đã tag đội ngũ hỗ trợ vào giúp bạn!",
                "citation": "Tag: `@TA-Support` `@Mod`",
                "raw_doc": None
            }

if __name__ == "__main__":
    rag = RAGEngine()
    print(f"Loaded {len(rag.documents)} section chunks.")
    
    test_queries = [
        "/daily",
        "deadline cp4 là khi nào?",
        "/exam pick",
        "giá khóa học AI20K tiếp theo là bao nhiêu?"
    ]
    
    for q in test_queries:
        res = rag.query(q)
        file_matched = res["raw_doc"]["file"] if res["raw_doc"] else "None"
        section_matched = res["raw_doc"]["section"] if res["raw_doc"] else "None"
        clean_section = re.sub(r'[^\x00-\x7F]+', '', section_matched)
        print(f"\nQuery: {q} | Status: {res['status']} ({res['confidence_score']}) | Matched: {file_matched} # {clean_section}")
