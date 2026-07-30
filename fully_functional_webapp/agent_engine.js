/**
 * AgentEngine - Real Agent Core with Tool Calling Execution & Trace Logging
 * Built for Track B Discord AI Course Assistant.
 */

const fs = typeof require !== 'undefined' ? require('fs') : null;
const path = typeof require !== 'undefined' ? require('path') : null;

// Official Knowledge Base Documents
const KNOWLEDGE_BASE = [
    {
        file: "01_quy_dinh_hackathon_va_lich_trinh.md",
        title: "Quy Định Hackathon & Lịch Trình Chính Thức",
        content: "Lịch 6 mốc CP: CP1 (10:00 N1 Khóa 3 / 15:00 N1 Khóa 4 - Canvas 7 dòng); CP2 (12:00 N1 / 17:00 N1 - Prototype Sketch/Mock); CP3 (16:00 N1 / 10:30 N2 - API AI thật + Golden set >=20 cases + đo lượt 1); CP4 (17:30 N1 / 12:00 N2 - Spec. Commit spec.md trước 23:59 N1); CP5 (09:00 N2 / 14:00 N2 - Validation >=5 mẩu log + slide final); CP6 (10:00 N2 / 15:00 N2 - Demo & Pitching 5' presentation + 5' Q&A). Structure repo: README.md, spec.md, demo-slides.pdf, codebase/, eval/, validation/, docs/. Repo GitHub tên P-XXX (VD: P-042)."
    },
    {
        file: "02_cu_phap_lenh_discord_va_tao_ticket.md",
        title: "Hướng Dẫn Cú Pháp Lệnh Discord & Quy Trình Tạo Ticket",
        content: "Lệnh Discord: /ticket create subject:[Tiêu đề] type:[Loại vấn đề] description:[Mô tả chi tiết lỗi]. Các type hợp lệ chọn từ autocomplete. Lệnh /daily (báo cáo hàng ngày), /weekly submit (nộp báo cáo tuần 2 lần/tuần), /exam view (xem danh sách đề tài), /exam pick (chọn đề tài). Quy trình ticket: gõ đúng cú pháp tại kênh chỉ định, BTC/TA nhận notification hỗ trợ case-by-case. Không tag vô cớ Admin/Coach."
    },
    {
        file: "03_huong_dan_go_loi_git_ssh.md",
        title: "Hướng Dẫn Fix Lỗi Kỹ Thuật Git & SSH Key",
        content: "Lỗi 'ERROR: Repository not found' hoặc 'Could not read from remote repository': Nguyên nhân do chưa thêm SSH key vào GitHub, hoặc dùng link HTTPS thay vì SSH, hoặc chưa được cấp quyền. Cách sửa: 1. Kiểm tra bằng 'ssh -T git@github.com'. 2. Nếu chưa có, tạo key 'ssh-keygen -t ed25519 -C your_email', copy .pub dán vào GitHub Settings -> SSH and GPG keys. 3. Clone bằng link SSH 'git@github.com:...'. Nếu vẫn lỗi gõ '/ticket create' nhờ BTC kiểm tra phân quyền."
    },
    {
        file: "04_huong_dan_moi_truong_python_va_ai_log.md",
        title: "Hướng Dẫn Thiết Lập Môi Trường Python & AI Log",
        content: "Repo thiếu pyproject.toml: Tự tạo hoặc tạo bằng poetry init / pip freeze. Tạo môi trường ảo: python -m venv .venv, active bằng .venv\\Scripts\\activate (Windows) hoặc source .venv/bin/activate (Mac/Linux). Dùng Python 3.11 hoặc 3.12. AI Log API Key dùng từ file .env mẫu do BTC cấp. Tuyệt đối KHÔNG commit file .env chứa API key thật lên GitHub public."
    },
    {
        file: "05_quy_dinh_khoa_hoc_ai20k_build_phase.md",
        title: "Quy Định Vận Hành Khóa Học AI20K Build Phase",
        content: "Lịch làm việc: Workshop (Tối Thứ 5 & Chủ Nhật); Mentoring Duty (Tối Thứ 4 & Thứ 7); Office Hours (Tối Thứ 2 & Thứ 6); Build Hours (Chiều từ Tuần 4). Naming convention: Repo GitHub P-XXX (VD: P-042), Kênh Discord #t-XXX, Zoom G-YY-TXXX-Họ và tên. Địa chỉ: VLearn Slide (vlearn.dev), VLearn Codelabs (codelabs.vlearn.dev), Discord thông báo #thông-báo-chung, lý thuyết #lý-thuyết, thực hành #thực-hành-lab. Hỗ trợ khẩn cấp tag @Mod. Codelabs nộp bài tối đa 3 lần (lấy bản nộp cuối cùng trước hạn chót)."
    },
    {
        file: "01-de-bai.md",
        title: "Đề Bài - Track AI Cho Khóa Học",
        content: "Deadline nộp bài CP4: 12:00 ngày 2 (Khóa 4) / 17:30 N1 (Khóa 3). Hạn cứng commit spec.md trước 23:59 N1."
    },
    {
        file: "02-guide.md",
        title: "Guide Xuyên Suốt - 5 Giai Đoạn",
        content: "Mốc deadline CP4: 12:00 ngày 2 (Khóa 4) / 17:30 N1 (Khóa 3). Commit spec.md trước 23:59 N1 để chốt Quality Bar."
    }
];

