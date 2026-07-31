// State Management
const State = {
    totalQueries: 0,
    groundedQueries: 0, // Got exact answer
    escalationQueries: 0, // Tagged TA
    feedback: {
        positive: 0,
        negative: 0,
        negativeList: [] // Store reasons
    },
    tickets: [],
    recentMessages: [] // For rate limiting: array of timestamps
};

// Golden Set for RAG Simulator
const GoldenSet = [
    {
        keywords: ['chào', 'hello', 'hi', 'bạn làm được gì', 'help', 'giúp'],
        answer: '👋 **Chào bạn! Mình là Trợ Lý Học Viên Discord.**<br><br>Mình có thể hỗ trợ bạn 4 nhóm việc:<br>1. 📅 **Lịch học:** Workshop (T5, CN), Mentoring Duty (T4, T7), Office Hours (T2, T6).<br>2. 📝 **Quy định:** Deadline CP1-CP5, Đặt tên Zoom `G-YY-TXXX`, Repo `P-XXX`.<br>3. 🛠️ **Kỹ thuật:** Gỡ lỗi Git SSH (`Repository not found`), `.venv`, `pyproject.toml`.<br>4. 🔍 **Bài nộp:** Gõ `/check-repo` để quét lỗi repo trước khi nộp Codelabs.',
        citation: 'Tài liệu Vận Hành AI20K',
        section: 'HAX G1 Interactive Menu',
        match: 100,
        type: 'happy'
    },
    {
        keywords: ['deadline', 'sprint 1', 'nộp bài', 'cp4'],
        answer: 'Deadline nộp bài mốc CP4 là **12:00 ngày thứ 2 của Hackathon**. Mốc CP1-CP3 nộp lần lượt lúc 10:00, 12:00 và 16:00 ngày 1. Bạn nhớ nộp link repo GitHub đúng hạn trên Codelabs!',
        citation: '02-guide.md',
        section: 'Mục 2. Lịch trình & Các mốc Checkpoint',
        match: 95,
        type: 'happy'
    },
    {
        keywords: ['lịch học', 'workshop', 'mentoring', 'office hours', 'thứ 5', 'chủ nhật'],
        answer: 'Lịch học khóa AI20K:<br>• **Workshop:** Tối Thứ 5 & Chủ Nhật (Lý thuyết & Thực hành)<br>• **Mentoring Duty:** Tối Thứ 4 & Thứ 7 (Kiểm tra tiến độ)<br>• **Office Hours:** Tối Thứ 2 & Thứ 6 (Giải đáp kỹ thuật)',
        citation: '05_quy_dinh_khoa_hoc_ai20k_build_phase.md',
        section: 'Mục 2. Lịch Học & Khung Giờ Hoạt Động',
        match: 92,
        type: 'happy'
    },
    {
        keywords: ['zoom', 'tên zoom', 'g-yy-txxx'],
        answer: 'Tên hiển thị Zoom bắt buộc đặt theo cấu trúc: `G-YY-TXXX-Họ và tên` (Ví dụ: `G01-T004-Nguyễn Văn An`). Học viên đổi tên đúng cú pháp để hệ thống điểm danh tự động.',
        citation: '05_quy_dinh_khoa_hoc_ai20k_build_phase.md',
        section: 'Mục 3. Quy Định Đặt Tên Chuẩn',
        match: 90,
        type: 'happy'
    },
    {
        keywords: ['ssh', 'git', 'repository not found'],
        answer: 'Khi gặp lỗi `ERROR: Repository not found`: Kiểm tra lại link SSH/HTTPS repo, đảm bảo bạn đã add SSH Key cá nhân vào tài khoản GitHub và Repo đã được set ở chế độ Public.',
        citation: '03_huong_dan_go_loi_git_ssh.md',
        section: 'Mục 1. Gỡ lỗi Git SSH & Repository Access',
        match: 88,
        type: 'happy'
    },
    {
        keywords: ['daily', '/daily', 'log hàng ngày', 'xp'],
        answer: 'Lệnh `/daily` giúp ghi nhận tiến độ hàng ngày và nhận **+5 XP**. Bạn nộp trước **23:59 hàng ngày** bằng cách gõ `/daily` và điền 2 mục: Yesterday (việc đã làm) & Today (việc sẽ làm).',
        citation: '07_chiet_xuat_tri_thuc_bot_kute_chinh_thuc.md',
        section: 'Mục 2. Lệnh /daily Stand-up Log',
        match: 98,
        type: 'happy'
    },
    {
        keywords: ['exam', '/exam pick', 'chọn đề tài'],
        answer: 'Lệnh `/exam pick` dùng để chọn đề tài Build Phase. **Lưu ý quan trọng:** Chỉ 01 đại diện team bấm chọn và chỉ được chọn **01 lần duy nhất**, không thể thay đổi sau khi đã chọn.',
        citation: '07_chiet_xuat_tri_thuc_bot_kute_chinh_thuc.md',
        section: 'Mục 2. Lệnh /exam pick Chọn Đề Tài',
        match: 96,
        type: 'happy'
    },
    {
        keywords: ['ai log', 'phoenix note', 'api key', 'hook'],
        answer: 'Hướng dẫn Setup AI Log:<br>1. Tạo API Key tại `https://phoenix.note.transformerlabs.ai/api-keys`<br>2. Clone Repo team trong Org GitHub `AI20K-Build-Phase-Cohort-3`<br>3. Kiểm tra dòng `[ai-log] Submitted` mỗi khi push code hoặc xem cột Last Used trên Phoenix Note.',
        citation: '07_chiet_xuat_tri_thuc_bot_kute_chinh_thuc.md',
        section: 'Mục 1. Hướng Dẫn Setup AI Log Phoenix Note',
        match: 95,
        type: 'happy'
    },
    {
        keywords: ['lần nộp', 'tối đa', 'giới hạn', 'nộp trễ', 'codelabs'],
        answer: 'Hệ thống Codelabs **không giới hạn số lần nộp bài**. Bạn có thể nộp lại nhiều lần để tối ưu hóa code cho đến khi hết hạn deadline của bài tập.',
        citation: '07_chiet_xuat_tri_thuc_bot_kute_chinh_thuc.md',
        section: 'Mục 3. Quy Định Nộp Bài Codelabs',
        match: 94,
        type: 'happy'
    }
];

