/**
 * app.js - Real Agent Front-end Controller for Discord AI Assistant
 * Connects Web UI directly to AgentEngine with Tool-Calling Execution and Trace Logging.
 */

// Initialize Agent Engine
const agentEngine = new AgentEngine();

// Application State
const State = {
    totalQueries: 0,
    groundedQueries: 0,
    escalationQueries: 0,
    feedback: {
        positive: 0,
        negative: 0,
        negativeList: []
    },
    tickets: [],
    recentMessages: [],
    queryHistory: []
};

// DOM Elements
const els = {
    navChat: document.getElementById('nav-chat'),
    navDashboard: document.getElementById('nav-dashboard'),
    navBenchmark: document.getElementById('nav-benchmark'),
    
    chatView: document.getElementById('chat-view'),
    dashboardView: document.getElementById('dashboard-view'),
    benchmarkView: document.getElementById('benchmark-view'),
    
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
    
    // New Feature Elements
    btnGenerateDigest: document.getElementById('btn-generate-digest'),
    digestContainer: document.getElementById('digest-content-container'),
    stuckContainer: document.getElementById('stuck-students-container'),
    
    // Benchmark Elements
    btnRunBenchmark: document.getElementById('btn-run-benchmark'),
    benchTotalScore: document.getElementById('bench-total-score'),
    benchPassRate: document.getElementById('bench-pass-rate'),
    benchBehaviorAcc: document.getElementById('bench-behavior-acc'),
    benchCitationAcc: document.getElementById('bench-citation-acc'),
    benchTableBody: document.getElementById('benchmark-table-body'),
    
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
    if (els.messagesContainer) {
        els.messagesContainer.scrollTop = els.messagesContainer.scrollHeight;
    }
};

// Navigation Handling
const switchView = (activeView, activeBtn) => {
    [els.chatView, els.dashboardView, els.benchmarkView].forEach(v => {
        if (v) {
            v.classList.add('hidden');
            v.classList.remove('opacity-100');
            v.classList.add('opacity-0');
        }
    });

    [els.navChat, els.navDashboard, els.navBenchmark].forEach(b => {
        if (b) {
            b.classList.replace('bg-discord-blurple', 'hover:bg-white/10');
            b.classList.replace('text-white', 'text-discord-muted');
            b.classList.add('hover:text-white');
        }
    });

    if (activeView) {
        activeView.classList.remove('hidden');
        setTimeout(() => {
            activeView.classList.remove('opacity-0');
            activeView.classList.add('opacity-100');
        }, 50);
    }

    if (activeBtn) {
        activeBtn.classList.replace('hover:bg-white/10', 'bg-discord-blurple');
        activeBtn.classList.replace('text-discord-muted', 'text-white');
        activeBtn.classList.remove('hover:text-white');
    }
};

els.navChat?.addEventListener('click', () => switchView(els.chatView, els.navChat));
els.navDashboard?.addEventListener('click', () => {
    switchView(els.dashboardView, els.navDashboard);
    updateDashboard();
});
els.navBenchmark?.addEventListener('click', () => switchView(els.benchmarkView, els.navBenchmark));

