import json
import os
import sys

# Thêm thư mục gốc vào sys.path để import codebase
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from codebase.rag_engine import RAGEngine

def run_evaluation():
    """
    Script tự động chạy 25 test cases trong eval/golden_set.json
    qua codebase/rag_engine.py và tính % Grounded Rate.
    """
    golden_set_path = "eval/golden_set.json"
    if not os.path.exists(golden_set_path):
        print("Không tìm thấy file eval/golden_set.json")
        return

    with open(golden_set_path, "r", encoding="utf-8") as f:
        test_cases = json.load(f)

    rag = RAGEngine()
    total = len(test_cases)
    high_confidence_count = 0
    low_confidence_count = 0
    results = []

    for case in test_cases:
        query_text = case["question"]
        expected_behavior = case.get("expected_behavior", "answer_with_citation")
        
        res = rag.query(query_text)
        status = res["status"]
        score = res["confidence_score"]
        
        passed = False
        if expected_behavior == "answer_with_citation" and status == "HIGH_CONFIDENCE":
            passed = True
            high_confidence_count += 1
        elif expected_behavior in ["escalate_to_ta", "refuse_politely", "ask_clarification", "rate_limit_warning", "answer_scope", "refuse_sensitive"] and status == "LOW_CONFIDENCE":
            passed = True
            low_confidence_count += 1
        elif status == "HIGH_CONFIDENCE":
            high_confidence_count += 1
        else:
            low_confidence_count += 1

        results.append({
            "id": case["id"],
            "question": query_text,
            "category": case.get("category", "general"),
            "expected_behavior": expected_behavior,
            "actual_status": status,
            "confidence_score": score,
            "citation": res.get("citation", ""),
            "passed": passed
        })

    passed_count = sum(1 for r in results if r["passed"])
    pass_rate = (passed_count / total) * 100 if total > 0 else 0

    eval_report = {
        "total_test_cases": total,
        "passed_cases": passed_count,
        "failed_cases": total - passed_count,
        "pass_rate_percent": round(pass_rate, 2),
        "high_confidence_responses": high_confidence_count,
        "low_confidence_escalations": low_confidence_count,
        "details": results
    }

    # Lưu kết quả vào eval/eval_results.json
    with open("eval/eval_results.json", "w", encoding="utf-8") as f:
        json.dump(eval_report, f, ensure_ascii=False, indent=2)

    # Xuất báo cáo đẹp dạng Markdown vào eval/eval_results.md
    md_content = f"""# 📊 BÁO CÁO KẾT QUẢ KIỂM THỬ EVAL (LƯỢT 1 - BASELINE)

- **Tổng số Test Cases:** {total} cases (từ `eval/golden_set.json`)
- **Số case ĐẠT (Passed):** {passed_count} / {total}
- **Tỷ lệ Đạt (Grounded & Escalation Rate):** **{pass_rate:.1f}%**
- **Luồng High Confidence (Có căn cứ):** {high_confidence_count} cases
- **Luồng Low Confidence (Từ chối & Tag TA):** {low_confidence_count} cases

## Chi Tiết 25 Cases Kiểm Thử:

| ID | Câu Hỏi | Kỳ Vọng | Thực Tế | Confidence Score | Kết Quả |
|---|---|---|---|:---:|:---:|
"""
    for r in results:
        status_icon = "✅ ĐẠT" if r["passed"] else "❌ CHƯA ĐẠT"
        md_content += f"| {r['id']} | `{r['question']}` | {r['expected_behavior']} | {r['actual_status']} | {r['confidence_score']} | {status_icon} |\n"

    with open("eval/eval_results.md", "w", encoding="utf-8") as f:
        f.write(md_content)

    print("EVAL COMPLETE! Pass Rate:", round(pass_rate, 1), "%")

if __name__ == "__main__":
    run_evaluation()