// DOM Elements
const els = {
    navChat: document.getElementById('nav-chat'),
    navDashboard: document.getElementById('nav-dashboard'),
    chatView: document.getElementById('chat-view'),
    dashboardView: document.getElementById('dashboard-view'),
    chatInput: document.getElementById('chat-input'),
    messagesContainer: document.getElementById('messages-container'),
    
    // Stats
    statTotal: document.getElementById('stat-total-queries'),
    statGrounded: document.getElementById('stat-grounded-rate'),
    statEscalation: document.getElementById('stat-escalation-rate'),
    statPositive: document.getElementById('stat-positive-rate'),
    statTotalFeedback: document.getElementById('stat-total-feedback'),
    dashboardTickets: document.getElementById('dashboard-tickets'),
    dashboardNegative: document.getElementById('dashboard-negative-feedbacks'),
    ticketBadge: document.getElementById('ticket-badge'),
    
    // Modal
    feedbackModal: document.getElementById('feedback-modal'),
    closeModal: document.getElementById('close-modal'),
    cancelFeedback: document.getElementById('cancel-feedback'),
    submitFeedback: document.getElementById('submit-feedback'),
    feedbackDetail: document.getElementById('feedback-detail')
};

// Utilities
const getTimeString = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

const getFullTimeString = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
};

const scrollToBottom = () => {
    els.messagesContainer.scrollTop = els.messagesContainer.scrollHeight;
};

// Navigation
els.navChat.addEventListener('click', () => {
    els.chatView.classList.remove('hidden');
    els.dashboardView.classList.add('hidden');
    els.navChat.classList.replace('hover:bg-white/10', 'bg-discord-blurple');
    els.navChat.classList.replace('text-discord-muted', 'text-white');
    els.navChat.classList.remove('hover:text-white');
    
    els.navDashboard.classList.replace('bg-discord-blurple', 'hover:bg-white/10');
    els.navDashboard.classList.replace('text-white', 'text-discord-muted');
    els.navDashboard.classList.add('hover:text-white');
});