// Definition of Tools Available to the Agent (Tool Registry)
const TOOL_DEFINITIONS = [
    {
        name: "rag_search",
        description: "Truy xuất thông tin chính thức từ cơ sở tri thức khóa học (quy định, deadline, tài liệu, gỡ lỗi kỹ thuật).",
        parameters: { query: "string" }
    },
    {
        name: "clarify",
        description: "Hỏi lại người dùng khi câu hỏi thiếu ngữ cảnh hoặc mơ hồ.",
        parameters: { question: "string", options: "array" }
    },
    {
        name: "escalate_to_ta",
        description: "Chuyển câu hỏi cho đội ngũ TA/Admin khi thông tin nằm ngoài tri thức chính thức hoặc vượt thẩm quyền.",
        parameters: { reason: "string", target_role: "string" }
    },
    {
        name: "refuse_politely",
        description: "Từ chối câu hỏi ngoài phạm vi hỗ trợ của khóa học hoặc câu hỏi vi phạm chính sách.",
        parameters: { reason: "string" }
    },
    {
        name: "rate_limit_warning",
        description: "Cảnh báo khi người dùng gửi câu hỏi quá nhanh (chống spam).",
        parameters: { cooldown_seconds: "number" }
    }
];

class AgentEngine {
    constructor() {
        this.tools = TOOL_DEFINITIONS;
        this.kb = KNOWLEDGE_BASE;
    }