// Welcome Banner Render
const renderWelcomeMessage = () => {
    if (!els.messagesContainer) return;
    const msg = document.createElement('div');
    msg.className = 'flex gap-4 items-start w-full group fade-in';
    msg.innerHTML = `
        <div class="flex-shrink-0 mt-1">
            <div class="w-10 h-10 rounded-full bg-discord-blurple flex items-center justify-center overflow-hidden shadow-lg">
                <span class="material-symbols-outlined text-white text-xl" style="font-variation-settings: 'FILL' 1;">smart_toy</span>
            </div>
        </div>
        <div class="flex flex-col gap-1 min-w-0 w-full">
            <div class="flex items-baseline gap-2">
                <span class="font-bold text-[15px] text-discord-blurple cursor-pointer hover:underline">Trợ-lý-AI</span>
                <span class="bg-discord-blurple text-white text-[10px] font-bold px-1 rounded flex items-center gap-0.5">
                    <span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">check</span> BOT AGENT CHẠY THẬT
                </span>
                <span class="text-xs text-discord-muted">Hôm nay lúc ${getTimeString()}</span>
            </div>
            
            <div class="mt-1 bg-[#1e1f22] rounded-r-lg border-l-4 border-discord-blurple p-4 w-full max-w-[550px] shadow-md">
                <h2 class="font-bold text-white text-[15px] mb-2 flex items-center gap-2">
                    🚀 TRỢ LÝ HỌC VIÊN DISCORD - KHÓA HỌC "AI THỰC CHIẾN"
                </h2>
                <div class="text-sm text-discord-text space-y-3">
                    <p>Chào mừng học viên! Trợ lý AI chạy thật với <strong>Tool Calling Engine</strong> tra cứu quy định khóa học, deadline, lệnh Discord và gỡ lỗi Git/SSH dựa trên tài liệu chuẩn 100%.</p>
                    <div class="bg-[#2b2d31] p-3 rounded border border-white/5 space-y-1.5">
                        <p class="font-bold text-discord-blurple text-xs uppercase tracking-wide">💡 Các câu hỏi mẫu thử nghiệm:</p>
                        <ul class="text-xs space-y-1 text-discord-text">
                            <li>• <code>deadline nộp bài CP4 là khi nào?</code> (Tool: rag_search)</li>
                            <li>• <code>cách tạo ticket hỗ trợ trên Discord gõ lệnh gì?</code> (Tool: rag_search)</li>
                            <li>• <code>bị lỗi ERROR: Repository not found khi git clone?</code> (Tool: rag_search)</li>
                            <li>• <code>nộp bài ở đâu?</code> / <code>deadline khi nào?</code> (Tool: clarify)</li>
                            <li>• <code>viết hộ mình đoạn code RAG với?</code> (Tool: refuse_politely)</li>
                        </ul>
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
            <img class="w-full h-full object-cover" src="https://ui-avatars.com/api/?name=H%E1%BB%8Dc+Vi%C3%AAn&background=7289da&color=fff"/>
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-2 mb-0.5">
                <span class="font-bold text-[15px] text-white hover:underline cursor-pointer">Học Viên P-042</span>
                <span class="text-xs text-discord-muted">Hôm nay lúc ${getTimeString()}</span>
            </div>
            <p class="text-[15px] text-discord-text leading-relaxed">${text}</p>
        </div>
    `;
    els.messagesContainer.appendChild(msg);
    scrollToBottom();
};

// Rate Limit Check
const checkRateLimit = () => {
    const now = Date.now();
    State.recentMessages = State.recentMessages.filter(t => now - t < 10000);
    if (State.recentMessages.length >= 3) return false;
    State.recentMessages.push(now);
    return true;
};

// Render Rate Limit Warning
const renderSpamWarning = () => {
    const msg = document.createElement('div');
    msg.className = 'flex gap-4 group hover:bg-black/10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-1 mt-1 fade-in';
    msg.innerHTML = `
        <div class="w-10 h-10 shrink-0"></div>
        <div class="flex-1 min-w-0">
            <div class="bg-discord-red/10 border border-discord-red/30 rounded p-3 text-discord-text text-sm flex items-start gap-2 w-fit">
                <span class="material-symbols-outlined text-discord-red text-[18px]">error</span>
                <div>
                    <strong class="text-discord-red">Hệ thống chặn SPAM (Rate Limit):</strong> Bạn đang gửi câu hỏi quá nhanh. Vui lòng đợi 30 giây trước khi gửi tiếp.<br>
                    <span class="text-xs text-discord-muted italic">Thông báo này chỉ hiển thị với bạn (Ephemeral).</span>
                </div>
            </div>
        </div>
    `;
    els.messagesContainer.appendChild(msg);
    scrollToBottom();
    setTimeout(() => msg.remove(), 6000);
};

// Typing Indicator
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
                <span class="font-bold text-[15px] text-discord-blurple">Trợ-lý-AI</span>
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