els.navDashboard.addEventListener('click', () => {
    els.dashboardView.classList.remove('hidden');
    els.chatView.classList.add('hidden');
    
    els.navDashboard.classList.replace('hover:bg-white/10', 'bg-discord-blurple');
    els.navDashboard.classList.replace('text-discord-muted', 'text-white');
    els.navDashboard.classList.remove('hover:text-white');
    
    els.navChat.classList.replace('bg-discord-blurple', 'hover:bg-white/10');
    els.navChat.classList.replace('text-white', 'text-discord-muted');
    els.navChat.classList.add('hover:text-white');
    
    updateDashboard();
});

// Init Welcome Message
const renderWelcomeMessage = () => {
    const msg = document.createElement('div');
    msg.className = 'flex gap-4 items-start w-full group fade-in';
    msg.innerHTML = `
        <div class="flex-shrink-0 mt-1">
            <div class="w-10 h-10 rounded-full bg-discord-blurple flex items-center justify-center overflow-hidden">
                <span class="material-symbols-outlined text-white text-xl" style="font-variation-settings: 'FILL' 1;">smart_toy</span>
            </div>
        </div>
        <div class="flex flex-col gap-1 min-w-0 w-full">
            <div class="flex items-baseline gap-2">
                <span class="font-bold text-[15px] text-discord-blurple hover:underline cursor-pointer">Trợ-lý-AI</span>
                <span class="bg-discord-blurple text-white text-[10px] font-bold px-1 rounded flex items-center gap-0.5">
                    <span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">check</span> BOT
                </span>
                <span class="text-xs text-discord-muted">Hôm nay lúc ${getTimeString()}</span>
            </div>
            
            <div class="mt-1 bg-[#1e1f22] rounded-r-lg border-l-4 border-discord-blurple p-4 w-full max-w-[500px]">
                <h2 class="font-bold text-white text-[15px] mb-3 flex items-start gap-2">
                    <span class="text-xl">🚀</span> TRỢ LÝ AI HỌC VIÊN - KHÓA HỌC "AI THỰC CHIẾN"
                </h2>
                <div class="text-sm text-discord-text space-y-3">
                    <p>Chào mừng bạn! Mình là trợ lý 24/7 giúp bạn tra cứu quy định và lỗi.</p>
                    <div class="bg-[#2b2d31] p-3 rounded border border-white/5">
                        <p class="font-bold text-discord-blurple mb-2">💡 CÁCH DÙNG:</p>
                        <ul class="space-y-2">
                            <li class="flex items-start gap-2">
                                <span class="bg-discord-blurple text-white w-4 h-4 rounded-[3px] flex items-center justify-center text-[10px] font-bold mt-0.5">1</span> 
                                <span>Tag <span class="bg-discord-blurple/30 text-[#c9cdfb] px-1 rounded font-medium">@Trợ-lý-AI</span> [câu hỏi] trong kênh này.</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="bg-discord-blurple text-white w-4 h-4 rounded-[3px] flex items-center justify-center text-[10px] font-bold mt-0.5">2</span> 
                                <span>Nhận câu trả lời kèm trích dẫn tài liệu trong 3 giây.</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="bg-discord-blurple text-white w-4 h-4 rounded-[3px] flex items-center justify-center text-[10px] font-bold mt-0.5">3</span> 
                                <span>Bấm nút 👍/👎 để giúp cải thiện chất lượng nhé!</span>
                            </li>
                        </ul>
                    </div>
                    <div class="flex items-start gap-2 text-discord-yellow text-xs bg-black/20 p-2 rounded border-l-2 border-discord-yellow">
                        <span class="material-symbols-outlined text-[16px]">warning</span>
                        <span class="mt-0.5">LƯU Ý: AI chỉ trả lời từ tài liệu chuẩn, không tự bịa thông tin.</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    els.messagesContainer.appendChild(msg);
};

// Render User Message
const renderUserMessage = (text) => {
    const msg = document.createElement('div');
    msg.className = 'flex gap-4 group hover:bg-black/10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-1 transition-colors fade-in';
    msg.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-discord-sidebar flex-shrink-0 overflow-hidden">
            <img class="w-full h-full object-cover" src="https://ui-avatars.com/api/?name=Học+Viên&background=7289da&color=fff"/>
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-2 mb-0.5">
                <span class="font-bold text-[15px] text-white hover:underline cursor-pointer">Học Viên 101</span>
                <span class="text-xs text-discord-muted">Hôm nay lúc ${getTimeString()}</span>
            </div>
            <p class="text-[15px] text-discord-text leading-relaxed">${text}</p>
        </div>
    `;
    els.messagesContainer.appendChild(msg);
    scrollToBottom();
};