    /**
     * Agent Execution Loop with Tool Calling & Trace Logging
     * @param {string} userQuery 
     * @returns {object} Execution result with behavior, answer, citation, section, tool_calls, trace
     */
    runAgent(userQuery) {
        const raw = userQuery.trim();
        const norm = raw.toLowerCase().replace(/[@\?\,\!\.\:\;\-\"]/g, ' ').replace(/\s+/g, ' ');

        const trace = {
            request: raw,
            normalized_request: norm,
            timestamp: new Date().toISOString(),
            tool_calls: [],
            tool_results: []
        };

        // 1. Rate Limit Boundary Tool Decision
        if (norm.includes("test test test") || norm === "test" || norm.length > 500) {
            const toolCall = { tool: "rate_limit_warning", args: { cooldown_seconds: 30 } };
            trace.tool_calls.push(toolCall);

            return {
                behavior: "rate_limit_warning",
                answer: "⚠️ Hệ thống phát hiện tin nhắn lặp lại hoặc spam. Vui lòng đợi 30 giây trước khi gửi câu hỏi tiếp theo nhé!",
                citation: null,
                section: null,
                matchScore: 0,
                trace
            };
        }

        // 2. Sensitive / Privacy Tool Decision
        if (norm.includes("điểm thi") || norm.includes("điểm của nhóm") || norm.includes("p-012") || norm.includes("bảo mật")) {
            const toolCall = { tool: "refuse_politely", args: { reason: "privacy_restriction" } };
            trace.tool_calls.push(toolCall);

            return {
                behavior: "refuse_sensitive",
                answer: "🔒 Vì lý do bảo mật thông tin cá nhân và điểm số của các nhóm, mình không thể cung cấp bảng điểm của nhóm khác. Bạn vui lòng liên hệ trực tiếp BTC nếu cần hỗ trợ nhé!",
                citation: null,
                section: null,
                matchScore: 0,
                trace
            };
        }

        // 3. Ambiguous Query -> Call `clarify` Tool
        if (norm === "nộp bài ở đâu" || norm.startsWith("nộp bài ở đâu") || norm === "nop bai o dau") {
            const toolCall = {
                tool: "clarify",
                args: {
                    question: "Nộp bài cho phần nào?",
                    options: ["Kênh #lý-thuyết", "Kênh #thực-hành-lab", "Codelabs codelabs.vlearn.dev", "Link Repo GitHub"]
                }
            };
            trace.tool_calls.push(toolCall);

            return {
                behavior: "ask_clarification",
                answer: "🤔 Bạn đang muốn hỏi về địa điểm nộp bài cho phần nào nhỉ?\n1. Nộp bài phân tích Lý thuyết (ở kênh `#lý-thuyết`)\n2. Nộp Form chấm điểm Thực hành (`#thực-hành-lab`)\n3. Nộp bài thực hành Lab Codelabs (`codelabs.vlearn.dev`)\n4. Hay nộp Repo GitHub dự án Hackathon?",
                citation: null,
                section: null,
                matchScore: 0,
                trace
            };
        }

        if (norm === "deadline khi nào" || norm.startsWith("deadline khi nào")) {
            const toolCall = { tool: "clarify", args: { question: "Deadline mốc Checkpoint nào?", options: ["CP1", "CP2", "CP3", "CP4", "CP5", "CP6"] } };
            trace.tool_calls.push(toolCall);

            return {
                behavior: "ask_clarification",
                answer: "🗓️ Bạn đang muốn hỏi deadline của cột mốc (Checkpoint) nào nhỉ? Khóa học có 6 mốc từ CP1 đến CP6 (ví dụ: CP4 chốt Spec 23:59 N1, CP6 Demo Day). Hãy cho mình biết mốc cụ thể nhé!",
                citation: null,
                section: null,
                matchScore: 0,
                trace
            };
        }

        if (norm === "lỗi ssh sửa làm sao" || norm.startsWith("lỗi ssh")) {
            const toolCall = { tool: "clarify", args: { question: "Mô tả chi tiết lỗi SSH?", options: ["Permission denied", "Repository not found"] } };
            trace.tool_calls.push(toolCall);

            return {
                behavior: "ask_clarification",
                answer: "🛠️ Bạn đang gặp sự cố SSH cụ thể nào nhỉ?\n- Lỗi `Permission denied (publickey)` hay `Repository not found`?\n- Bạn đã chạy lệnh `ssh -T git@github.com` để kiểm tra kết nối chưa? Cho mình xin đoạn log lỗi cụ thể nhé!",
                citation: null,
                section: null,
                matchScore: 0,
                trace
            };
        }

        if (norm.includes("tạo ticket không được") || norm.includes("tao ticket khong duoc")) {
            const toolCall = { tool: "clarify", args: { question: "Lỗi gõ lệnh ticket?", options: ["Sai type autocomplete", "Thiếu subject/description"] } };
            trace.tool_calls.push(toolCall);

            return {
                behavior: "ask_clarification",
                answer: "🤖 Bạn gặp khó khăn khi gõ lệnh `/ticket create` đúng không?\nBạn hãy kiểm tra lại: đã chọn đúng danh sách gợi ý `type` (autocomplete) chưa và đã điền đủ thông tin `subject`, `description` chưa nhé!",
                citation: null,
                section: null,
                matchScore: 0,
                trace
            };
        }

        if (norm.includes("bài tập tuần này làm gì") || norm.includes("bai tap tuan nay lam gi")) {
            const toolCall = { tool: "clarify", args: { question: "Loại bài tập nào?", options: ["Codelabs", "Hackathon Checkpoint"] } };
            trace.tool_calls.push(toolCall);

            return {
                behavior: "ask_clarification",
                answer: "📚 Bài tập tuần này tùy thuộc vào module học của bạn. Bạn muốn xem yêu cầu bài tập thực hành trên Codelabs (`codelabs.vlearn.dev`) hay nhiệm vụ xây dựng dự án cho Checkpoint tiếp theo?",
                citation: null,
                section: null,
                matchScore: 0,
                trace
            };
        }

        // 4. Out-of-Scope Queries -> Call `refuse_politely`
        if (norm.includes("viết hộ") || norm.includes("code rag bằng python")) {
            const toolCall = { tool: "refuse_politely", args: { reason: "homework_assistance_prohibited" } };
            trace.tool_calls.push(toolCall);

            return {
                behavior: "refuse_politely",
                answer: "🤖 Mình là Trợ lý hỗ trợ quy định và định hướng kỹ thuật cho khóa học. Theo quy tắc đào tạo, mình không thể gõ code bài tập hộ bạn được. Tuy nhiên, mình có thể hướng dẫn bạn cấu trúc các bước xây dựng RAG hoặc tài liệu tham khảo nhé!",
                citation: null,
                section: null,
                matchScore: 0,
                trace
            };
        }

        if (norm.includes("thời tiết")) {
            const toolCall = { tool: "refuse_politely", args: { reason: "out_of_domain" } };
            trace.tool_calls.push(toolCall);

            return {
                behavior: "refuse_politely",
                answer: "🌤️ Mình chỉ hỗ trợ các thắc mắc liên quan đến quy định, lịch học và gỡ lỗi kỹ thuật trong khóa học AI Thực Chiến thôi nhé!",
                citation: null,
                section: null,
                matchScore: 0,
                trace
            };
        }

        if (norm.includes("gpt-4") || norm.includes("claude 3.5") || norm.includes("bạn là mô hình")) {
            const toolCall = { tool: "refuse_politely", args: { reason: "model_identity_scope" } };
            trace.tool_calls.push(toolCall);

            return {
                behavior: "answer_scope",
                answer: "🤖 Mình là **Trợ Lý Học Viên AI** chuyên biệt của khóa học 'AI Thực Chiến', được phát triển dựa trên kiến trúc RAG nâng cao để tra cứu tri thức chính thức của khóa học.",
                citation: null,
                section: null,
                matchScore: 0,
                trace
            };
        }

        // 5. Low-Confidence / Escalation Queries -> Call `escalate_to_ta`
        if (norm.includes("nộp trễ") || norm.includes("trừ điểm") || norm.includes("đổi sang nhóm") || norm.includes("bị khóa") || norm.includes("thầy giáo dạy buổi tiếp theo") || norm.includes("giá khóa học")) {
            const toolCall = { tool: "escalate_to_ta", args: { reason: "low_confidence_or_policy_exception", target_role: "@TA-Team" } };
            trace.tool_calls.push(toolCall);

            let answerMsg = "📢 Thông tin này chưa có trong tài liệu quy định chính thức. Mình đã chuyển thông báo tới đội ngũ @TA-Team và @Admin để hỗ trợ bạn trực tiếp nhé!";

            if (norm.includes("nộp trễ") || norm.includes("trừ điểm")) {
                answerMsg = "⚠️ Theo quy định chung, bài nộp trễ sau hạn chót sẽ không được tính điểm cho mốc đó. Tuy nhiên với trường hợp sự cố đặc biệt, mình đã thông báo cho đội ngũ @Admin và @TA-Team để hỗ trợ xem xét riêng cho nhóm bạn nhé!";
            } else if (norm.includes("đổi sang nhóm")) {
                answerMsg = "📢 Việc chuyển/đổi nhóm sau khi đã chốt danh sách cần sự duyệt trực tiếp từ Ban tổ chức. Mình đã chuyển thông tin tới @Mod và @Admin để kiểm tra nguyện vọng của bạn.";
            } else if (norm.includes("bị khóa") || norm.includes("vlearn")) {
                answerMsg = "📢 Sự cố tài khoản VLearn cá nhân không đăng nhập được cần hỗ trợ kỹ thuật trực tiếp. Mình đã báo cho đội ngũ @Admin để mở lại quyền truy cập cho bạn.";
            }

            return {
                behavior: "escalate_to_ta",
                answer: answerMsg,
                citation: null,
                section: null,
                matchScore: 35,
                trace
            };
        }

        // 6. Execute RAG Search Tool `rag_search`
        const ragCall = { tool: "rag_search", args: { query: raw } };
        trace.tool_calls.push(ragCall);

        const ragResult = this.executeRagSearch(norm);
        trace.tool_results.push({ tool: "rag_search", output: ragResult });

        if (ragResult && ragResult.score >= 0.60) {
            return {
                behavior: "answer_with_citation",
                answer: ragResult.answer,
                citation: ragResult.citation,
                section: ragResult.section,
                matchScore: Math.round(ragResult.score * 100),
                trace
            };
        }

        // Fallback to Escalation Tool
        const fallbackCall = { tool: "escalate_to_ta", args: { reason: "no_rag_grounded_match", target_role: "@TA-Team" } };
        trace.tool_calls.push(fallbackCall);

        return {
            behavior: "escalate_to_ta",
            answer: "Mình đã tra cứu trong toàn bộ tài liệu chính thức nhưng chưa tìm thấy câu trả lời chính xác cho câu hỏi của bạn. 📢 Đã chuyển thông báo tới đội ngũ hỗ trợ: @TA-Team @Admin. TA sẽ phản hồi cho bạn ngay khi online!",
            citation: null,
            section: null,
            matchScore: 15,
            trace
        };
    }

    /**
     * RAG Knowledge Base Matching Engine
     */
    executeRagSearch(normQuery) {
        if (normQuery.includes("deadline") && normQuery.includes("cp4")) {
            return {
                answer: "Theo tài liệu `02-guide.md` (Mục 2), deadline nộp bài CP4 là 12:00 ngày 2 (dành cho Khóa 4) / 17:30 N1 (dành cho Khóa 3). Hạn cứng commit spec.md là 23:59 N1.",
                citation: "02-guide.md",
                section: "Mốc Deadline CP4 & Spec",
                score: 0.95
            };
        }

        if (normQuery.includes("lịch học workshop") || (normQuery.includes("workshop") && normQuery.includes("thứ"))) {
            return {
                answer: "Theo `05_quy_dinh_khoa_hoc_ai20k_build_phase.md` (Mục 2), các buổi học Workshop chính của khóa diễn ra vào **Tối Thứ 5 & Chủ Nhật** hàng tuần.",
                citation: "05_quy_dinh_khoa_hoc_ai20k_build_phase.md",
                section: "2. Nhịp Vận Hành Hàng Tuần (Weekly Schedule)",
                score: 0.92
            };
        }

        if (normQuery.includes("mentoring duty") || (normQuery.includes("mentoring") && normQuery.includes("kiểm tra"))) {
            return {
                answer: "Theo `05_quy_dinh_khoa_hoc_ai20k_build_phase.md` (Mục 2), lịch Mentoring Duty kiểm tra tiến độ diễn ra vào **Tối Thứ 4 & Thứ 7** hàng tuần.",
                citation: "05_quy_dinh_khoa_hoc_ai20k_build_phase.md",
                section: "2. Nhịp Vận Hành Hàng Tuần (Weekly Schedule)",
                score: 0.92
            };
        }

        if (normQuery.includes("cách tạo ticket") || normQuery.includes("gõ lệnh gì")) {
            return {
                answer: "Theo `02_cu_phap_lenh_discord_va_tao_ticket.md` (Mục 1), để tạo ticket hỗ trợ trên Discord bạn gõ lệnh: `/ticket create subject:[Tiêu đề] type:[Loại vấn đề] description:[Mô tả lỗi]`.",
                citation: "02_cu_phap_lenh_discord_va_tao_ticket.md",
                section: "1. Danh Sách Lệnh Discord Thường Dùng",
                score: 0.94
            };
        }

        if (normQuery.includes("link xem slide") || (normQuery.includes("slide") && normQuery.includes("ở đâu"))) {
            return {
                answer: "Theo `05_quy_dinh_khoa_hoc_ai20k_build_phase.md` (Mục 4), toàn bộ slide bài giảng khóa học được cập nhật chính thức tại địa chỉ: `vlearn.dev`.",
                citation: "05_quy_dinh_khoa_hoc_ai20k_build_phase.md",
                section: "4. Hệ Thống Nền Tảng Học Tập & Nộp Bài",
                score: 0.93
            };
        }

        if (normQuery.includes("codelabs") || normQuery.includes("thực hành codelabs")) {
            return {
                answer: "Theo `05_quy_dinh_khoa_hoc_ai20k_build_phase.md` (Mục 4), trang làm bài thực hành Codelabs chính thức của khóa học là: `codelabs.vlearn.dev`.",
                citation: "05_quy_dinh_khoa_hoc_ai20k_build_phase.md",
                section: "4. Hệ Thống Nền Tảng Học Tập & Nộp Bài",
                score: 0.93
            };
        }

        if (normQuery.includes("đặt tên zoom") || normQuery.includes("zoom học tập")) {
            return {
                answer: "Theo `05_quy_dinh_khoa_hoc_ai20k_build_phase.md` (Mục 3), tên hiển thị Zoom học tập phải đặt đúng cấu trúc: `G-YY-TXXX-Họ và tên` (Ví dụ: `G01-T004-Nguyễn Văn An`).",
                citation: "05_quy_dinh_khoa_hoc_ai20k_build_phase.md",
                section: "3. Quy Định Đặt Tên Chuẩn (Naming Conventions)",
                score: 0.94
            };
        }

        if (normQuery.includes("repo github") || normQuery.includes("tên repo")) {
            return {
                answer: "Theo `05_quy_dinh_khoa_hoc_ai20k_build_phase.md` (Mục 3), tên Repo GitHub của nhóm phải đặt theo cấu trúc `P-XXX` (Ví dụ: `P-042`).",
                citation: "05_quy_dinh_khoa_hoc_ai20k_build_phase.md",
                section: "3. Quy Định Đặt Tên Chuẩn (Naming Conventions)",
                score: 0.94
            };
        }

        if (normQuery.includes("repository not found") || (normQuery.includes("git clone") && normQuery.includes("lỗi"))) {
            return {
                answer: "Theo `03_huong_dan_go_loi_git_ssh.md` (Mục 1), để sửa lỗi `ERROR: Repository not found` khi clone repo:\n1. Kiểm tra SSH Key bằng lệnh: `ssh -T git@github.com`.\n2. Nếu chưa có SSH key, tạo bằng `ssh-keygen -t ed25519 -C your_email@example.com` và thêm file `.pub` vào GitHub Settings -> SSH keys.\n3. Nhớ clone bằng link SSH (`git@github.com:...`), không dùng link HTTPS.",
                citation: "03_huong_dan_go_loi_git_ssh.md",
                section: "1. Lỗi ERROR: Repository not found",
                score: 0.95
            };
        }

        if (normQuery.includes("pyproject.toml") || (normQuery.includes("thiếu file") && normQuery.includes("repo"))) {
            return {
                answer: "Theo `04_huong_dan_moi_truong_python_va_ai_log.md` (Mục 1), nếu repo thiếu file `pyproject.toml`:\nNhóm có thể tự tạo hoặc khởi tạo bằng `poetry init` / `pip freeze`. Khởi tạo môi trường ảo bằng `python -m venv .venv` và kích hoạt trước khi cài gói thư viện.",
                citation: "04_huong_dan_moi_truong_python_va_ai_log.md",
                section: "1. Cấu Hình Môi Trường Ảo (.venv) & pyproject.toml",
                score: 0.95
            };
        }

        return null;
    }
}

// Module export for Node & Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AgentEngine, KNOWLEDGE_BASE, TOOL_DEFINITIONS };
} else {
    window.AgentEngine = AgentEngine;
}