// Render Agent Response with Tool Call Execution Trace
const renderAgentResponse = (res, rawQuery) => {
    const msgId = Date.now();
    const msg = document.createElement('div');
    msg.className = 'flex gap-4 group hover:bg-black/10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-1 mt-1 fade-in';

    let embedBorder = "border-l-discord-green";
    let statusTitle = "Trợ Lý AI Học Viên [CĂN CỨ CHÍNH THỨC]";
    let statusIcon = "check_circle";
    let titleColor = "text-discord-green";

    if (res.behavior === "ask_clarification") {
        embedBorder = "border-l-discord-blurple";
        statusTitle = "Trợ Lý AI Học Viên [CẦN LÀM RÕ NGỮ CẢNH]";
        statusIcon = "help";
        titleColor = "text-discord-blurple";
    } else if (res.behavior === "escalate_to_ta" || res.behavior === "refuse_sensitive") {
        embedBorder = "border-l-discord-yellow";
        statusTitle = "Trợ Lý AI Học Viên [CHUYỂN TA / ADMIN HỖ TRỢ]";
        statusIcon = "warning";
        titleColor = "text-discord-yellow";
    } else if (res.behavior === "refuse_politely" || res.behavior === "rate_limit_warning") {
        embedBorder = "border-l-discord-red";
        statusTitle = "Trợ Lý AI Học Viên [NGOÀI PHẠM VI HỖ TRỢ]";
        statusIcon = "block";
        titleColor = "text-discord-red";
    }

    const citationHtml = res.citation ? `
        <div class="bg-[#202225] rounded p-2.5 mt-2 border border-white/5">
            <div class="flex items-center gap-2 mb-1">
                <span class="material-symbols-outlined text-discord-muted text-[16px]">push_pin</span>
                <span class="font-semibold text-[12px] text-discord-muted">Nguồn trích dẫn chính thức:</span>
            </div>
            <div class="ml-6">
                <div class="flex items-center gap-1 text-blue-400 hover:underline cursor-pointer w-fit font-mono text-[13px]">
                    <span class="material-symbols-outlined text-[14px]">description</span>
                    <span>docs/${res.citation}</span>
                </div>
                <span class="text-[12px] text-discord-muted ml-5 block mt-0.5">(${res.section})</span>
            </div>
        </div>
    ` : '';

    const toolTraceHtml = (res.trace?.tool_calls || []).map(tc => 
        `<span class="bg-black/30 border border-white/10 px-1.5 py-0.5 rounded text-[11px] font-mono text-discord-blurple">
            🛠️ ${tc.tool}(${JSON.stringify(tc.args)})
        </span>`
    ).join(' ');

    msg.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-discord-blurple flex-shrink-0 flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-[20px]">smart_toy</span>
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-2 mb-0.5">
                <span class="font-bold text-[15px] text-discord-blurple">Trợ-lý-AI</span>
                <span class="bg-discord-blurple text-white text-[10px] font-bold px-1 rounded flex items-center gap-0.5">
                    <span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">check</span> BOT
                </span>
                <span class="text-xs text-discord-muted">Hôm nay lúc ${getTimeString()}</span>
            </div>
            
            <div class="mt-1 bg-[#2B2D31] rounded border-l-4 ${embedBorder} shadow-sm max-w-[550px]">
                <div class="p-4 flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined ${titleColor} text-[18px]">${statusIcon}</span>
                            <h2 class="text-[14px] font-bold ${titleColor}">${statusTitle}</h2>
                        </div>
                    </div>
                    
                    <div class="text-[14px] text-discord-text leading-relaxed whitespace-pre-line">${res.answer}</div>
                    
                    ${citationHtml}
                    
                    <div class="mt-2 flex flex-wrap items-center gap-1 border-t border-white/5 pt-2">
                        <span class="text-[11px] text-discord-muted font-bold mr-1">Tool Execution Trace:</span>
                        ${toolTraceHtml}
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
                ${res.behavior === "escalate_to_ta" ? `
                <button class="action-btn bg-discord-blurple hover:bg-[#4752C4] text-white font-medium text-[13px] px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors" data-action="ticket" data-id="${msgId}" data-query="${rawQuery}">
                    <span class="material-symbols-outlined text-[16px]">confirmation_number</span> Tạo Ticket Hỗ Trợ
                </button>` : ''}
            </div>
        </div>
    `;

    els.messagesContainer.appendChild(msg);
    scrollToBottom();
    attachActionListeners(msg, msgId);
};

// Process Input Logic
const processInput = (text) => {
    if (!checkRateLimit()) {
        renderSpamWarning();
        return;
    }

    State.totalQueries++;
    const typing = renderTyping();

    setTimeout(() => {
        typing.remove();

        const res = agentEngine.runAgent(text);

        if (res.behavior === "answer_with_citation") {
            State.groundedQueries++;
        } else if (res.behavior === "escalate_to_ta") {
            State.escalationQueries++;
        }

        State.queryHistory.push({
            query: text,
            behavior: res.behavior,
            time: getTimeString(),
            isLateNight: new Date().getHours() >= 22 || new Date().getHours() < 5
        });

        renderAgentResponse(res, text);
        updateDashboard();
    }, 500 + Math.random() * 300);
};

// Chat Input Event Listener
els.chatInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const val = els.chatInput.value.trim();
        if (val) {
            renderUserMessage(val);
            processInput(val);
            els.chatInput.value = '';
        }
    }
});

// Action Buttons Handling
let currentFeedbackId = null;
const attachActionListeners = (container, id) => {
    const btns = container.querySelectorAll('.action-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            if (action === 'like') {
                if (!this.classList.contains('active-like')) {
                    this.innerHTML = `<span class="material-symbols-outlined text-[16px]">check</span> Đã cảm ơn`;
                    this.classList.add('active-like');
                    this.classList.replace('bg-[#248046]', 'bg-[#1a6334]');
                    State.feedback.positive++;
                    const sibling = this.parentElement.querySelector('[data-action="dislike"]');
                    if (sibling) {
                        sibling.disabled = true;
                        sibling.style.opacity = '0.5';
                    }
                }
            } else if (action === 'dislike') {
                if (!this.classList.contains('active-dislike')) {
                    currentFeedbackId = id;
                    els.feedbackModal.classList.remove('hidden');
                    els.feedbackDetail.value = '';
                }
            } else if (action === 'ticket') {
                if (!this.classList.contains('ticket-created')) {
                    this.innerHTML = `<span class="material-symbols-outlined text-[16px]">check</span> Đã gửi Ticket`;
                    this.classList.add('ticket-created');
                    this.classList.replace('bg-discord-blurple', 'bg-[#3b4252]');
                    const q = this.getAttribute('data-query');
                    State.tickets.push({ id, query: q, time: getTimeString() });
                    updateDashboard();
                }
            }
        });
    });
};

// Feedback Modal Logic
const hideModal = () => {
    els.feedbackModal.classList.add('hidden');
    currentFeedbackId = null;
};
els.closeModal?.addEventListener('click', hideModal);
els.cancelFeedback?.addEventListener('click', hideModal);

els.submitFeedback?.addEventListener('click', () => {
    const reasonEl = document.querySelector('input[name="feedback_reason"]:checked');
    const detail = els.feedbackDetail.value;
    const reason = reasonEl ? reasonEl.value : 'Khác';

    State.feedback.negative++;
    State.feedback.negativeList.push({ reason, detail, time: getTimeString() });

    if (currentFeedbackId) {
        const btn = document.querySelector(`[data-action="dislike"][data-id="${currentFeedbackId}"]`);
        if (btn) {
            btn.innerHTML = `<span class="material-symbols-outlined text-[16px]">check</span> Đã ghi nhận`;
            btn.classList.add('active-dislike');
            btn.classList.replace('bg-[#4E5058]', 'bg-[#ED4245]');
        }
    }
    hideModal();
    updateDashboard();
});

// Update PO Dashboard Metrics & Features
const updateDashboard = () => {
    if (els.statTotal) els.statTotal.innerText = State.totalQueries;

    const groundedRate = State.totalQueries > 0 ? Math.round((State.groundedQueries / State.totalQueries) * 100) : 100;
    if (els.statGrounded) els.statGrounded.innerText = groundedRate + '%';

    const escalationRate = State.totalQueries > 0 ? Math.round((State.escalationQueries / State.totalQueries) * 100) : 0;
    if (els.statEscalation) els.statEscalation.innerText = escalationRate + '%';

    const totalFeedbacks = State.feedback.positive + State.feedback.negative;
    const positiveRate = totalFeedbacks > 0 ? Math.round((State.feedback.positive / totalFeedbacks) * 100) : 0;

    if (els.statPositive) els.statPositive.innerText = positiveRate + '%';
    if (els.statTotalFeedback) els.statTotalFeedback.innerText = `(${totalFeedbacks} đánh giá)`;

    if (els.ticketBadge) els.ticketBadge.innerText = `${State.tickets.length} Pending`;

    // Render Tickets
    if (els.dashboardTickets) {
        if (State.tickets.length > 0) {
            els.dashboardTickets.innerHTML = State.tickets.map(t => `
                <div class="bg-[#232428] p-3 rounded mb-2 border border-white/5 shadow-sm">
                    <div class="flex justify-between mb-1">
                        <span class="text-xs text-discord-muted">${t.time}</span>
                        <span class="text-xs bg-discord-blurple text-white px-2 rounded-full font-bold">Pending TA</span>
                    </div>
                    <div class="text-sm font-medium text-white">"${t.query}"</div>
                </div>
            `).join('');
        }
    }

    // Render Negative Feedbacks
    if (els.dashboardNegative) {
        if (State.feedback.negativeList.length > 0) {
            els.dashboardNegative.innerHTML = State.feedback.negativeList.map(f => `
                <div class="bg-[#232428] p-3 rounded mb-2 border border-discord-red/30 border-l-4 border-l-discord-red">
                    <div class="text-xs text-discord-muted mb-1">${f.time}</div>
                    <div class="text-sm font-bold text-discord-red mb-1">${f.reason}</div>
                    ${f.detail ? `<div class="text-xs text-discord-text italic bg-black/20 p-2 rounded mt-1">"${f.detail}"</div>` : ''}
                </div>
            `).join('');
        }
    }

    // Render Stuck Students
    renderStuckStudents();
};

// Render Stuck Students Feature Panel
const renderStuckStudents = () => {
    if (!els.stuckContainer) return;
    const stuckList = StuckStudentDetector.detectStuckStudents(State.queryHistory);

    els.stuckContainer.innerHTML = stuckList.map(s => `
        <div class="bg-[#1e1f22] p-3.5 rounded-lg border border-white/5 hover:border-discord-yellow/30 transition-colors">
            <div class="flex justify-between items-start mb-1.5">
                <span class="font-bold text-sm text-white">${s.userId}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-extrabold ${s.riskLevel === 'HIGH' ? 'bg-discord-red/20 text-discord-red' : 'bg-discord-yellow/20 text-discord-yellow'}">${s.riskLevel} STUCK RISK</span>
            </div>
            <p class="text-xs text-discord-text mb-2"><strong class="text-discord-yellow">Nguyên nhân:</strong> ${s.reason}</p>
            <div class="bg-[#111318] p-2 rounded text-xs font-mono text-discord-muted truncate mb-2">"${s.lastQuery}"</div>
            <div class="text-xs text-discord-blurple flex items-center gap-1 font-semibold">
                <span class="material-symbols-outlined text-[14px]">auto_awesome</span> ${s.proactiveAction}
            </div>
        </div>
    `).join('');
};

// Generate Daily Digest Button Handler
els.btnGenerateDigest?.addEventListener('click', () => {
    const digest = DailyDigestGenerator.generateDigest(State);
    if (!els.digestContainer) return;

    els.digestContainer.innerHTML = `
        <div class="border-b border-white/10 pb-2 mb-3">
            <h4 class="font-bold text-white text-base">${digest.title}</h4>
        </div>

        <div class="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div class="bg-[#1e1f22] p-2 rounded"><span class="text-discord-muted">Lượt hỏi:</span> <strong class="text-white">${digest.summary.totalQueries}</strong></div>
            <div class="bg-[#1e1f22] p-2 rounded"><span class="text-discord-muted">Grounded RAG:</span> <strong class="text-discord-green">${digest.summary.groundedRate}</strong></div>
            <div class="bg-[#1e1f22] p-2 rounded"><span class="text-discord-muted">Escalation TA:</span> <strong class="text-discord-yellow">${digest.summary.escalationCount}</strong></div>
            <div class="bg-[#1e1f22] p-2 rounded"><span class="text-discord-muted">Ticket tồn:</span> <strong class="text-discord-red">${digest.summary.pendingTicketCount}</strong></div>
        </div>

        <div class="mb-3">
            <p class="font-bold text-xs text-discord-blurple mb-1 uppercase">🔥 Chủ đề hỏi nhiều nhất hôm nay:</p>
            <ul class="text-xs space-y-1">
                ${digest.topTopics.map(t => `<li class="flex justify-between bg-[#1e1f22] px-2 py-1 rounded"><span>• ${t.name}</span> <span class="font-bold text-discord-blurple">${t.count} câu</span></li>`).join('')}
            </ul>
        </div>

        <div>
            <p class="font-bold text-xs text-discord-green mb-1 uppercase">📌 Đề xuất hành động cho TA:</p>
            <ul class="text-xs space-y-1 text-discord-text">
                ${digest.actionableRecommendations.map(r => `<li>${r}</li>`).join('')}
            </ul>
        </div>
    `;
});

// Benchmark Suite Runner
const GoldenSetDataset = [
    { id: 1, category: "happy_path", question: "deadline nộp bài CP4 là khi nào?", expected_source: "02-guide.md", expected_behavior: "answer_with_citation" },
    { id: 2, category: "happy_path", question: "lịch học Workshop tuần này vào thứ mấy?", expected_source: "05_quy_dinh_khoa_hoc_ai20k_build_phase.md", expected_behavior: "answer_with_citation" },
    { id: 3, category: "happy_path", question: "lịch Mentoring Duty kiểm tra tiến độ là khi nào?", expected_source: "05_quy_dinh_khoa_hoc_ai20k_build_phase.md", expected_behavior: "answer_with_citation" },
    { id: 4, category: "happy_path", question: "cách tạo ticket hỗ trợ trên Discord gõ lệnh gì?", expected_source: "02_cu_phap_lenh_discord_va_tao_ticket.md", expected_behavior: "answer_with_citation" },
    { id: 5, category: "happy_path", question: "link xem slide bài giảng ở đâu?", expected_source: "05_quy_dinh_khoa_hoc_ai20k_build_phase.md", expected_behavior: "answer_with_citation" },
    { id: 6, category: "happy_path", question: "trang làm bài thực hành Codelabs là gì?", expected_source: "05_quy_dinh_khoa_hoc_ai20k_build_phase.md", expected_behavior: "answer_with_citation" },
    { id: 7, category: "happy_path", question: "cách đặt tên Zoom học tập thế nào cho đúng?", expected_source: "05_quy_dinh_khoa_hoc_ai20k_build_phase.md", expected_behavior: "answer_with_citation" },
    { id: 8, category: "happy_path", question: "tên repo GitHub của nhóm phải đặt như thế nào?", expected_source: "05_quy_dinh_khoa_hoc_ai20k_build_phase.md", expected_behavior: "answer_with_citation" },
    { id: 9, category: "happy_path", question: "bị lỗi ERROR: Repository not found khi git clone thì làm sao?", expected_source: "03_huong_dan_go_loi_git_ssh.md", expected_behavior: "answer_with_citation" },
    { id: 10, category: "happy_path", question: "repo của nhóm thiếu file pyproject.toml thì xử lý thế nào?", expected_source: "04_huong_dan_moi_truong_python_va_ai_log.md", expected_behavior: "answer_with_citation" },
    { id: 11, category: "ambiguous", question: "nộp bài ở đâu?", expected_behavior: "ask_clarification" },
    { id: 12, category: "ambiguous", question: "deadline khi nào?", expected_behavior: "ask_clarification" },
    { id: 13, category: "ambiguous", question: "lỗi SSH sửa làm sao?", expected_behavior: "ask_clarification" },
    { id: 14, category: "ambiguous", question: "tạo ticket không được?", expected_behavior: "ask_clarification" },
    { id: 15, category: "ambiguous", question: "bài tập tuần này làm gì?", expected_behavior: "ask_clarification" },
    { id: 16, category: "out_of_scope", question: "viết hộ mình đoạn code RAG bằng Python với?", expected_behavior: "refuse_politely" },
    { id: 17, category: "out_of_scope", question: "giá khóa học AI20K tiếp theo là bao nhiêu?", expected_behavior: "escalate_to_ta" },
    { id: 18, category: "out_of_scope", question: "thời tiết hôm nay thế nào?", expected_behavior: "refuse_politely" },
    { id: 19, category: "out_of_scope", question: "bạn là mô hình GPT-4 hay Claude 3.5?", expected_behavior: "answer_scope" },
    { id: 20, category: "out_of_scope", question: "test test test test test", expected_behavior: "rate_limit_warning" },
    { id: 21, category: "low_confidence", question: "nếu nhóm mình nộp trễ CP4 5 phút thì có bị trừ điểm không?", expected_behavior: "escalate_to_ta" },
    { id: 22, category: "low_confidence", question: "mình muốn đổi sang nhóm khác bây giờ được không?", expected_behavior: "escalate_to_ta" },
    { id: 23, category: "low_confidence", question: "điểm thi của nhóm P-012 là bao nhiêu?", expected_behavior: "refuse_sensitive" },
    { id: 24, category: "low_confidence", question: "tài khoản VLearn của mình bị khóa không đăng nhập được?", expected_behavior: "escalate_to_ta" },
    { id: 25, category: "low_confidence", question: "thầy giáo dạy buổi tiếp theo là ai?", expected_behavior: "escalate_to_ta" }
];

els.btnRunBenchmark?.addEventListener('click', () => {
    let passedCount = 0;
    let behaviorMatches = 0;
    let sourceMatches = 0;
    let totalScore = 0;

    if (els.benchTableBody) els.benchTableBody.innerHTML = '';

    GoldenSetDataset.forEach(tc => {
        const res = agentEngine.runAgent(tc.question);
        const behaviorPass = (res.behavior === tc.expected_behavior);
        let sourcePass = true;
        if (tc.expected_source) {
            sourcePass = (res.citation === tc.expected_source);
        }

        const isPassed = behaviorPass && sourcePass;
        if (isPassed) passedCount++;
        if (behaviorPass) behaviorMatches++;
        if (sourcePass) sourceMatches++;

        const pts = isPassed ? 4 : (behaviorPass ? 2 : 0);
        totalScore += pts;

        const tr = document.createElement('tr');
        tr.className = isPassed ? 'hover:bg-white/5 text-white' : 'bg-discord-red/10 text-discord-red hover:bg-discord-red/20';
        tr.innerHTML = `
            <td class="py-2.5 px-2 font-mono">${tc.id}</td>
            <td class="py-2.5 px-2"><span class="px-2 py-0.5 rounded text-[11px] bg-white/10 font-medium">${tc.category}</span></td>
            <td class="py-2.5 px-2 font-medium">${tc.question}</td>
            <td class="py-2.5 px-2 font-mono text-xs text-discord-muted">${tc.expected_behavior}</td>
            <td class="py-2.5 px-2 font-mono text-xs">${res.behavior}</td>
            <td class="py-2.5 px-2 font-mono text-xs text-blue-400">${res.citation || '--'}</td>
            <td class="py-2.5 px-2 text-center font-bold">${isPassed ? '✅ PASS' : '❌ FAIL'}</td>
        `;
        els.benchTableBody.appendChild(tr);
    });

    const passRate = Math.round((passedCount / GoldenSetDataset.length) * 100);
    const behaviorAcc = Math.round((behaviorMatches / GoldenSetDataset.length) * 100);
    const citationAcc = Math.round((sourceMatches / GoldenSetDataset.length) * 100);

    if (els.benchTotalScore) els.benchTotalScore.innerText = `${totalScore} / 100`;
    if (els.benchPassRate) els.benchPassRate.innerText = `${passRate}%`;
    if (els.benchBehaviorAcc) els.benchBehaviorAcc.innerText = `${behaviorAcc}%`;
    if (els.benchCitationAcc) els.benchCitationAcc.innerText = `${citationAcc}%`;
});

// App Initialization
window.addEventListener('DOMContentLoaded', () => {
    renderWelcomeMessage();
    updateDashboard();
});