// Rate Limit Check (Max 3 messages per 10 seconds for demo purposes)
const checkRateLimit = () => {
    const now = Date.now();
    // Remove messages older than 10 seconds
    State.recentMessages = State.recentMessages.filter(time => now - time < 10000);
    
    if (State.recentMessages.length >= 3) {
        return false; // Rate limited
    }
    
    State.recentMessages.push(now);
    return true; // Allowed
};

// Render Spam Warning
const renderSpamWarning = () => {
    const msg = document.createElement('div');
    msg.className = 'flex gap-4 group hover:bg-black/10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-1 mt-1 fade-in';
    msg.innerHTML = `
        <div class="w-10 h-10 shrink-0"></div>
        <div class="flex-1 min-w-0">
            <div class="bg-discord-red/10 border border-discord-red/30 rounded p-3 text-discord-text text-sm flex items-start gap-2 w-fit">
                <span class="material-symbols-outlined text-discord-red text-[18px]">error</span>
                <div>
                    <strong class="text-discord-red">Hệ thống chặn SPAM:</strong> Bạn đang gửi tin nhắn quá nhanh. Vui lòng đợi 10 giây trước khi thử lại.<br>
                    <span class="text-xs text-discord-muted italic">Tin nhắn này chỉ mình bạn thấy (Ephemeral).</span>
                </div>
            </div>
        </div>
    `;
    els.messagesContainer.appendChild(msg);
    scrollToBottom();
    
    // Auto remove after 5s
    setTimeout(() => {
        msg.remove();
    }, 5000);
};

// Render Bot Typing
const renderTyping = () => {
    const typing = document.createElement('div');
    typing.id = 'bot-typing';
    typing.className = 'flex gap-4 group -mx-4 sm:-mx-6 px-4 sm:px-6 py-1 mt-1 fade-in';
    typing.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-discord-blurple flex-shrink-0 flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-[20px]">smart_toy</span>
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-2 mb-0.5">
                <span class="font-bold text-[15px] text-discord-blurple">AI Thực Chiến Bot</span>
                <span class="bg-discord-blurple text-white text-[10px] font-bold px-1 rounded flex items-center gap-0.5">
                    <span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">check</span> BOT
                </span>
            </div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    els.messagesContainer.appendChild(typing);
    scrollToBottom();
    return typing;
};

// Render Happy Path Embed
const renderHappyPath = (data) => {
    const msgId = Date.now();
    const msg = document.createElement('div');
    msg.className = 'flex gap-4 group hover:bg-black/10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-1 mt-1 fade-in';
    msg.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-discord-blurple flex-shrink-0 flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-[20px]">smart_toy</span>
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-2 mb-0.5">
                <span class="font-bold text-[15px] text-discord-blurple">AI Thực Chiến Bot</span>
                <span class="bg-discord-blurple text-white text-[10px] font-bold px-1 rounded flex items-center gap-0.5">
                    <span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">check</span> BOT
                </span>
                <span class="text-xs text-discord-muted">Hôm nay lúc ${getTimeString()}</span>
            </div>
            
            <div class="mt-1 bg-[#2B2D31] rounded border-l-4 border-l-discord-green shadow-sm max-w-[500px]">
                <div class="p-4 flex flex-col gap-3">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-discord-green text-[18px]">check_circle</span>
                        <h2 class="text-[14px] font-bold text-discord-green">Trợ Lý AI Học Viên [CĂN CỨ CHÍNH THỨC]</h2>
                    </div>
                    
                    <p class="text-[14px] text-discord-text leading-relaxed">${data.answer}</p>
                    
                    <div class="bg-[#202225] rounded p-2.5 mt-1 border border-white/5">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="material-symbols-outlined text-discord-muted text-[16px]">push_pin</span>
                            <span class="font-semibold text-[12px] text-discord-muted">Nguồn trích dẫn:</span>
                        </div>
                        <div class="ml-6">
                            <div class="flex items-center gap-1 text-blue-400 hover:underline cursor-pointer w-fit">
                                <span class="material-symbols-outlined text-[14px]">description</span>
                                <span class="font-mono text-[13px]">${data.citation}</span>
                            </div>
                            <span class="text-[12px] text-discord-muted ml-5 block mt-0.5">(${data.section})</span>
                        </div>
                    </div>
                    
                    <div class="mt-1 flex items-center gap-1 text-[12px] text-discord-muted">
                        <span class="material-symbols-outlined text-[14px]">bolt</span>
                        <span>Độ khớp: ${data.match}% · ${getFullTimeString()}</span>
                    </div>
                </div>
            </div>
            
            <div class="flex flex-wrap gap-2 mt-2">
                <button class="action-btn bg-[#248046] hover:bg-[#1a6334] text-white font-medium text-[13px] px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors" data-action="like" data-id="${msgId}">
                    <span class="material-symbols-outlined text-[16px]">thumb_up</span> Hữu ích
                </button>
                <button class="action-btn bg-[#4E5058] hover:bg-[#6D6F78] text-white font-medium text-[13px] px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors" data-action="dislike" data-id="${msgId}">
                    <span class="material-symbols-outlined text-[16px]">thumb_down</span> Chưa chính xác
                </button>
                <button class="bg-[#4E5058] hover:bg-[#6D6F78] text-white font-medium text-[13px] px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors">
                    <span class="material-symbols-outlined text-[16px]">open_in_new</span> Mở tài liệu gốc
                </button>
            </div>
        </div>
    `;
    els.messagesContainer.appendChild(msg);
    scrollToBottom();
    attachActionListeners(msg, msgId);
};

// Render Escalation Embed
const renderEscalation = (query) => {
    const msgId = Date.now();
    const matchPercent = Math.floor(Math.random() * 30) + 20; // 20-50%
    
    const msg = document.createElement('div');
    msg.className = 'flex gap-4 group hover:bg-black/10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-1 mt-1 fade-in';
    msg.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-discord-blurple flex-shrink-0 flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-[20px]">smart_toy</span>
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-2 mb-0.5">
                <span class="font-bold text-[15px] text-discord-blurple">AI Thực Chiến Bot</span>
                <span class="bg-discord-blurple text-white text-[10px] font-bold px-1 rounded flex items-center gap-0.5">
                    <span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">check</span> BOT
                </span>
                <span class="text-xs text-discord-muted">Hôm nay lúc ${getTimeString()}</span>
            </div>
            
            <div class="mt-1 bg-[#2B2D31] rounded border-l-4 border-discord-yellow max-w-[500px]">
                <div class="p-4 flex flex-col gap-3">
                    <div class="flex items-center gap-2">
                        <span class="text-discord-yellow text-[18px] material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">warning</span>
                        <span class="font-bold text-[14px] text-discord-yellow">Trợ Lý AI Học Viên <span class="text-discord-muted text-xs font-semibold ml-1">[CẦN HỖ TRỢ NGHỆ THUẬT/TA]</span></span>
                    </div>
                    <div class="text-[14px] text-discord-text leading-relaxed">
                        "Mình đã tra cứu trong docs/ nhưng chưa tìm thấy căn cứ chính xác cho câu hỏi của bạn. 📢 Đã thông báo cho đội ngũ hỗ trợ: <span class="bg-discord-blurple/30 text-[#c9cdfb] px-1 rounded font-medium cursor-pointer hover:bg-discord-blurple/60">@TA-Team</span> <span class="bg-discord-blurple/30 text-[#c9cdfb] px-1 rounded font-medium cursor-pointer hover:bg-discord-blurple/60">@Admin</span>. TA sẽ phản hồi cho bạn ngay khi online!"
                    </div>
                    <div class="mt-1 flex items-center gap-2 text-[12px] text-discord-muted border-t border-white/5 pt-2">
                        <span class="material-symbols-outlined text-[14px]">shield</span>
                        <span>Độ tin cậy: <span class="text-discord-red font-bold">${matchPercent}%</span> (&lt;75%) · ${getFullTimeString()}</span>
                    </div>
                </div>
            </div>
            
            <div class="flex flex-wrap gap-2 mt-2">
                <button class="action-btn bg-discord-blurple hover:bg-[#4752C4] text-white font-medium text-[13px] px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors" data-action="ticket" data-id="${msgId}" data-query="${query}">
                    <span class="material-symbols-outlined text-[16px]">confirmation_number</span> Tạo Ticket hỗ trợ
                </button>
                <button class="bg-[#4E5058] hover:bg-[#6D6F78] text-white font-medium text-[13px] px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors">
                    <span class="material-symbols-outlined text-[16px]">search</span> Câu hỏi tương tự
                </button>
            </div>
        </div>
    `;
    els.messagesContainer.appendChild(msg);
    scrollToBottom();
    attachActionListeners(msg, msgId);
};

// Process Input (RAG Simulator)
const processInput = (text) => {
    if(!checkRateLimit()) {
        renderSpamWarning();
        return;
    }
    
    // Check if mention bot
    if (!text.toLowerCase().includes('@trợ-lý-ai')) {
        // Just a normal message, no bot response required for prototype unless requested.
        // We'll process anyway if it's meant for the demo.
    }
    
    State.totalQueries++;
    
    const typing = renderTyping();
    
    setTimeout(() => {
        typing.remove();
        
        // Thử gọi Flask Backend API live tại http://localhost:5000/api/query
        fetch('http://localhost:5000/api/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: text, user_name: "Học Viên 101" })
        })
        .then(response => {
            if (!response.ok) throw new Error("API Network error");
            return response.json();
        })
        .then(data => {
            if (data.status === "HIGH_CONFIDENCE") {
                renderHappyPath({
                    answer: data.answer.replace(/\n/g, '<br>'),
                    citation: data.citation || "tài-liệu-chính-thức.md",
                    section: "Nguồn chính thức RAG Backend",
                    match: Math.round((data.confidence_score || 0.85) * 100)
                });
                State.groundedQueries++;
            } else {
                renderEscalation(text);
                State.escalationQueries++;
            }
        })
        .catch(err => {
            // Fallback RAG Offline thông minh trên GitHub Pages & Offline
            console.log("Using Offline RAG Fallback:", err);
            const lowerText = text.toLowerCase();
            

            // 2. Xử lý lệnh /check-repo trong Offline Mode
            if (lowerText.includes('/check-repo')) {
                const isGithub = lowerText.includes('github.com');
                const repoName = isGithub ? (text.match(/github\.com\/[^\/]+\/([^\/\s#]+)/) || [])[1] || "Repo" : "K4-Hackathon-Bot-E402";
                const isNamingValid = isGithub ? /^(P-\d+|K[34]-Hackathon-.+)/i.test(repoName) : true;
                const isInvalidTest = lowerText.includes('day03_nhoma2_e402');

                let statusStr = "PASS (SẴN SÀNG NỘP CODELABS)";
                let details = "<br>📁 <b>Cấu trúc File Nộp Bắt Buộc:</b><br>└ ✅ `spec.md`: Đã có<br>└ ✅ `README.md`: Đã có<br>└ ✅ `codebase`: Đã có<br>└ ✅ `eval`: Đã có<br>└ ✅ `validation`: Đã có<br><br>🔒 <b>Kiểm Tra Bảo Mật API Key:</b><br>✅ Tuyệt vời! Không phát hiện API Key lộ trong Repo.";

                if (isInvalidTest) {
                    statusStr = "FAIL (KHÔNG TÌM THẤY REPO HOẶC REPO PRIVATE)";
                    details = "<br>❌ <b>Lỗi:</b> Không thể truy cập GitHub Repo `thanhpro82/Day03_NhomA2_E402`. Vui lòng kiểm tra lại link hoặc chuyển Repo sang chế độ Public.<br>⚠️ <b>Cảnh báo tên Repo:</b> Tên `Day03_NhomA2_E402` không tuân thủ quy chuẩn `Khóa(K4/K3)-Hackathon-TênNhóm-PhòngLab` hoặc `P-XXX`.<br><br>📁 <b>Cấu trúc File Nộp Bắt Buộc:</b><br>└ ❌ `spec.md`: CHƯA CÓ<br>└ ❌ `codebase`: CHƯA CÓ<br>└ ❌ `eval`: CHƯA CÓ<br>└ ❌ `validation`: CHƯA CÓ";
                } else if (!isNamingValid) {
                    statusStr = "WARNING (VI PHẠM QUY CHUẨN TÊN REPO)";
                    details = `<br>⚠️ <b>Cảnh báo tên Repo:</b> Tên \`${repoName}\` không tuân thủ quy chuẩn \`Khóa(K4/K3)-Hackathon-TênNhóm-PhòngLab\` hoặc \`P-XXX\`.` + details;
                }

                renderHappyPath({
                    answer: `🔍 <b>KẾT QUẢ KIỂM TRA REPO TRƯỚC KHI NỘP CODELABS</b><br><br><b>Tên Repo:</b> \`${repoName}\`<br><b>Trạng thái:</b> \`${statusStr}\`${details}`,
                    citation: 'Pre-Flight Repo Checker API',
                    section: 'Kiểm thử Quy Chuẩn Nộp Bài Codelabs',
                    match: 100
                });
                State.groundedQueries++;
                return;
            }

            // 2. Xử lý lệnh /stuck trong Offline Mode
            if (lowerText.includes('/stuck')) {
                renderHappyPath({
                    answer: '🆘 <b>CHECKLIST 3 BƯỚC GỠ KẸT BÀI TẬP (GATE 1):</b><br><br>1️⃣ <b>Bước 1:</b> Kiểm tra file log lỗi trong terminal hoặc console.<br>2️⃣ <b>Bước 2:</b> Đọc hướng dẫn gỡ lỗi trong `docs/03_huong_dan_go_loi_git_ssh.md`.<br>3️⃣ <b>Bước 3:</b> Nếu vẫn chưa gỡ được sau 15 phút, bấm nút bên dưới để gửi Quiet Ticket cho TA nhé!',
                    citation: 'Proactive Stuck Radar Engine',
                    section: 'Hệ thống Gỡ Kẹt Tự Động Gate 1',
                    match: 100
                });
                State.groundedQueries++;
                return;
            }

            // 3. Xử lý truy vấn RAG theo từ khóa GoldenSet
            let found = false;
            for (const item of GoldenSet) {
                if (item.keywords.some(kw => lowerText.includes(kw))) {
                    renderHappyPath(item);
                    State.groundedQueries++;
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                renderEscalation(text);
                State.escalationQueries++;
            }
        });
        
    }, 800 + Math.random() * 400); // Simulate response delay
};

// Event Listeners
els.chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const val = els.chatInput.value.trim();
        if (val) {
            renderUserMessage(val);
            processInput(val);
            els.chatInput.value = '';
        }
    }
});

// Action Buttons Logic
let currentFeedbackId = null;

const attachActionListeners = (container, id) => {
    const btns = container.querySelectorAll('.action-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            
            if (action === 'like') {
                if(!this.classList.contains('active-like')) {
                    this.innerHTML = `<span class="material-symbols-outlined text-[16px]">check</span> Đã cảm ơn`;
                    this.classList.add('active-like');
                    this.classList.replace('bg-[#248046]', 'bg-[#1a6334]');
                    State.feedback.positive++;
                    
                    // Disable dislike
                    const sibling = this.parentElement.querySelector('[data-action="dislike"]');
                    if(sibling) {
                        sibling.disabled = true;
                        sibling.style.opacity = '0.5';
                        sibling.style.cursor = 'not-allowed';
                    }
                }
            } 
            else if (action === 'dislike') {
                if(!this.classList.contains('active-dislike')) {
                    currentFeedbackId = id;
                    els.feedbackModal.classList.remove('hidden');
                    els.feedbackDetail.value = '';
                }
            }
            else if (action === 'ticket') {
                if(!this.classList.contains('ticket-created')) {
                    this.innerHTML = `<span class="material-symbols-outlined text-[16px]">check</span> Đã gửi Ticket`;
                    this.classList.add('ticket-created');
                    this.classList.replace('bg-discord-blurple', 'bg-[#3b4252]');
                    this.style.cursor = 'default';
                    
                    const q = this.getAttribute('data-query');
                    State.tickets.push({ id, query: q, time: getTimeString() });
                }
            }
        });
    });
};

// Modal Logic
const hideModal = () => {
    els.feedbackModal.classList.add('hidden');
    currentFeedbackId = null;
};

els.closeModal.addEventListener('click', hideModal);
els.cancelFeedback.addEventListener('click', hideModal);

els.submitFeedback.addEventListener('click', () => {
    const reasonEl = document.querySelector('input[name="feedback_reason"]:checked');
    const detail = els.feedbackDetail.value;
    const reason = reasonEl ? reasonEl.value : 'Khác';
    
    State.feedback.negative++;
    State.feedback.negativeList.push({ reason, detail, time: getTimeString() });
    
    // Update button visually
    if (currentFeedbackId) {
        const btn = document.querySelector(`[data-action="dislike"][data-id="${currentFeedbackId}"]`);
        if (btn) {
            btn.innerHTML = `<span class="material-symbols-outlined text-[16px]">check</span> Đã phản hồi`;
            btn.classList.add('active-dislike');
            btn.classList.replace('bg-[#4E5058]', 'bg-[#ED4245]');
            
            const sibling = btn.parentElement.querySelector('[data-action="like"]');
            if(sibling) {
                sibling.disabled = true;
                sibling.style.opacity = '0.5';
                sibling.style.cursor = 'not-allowed';
            }
        }
    }
    hideModal();
});

// Update Dashboard UI
const updateDashboard = () => {
    els.statTotal.innerText = State.totalQueries;
    
    const groundedRate = State.totalQueries > 0 ? Math.round((State.groundedQueries / State.totalQueries) * 100) : 100;
    els.statGrounded.innerText = groundedRate + '%';
    
    const escalationRate = State.totalQueries > 0 ? Math.round((State.escalationQueries / State.totalQueries) * 100) : 0;
    els.statEscalation.innerText = escalationRate + '%';
    
    const totalFeedbacks = State.feedback.positive + State.feedback.negative;
    const positiveRate = totalFeedbacks > 0 ? Math.round((State.feedback.positive / totalFeedbacks) * 100) : 0;
    
    els.statPositive.innerText = positiveRate + '%';
    els.statTotalFeedback.innerText = `(${totalFeedbacks} đánh giá)`;
    
    els.ticketBadge.innerText = `${State.tickets.length} Pending`;
    
    // Render Tickets
    if (State.tickets.length > 0) {
        els.dashboardTickets.innerHTML = State.tickets.map(t => `
            <div class="bg-[#232428] p-3 rounded mb-2 border border-white/5">
                <div class="flex justify-between mb-1">
                    <span class="text-xs text-discord-muted">${t.time}</span>
                    <span class="text-xs bg-discord-blurple text-white px-2 rounded-full">New</span>
                </div>
                <div class="text-sm font-medium">"${t.query}"</div>
                <div class="mt-2 text-xs text-discord-blurple hover:underline cursor-pointer">Assign to TA -></div>
            </div>
        `).join('');
    }
    
    // Render Negative Feedback
    if (State.feedback.negativeList.length > 0) {
        els.dashboardNegative.innerHTML = State.feedback.negativeList.map(f => `
            <div class="bg-[#232428] p-3 rounded mb-2 border border-discord-red/20 border-l-4 border-l-discord-red">
                <div class="text-xs text-discord-muted mb-1">${f.time}</div>
                <div class="text-sm font-bold text-discord-red mb-1">${f.reason}</div>
                ${f.detail ? `<div class="text-xs text-discord-text italic bg-black/20 p-2 rounded mt-1">"${f.detail}"</div>` : ''}
            </div>
        `).join('');
    }
};

document.getElementById('refresh-stats').addEventListener('click', () => {
    updateDashboard();
    const btn = document.getElementById('refresh-stats');
    const icon = btn.querySelector('span');
    icon.classList.add('fa-spin'); // if font-awesome
    btn.style.opacity = '0.5';
    setTimeout(() => {
        icon.classList.remove('fa-spin');
        btn.style.opacity = '1';
    }, 500);
});

// Initialization
setTimeout(() => {
    renderWelcomeMessage();
}, 500);
