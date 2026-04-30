/**
 * AI Chatbot for Mohamed Salah's Portfolio
 * Multi-Provider AI (Gemini + GitHub Models + OpenRouter)
 */

class PortfolioChatbot {
    constructor() {
        this.container = document.getElementById('chatbot-container');
        this.isOpen = false;

        // --- CONFIGURATION (loaded from config.js) ---
        const cfg = window.PORTFOLIO_CONFIG || {};
        this.useProxy = cfg.USE_PROXY || false;
        this.proxyUrl = cfg.PROXY_URL || "";
        this.apiKey = cfg.GEMINI_API_KEY || "";
        this.githubToken = cfg.GITHUB_TOKEN || "";
        this.openrouterKey = cfg.OPENROUTER_KEY || "";

        // Providers and their respective model lists
        this.geminiModels = [
            "gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-1.5-flash",
            "gemini-2.5-pro", "gemini-flash-latest", "gemini-pro-latest", "gemini-2.0-flash-001",
            "gemini-2.0-flash-lite-001", "gemini-2.5-flash-lite", "gemini-2.5-flash-image",
            "gemini-3-flash-preview", "gemini-3-pro-preview"
        ];

        this.githubModels = [
            "gpt-4o", "gpt-4o-mini", "Mistral-large-2407", "Mistral-Nemo",
            "Meta-Llama-3.1-405B-Instruct", "Meta-Llama-3.1-70B-Instruct", "Meta-Llama-3.1-8B-Instruct",
            "Meta-Llama-3-70B-Instruct", "Meta-Llama-3-8B-Instruct", "AI21-Jamba-Instruct"
        ];

        this.openrouterModels = [
            "google/gemma-3-27b-it:free", "google/gemma-3-12b-it:free", "google/gemma-3-4b-it:free",
            "meta-llama/llama-3.3-70b-instruct:free", "meta-llama/llama-3.2-3b-instruct:free",
            "nousresearch/hermes-3-llama-3.1-405b:free", "qwen/qwen3-coder:free",
            "mistralai/mistral-small-3.1-24b-instruct:free", "google/gemma-3n-e4b-it:free",
            "google/gemma-3n-e2b-it:free", "openai/gpt-oss-120b:free", "openai/gpt-oss-20b:free",
            "liquid/lfm-2.5-1.2b-thinking:free", "liquid/lfm-2.5-1.2b-instruct:free",
            "arcee-ai/trinity-large-preview:free", "arcee-ai/trinity-mini:free",
            "upstage/solar-pro-3:free", "stepfun/step-3.5-flash:free", "z-ai/glm-4.5-air:free",
            "qwen/qwen3-next-80b-a3b-instruct:free", "qwen/qwen3-4b:free",
            "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
            "nvidia/nemotron-3-nano-30b-a3b:free", "nvidia/nemotron-nano-12b-v2-vl:free",
            "nvidia/nemotron-nano-9b-v2:free"
        ];

        this.currentGeminiIndex = 0;
        this.currentGithubIndex = 0;
        this.currentOpenRouterIndex = 0;
        // ---------------------

        this.chatHistory = [];
        this.lastMessageTime = 0;
        this.siteContext = ""; // Dynamic site-wide data

        this.init();
    }

    init() {
        this.loadHistory();
        this.render();
        this.bindEvents();
        // Only add welcome if history is empty
        if (this.chatHistory.length === 0) {
            this.addWelcomeMessage();
        } else {
            this.renderHistory();
        }
    }

    loadHistory() {
        const saved = localStorage.getItem('portfolio_chat_history');
        if (saved) {
            try {
                this.chatHistory = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to load history", e);
                this.chatHistory = [];
            }
        }
    }

    saveHistory() {
        localStorage.setItem('portfolio_chat_history', JSON.stringify(this.chatHistory));
    }

    renderHistory() {
        this.messagesDiv.innerHTML = '';
        this.chatHistory.forEach(msg => {
            const sender = msg.role === 'model' ? 'bot' : 'user';
            this.addMessage(msg.parts[0].text, sender, false);
        });
    }

    render() {
        this.container.innerHTML = `
            <div class="chatbot-tooltip" id="chatbot-tooltip"></div>
            <button class="chatbot-fab" aria-label="Open Chat">
                <img src="1767434721347.png" alt="Mohamed Salah" class="fab-profile-img" loading="lazy">
                <div class="notification-dot"></div>
            </button>

            <div class="chatbot-window">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <div class="ai-avatar">
                            <img src="1767434721347.png" alt="Mohamed Salah" class="chat-profile-img" loading="lazy">
                        </div>
                        <div class="chat-header-text">
                            <h3>M.Salah AI Assistant</h3>
                            <span>Online | Ready to help</span>
                        </div>
                    </div>
                    <div class="chat-header-actions">
                        <button class="new-chat-btn" id="new-chat-btn" title="New Chat"><i class="fas fa-redo-alt"></i></button>
                        <button class="close-chat"><i class="fas fa-times"></i></button>
                    </div>
                </div>

                <div class="chat-messages" id="chat-messages"></div>

                <div class="quick-actions" id="quick-actions">
                    <!-- Buttons will be injected here -->
                </div>

                <div class="typing" id="typing-indicator">AI is thinking...</div>

                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Type your message..." autocomplete="off">
                    <button class="send-btn" id="send-msg"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        `;

        this.fab = this.container.querySelector('.chatbot-fab');
        this.window = this.container.querySelector('.chatbot-window');
        this.messagesDiv = document.getElementById('chat-messages');
        this.input = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('send-msg');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.tooltip = document.getElementById('chatbot-tooltip');
        this.newChatBtn = document.getElementById('new-chat-btn');
        this.updateTooltip();
        this.startTooltipAnimation();
    }

    bindEvents() {
        this.fab.addEventListener('click', () => this.toggleChat());
        this.container.querySelector('.close-chat').addEventListener('click', () => this.toggleChat());
        this.newChatBtn.addEventListener('click', () => this.clearHistory());

        this.sendBtn.addEventListener('click', () => this.handleSendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSendMessage();
        });
    }

    clearHistory() {
        if (confirm("هل تريد مسح المحادثة وبدء جلسة جديدة؟\nDo you want to clear the chat and start a new session?")) {
            localStorage.removeItem('portfolio_chat_history');
            this.chatHistory = [];
            this.messagesDiv.innerHTML = '';
            this.addWelcomeMessage();
            document.getElementById('quick-actions').style.display = 'none';
        }
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.window.classList.toggle('active', this.isOpen);
        if (this.isOpen) {
            this.input.focus();
            this.fab.querySelector('.notification-dot').style.display = 'none';
            this.tooltip.style.display = 'none';
            this.extractSiteData(); // Refresh knowledge when opening
            this.renderQuickActions();
        } else {
            this.updateTooltip();
        }
    }

    extractSiteData() {
        // Hero Data
        const name = document.querySelector('.name')?.innerText || "";
        const title = document.querySelector('.title')?.innerText || "";
        const bio = document.querySelector('.hero-desc')?.innerText || "";

        // About Data
        const aboutText = Array.from(document.querySelectorAll('.about-text p')).map(p => p.innerText).join(" ");

        // Skills Data
        const skills = Array.from(document.querySelectorAll('.skill-card')).map(card => {
            const category = card.querySelector('h3')?.innerText || "";
            const tags = Array.from(card.querySelectorAll('.skill-progress-item span:first-child')).map(s => s.innerText).join(", ");
            return `${category}: ${tags}`;
        }).join(" | ");

        // Experience Data
        const experience = Array.from(document.querySelectorAll('.experience-card')).map(card => {
            const pos = card.querySelector('h3')?.innerText || "";
            const company = card.querySelector('.company')?.innerText || "";
            const desc = card.querySelector('.exp-desc')?.innerText || "";
            return `${pos} at ${company}: ${desc}`;
        }).join(" | ");

        // Projects Data
        const projects = Array.from(document.querySelectorAll('.project-card')).map(card => {
            const title = card.querySelector('h3')?.innerText || "";
            const desc = card.querySelector('.project-desc')?.innerText || "";
            const tags = Array.from(card.querySelectorAll('.project-tags span')).map(s => s.innerText).join(", ");
            return `${title}: ${desc} (Tech: ${tags})`;
        }).join(" | ");

        this.siteContext = `
            USER_PORTFOLIO_CONTEXT:
            Name: ${name}
            Title: ${title}
            Bio: ${bio}
            Professional Summary: ${aboutText}
            Key Skills: ${skills}
            Work Experience: ${experience}
            Top Projects: ${projects}
        `.trim();
    }

    renderQuickActions() {
        const lang = localStorage.getItem('lang') || 'en';
        const actions = lang === 'ar' ? [
            { text: "🚀 استعراض المشاريع", action: "scroll", target: "#projects" },
            { text: "📄 السيرة الذاتية", action: "click", target: "#cv-modal-btn" },
            { text: "💬 تواصل عبر واتساب", action: "link", target: "https://wa.me/201148295790" }
        ] : [
            { text: "🚀 View Projects", action: "scroll", target: "#projects" },
            { text: "📄 View/Download CV", action: "click", target: "#cv-modal-btn" },
            { text: "💬 WhatsApp", action: "link", target: "https://wa.me/201148295790" }
        ];

        const container = document.getElementById('quick-actions');
        if (!container) return;

        container.innerHTML = actions.map(a => `
            <button class="qa-btn" data-action="${a.action}" data-target="${a.target}">${a.text}</button>
        `).join('');

        container.querySelectorAll('.qa-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                const target = btn.getAttribute('data-target');

                if (action === 'scroll') {
                    const el = document.querySelector(target);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                    }
                } else if (action === 'link') {
                    window.open(target, '_blank');
                } else if (action === 'click') {
                    const el = document.querySelector(target);
                    if (el) {
                        el.click();
                    }
                }

                // Clicking a button now just executes the action silently
                // No handleSendMessage call here as per user request
            });
        });

        // Hide by default unless specifically triggered by conversation
        container.style.display = 'none';
    }

    updateTooltip() {
        const lang = localStorage.getItem('lang') || 'en';
        const text = lang === 'ar' ? "اسألني" : "Ask me";
        this.tooltip.textContent = text;
        this.tooltip.classList.remove('ar', 'en');
        this.tooltip.classList.add(lang);

        if (!this.isOpen) {
            this.tooltip.style.display = 'block';
            setTimeout(() => this.tooltip.classList.add('show'), 100);
        } else {
            // Refresh quick actions if open to match new language
            this.renderQuickActions();
        }
    }

    addWelcomeMessage() {
        const lang = localStorage.getItem('lang') || 'en';
        const msg = lang === 'ar'
            ? "أهلاً بك! أنا المساعد الذكي لمحمد صلاح. كيف يمكنني مساعدتك في استكشاف مشاريعه اليوم؟"
            : "Hello! I'm Mohamed Salah's AI Assistant. How can I help you explore his work today?";

        setTimeout(() => this.addMessage(msg, 'bot', false), 500);
    }

    addMessage(text, sender, saveToHistory = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        if (sender === 'bot') {
            const contentDiv = document.createElement('div');
            messageDiv.appendChild(contentDiv);
            this.messagesDiv.appendChild(messageDiv);

            // Typewriter effect for bot
            this.typeWriter(contentDiv, text);
        } else {
            messageDiv.textContent = text;
            this.messagesDiv.appendChild(messageDiv);
        }

        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;

        if (sender === 'bot') {
            this.executeCommanderTags(text);
        }

        if (saveToHistory) {
            this.chatHistory.push({
                role: sender === 'bot' ? 'model' : 'user',
                parts: [{ text }]
            });
            this.saveHistory();
        }
    }

    executeCommanderTags(text) {
        // Detect commands like [COMMAND: SCROLL #projects]
        const scrollMatch = text.match(/\[COMMAND: SCROLL (#[a-z-]+)\]/i);
        if (scrollMatch) {
            const targetId = scrollMatch[1];
            const element = document.querySelector(targetId);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 1000); // Small delay after message appears
            }
        }

        // Detect command to open CV
        if (text.includes('[COMMAND: OPEN_CV]')) {
            const cvBtn = document.getElementById('cv-modal-btn');
            if (cvBtn) {
                cvBtn.click();
            } else {
                window.open('Mohamed_Salah_Resume.pdf', '_blank');
            }
        }

        // Detect command to open WhatsApp
        if (text.includes('[COMMAND: OPEN_WHATSAPP]')) {
            window.open('https://wa.me/201148295790', '_blank');
        }
    }

    typeWriter(element, text) {
        // Remove commands from display text
        const displayText = text.replace(/\[COMMAND: [A-Z0-9 _#]+\]/gi, '').trim();

        let i = 0;
        const speed = 15;
        element.innerHTML = "";

        const type = () => {
            if (i < displayText.length) {
                element.textContent += displayText.charAt(i);
                i++;
                this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
                setTimeout(type, speed);
            } else {
                if (typeof marked !== 'undefined') {
                    element.innerHTML = marked.parse(displayText);
                }
            }
        };
        type();
    }

    async handleSendMessage(overrideText = null) {
        const text = overrideText || this.input.value.trim();
        if (!text) return;

        // Simple Rate Limiting
        const now = Date.now();
        if (now - this.lastMessageTime < 1000) return; // Prevent spamming (2s cool down)
        this.lastMessageTime = now;

        const container = document.getElementById('quick-actions');
        container.style.display = 'none'; // Hide when user types

        this.addMessage(text, 'user');
        if (!overrideText) this.input.value = '';

        this.showTyping(true);

        try {
            const response = await this.getAIResponse(text);
            this.showTyping(false);
            this.addMessage(response, 'bot');

            // Keyword Detection to show buttons relevant to the conversation
            this.detectAndShowActions(text, response);
        } catch (error) {
            console.error("AI Error:", error);
            this.showTyping(false);
            const errorMessage = error.message || "All AI providers are currently unavailable.";
            this.addMessage(`⚠️ ${errorMessage}`, 'bot');
            container.style.display = 'flex'; // Show back if error to give options
        }
    }

    detectAndShowActions(query, response) {
        const container = document.getElementById('quick-actions');
        const textToScan = (query + " " + response).toLowerCase();

        const keywords = [
            'project', 'projects', 'مشاريع', 'اعمالك', 'سابقة',
            'cv', 'resume', 'سيرة', 'ذاتية', 'ملف',
            'contact', 'whatsapp', 'تواصل', 'رقم', 'واتس', 'مراسلة'
        ];

        const shouldShow = keywords.some(key => textToScan.includes(key));
        if (shouldShow) {
            container.style.display = 'flex';
        }
    }

    async getAIResponse(userQuery) {
        // Refresh site context before every AI response to catch updates
        this.extractSiteData();

        // Context Window Optimization: Send only last 10 messages
        // chatHistory already contains the userQuery at the end
        const contextHistory = this.chatHistory.slice(-10);

        try {
            // Try Gemini Providers first
            try {
                return await this.callGeminiAPI(contextHistory);
            } catch (geminiError) {
                console.warn("⚠️ Gemini failed, trying GitHub Models...");
                try {
                    return await this.callGitHubModelsAPI(contextHistory);
                } catch (githubError) {
                    console.warn("⚠️ GitHub Models failed, falling back to OpenRouter...");
                    try {
                        return await this.callOpenRouterAPI(contextHistory);
                    } catch (orError) {
                        throw new Error("Critical: All AI providers failed.");
                    }
                }
            }
        } catch (e) {
            throw e;
        }
    }

    showTyping(show) {
        this.typingIndicator.style.display = show ? 'block' : 'none';
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
    }

    async callGeminiAPI(history) {
        const systemText = this.getSystemPrompt(this.siteContext);
        if (!this.apiKey && !this.useProxy) throw new Error("Google API Key missing.");

        const contents = [
            { role: 'user', parts: [{ text: systemText }] },
            { role: 'model', parts: [{ text: "Understood. I am Mohamed Salah's Professional Assistant." }] },
            ...history
        ];

        let lastError = null;

        for (let attempt = 0; attempt < this.geminiModels.length; attempt++) {
            const currentModel = this.geminiModels[this.currentGeminiIndex];
            const API_URL = this.useProxy && this.proxyUrl 
                ? this.proxyUrl 
                : `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${this.apiKey}`;

            try {
                console.log(`🤖 Google Attempt: trying ${currentModel}${this.useProxy ? ' (via proxy)' : ''}...`);
                
                let fetchOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.useProxy ? { 
                        provider: 'gemini',
                        model: currentModel,
                        history: contents 
                    } : {
                        contents: contents,
                        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
                    })
                };
                
                const response = await fetch(API_URL, fetchOptions);

                const data = await response.json();
                if (!response.ok) throw new Error(data.error?.message || `Status ${response.status}`);

                if (data.candidates && data.candidates[0].content) {
                    return data.candidates[0].content.parts[0].text;
                }
                throw new Error("Empty response");
            } catch (error) {
                console.warn(`⚠️ Gemini model ${currentModel} failed: ${error.message}`);
                this.currentGeminiIndex = (this.currentGeminiIndex + 1) % this.geminiModels.length;
                lastError = error;
                continue;
            }
        }
        throw lastError;
    }

    async callGitHubModelsAPI(history) {
        const systemText = this.getSystemPrompt(this.siteContext);
        if (!this.githubToken && !this.useProxy) throw new Error("GitHub Token missing.");

        const messages = [
            { role: "system", content: systemText },
            ...history.map(h => ({
                role: h.role === "model" ? "assistant" : "user",
                content: h.parts[0].text
            }))
        ];

        let lastError = null;

        for (let attempt = 0; attempt < this.githubModels.length; attempt++) {
            const currentModel = this.githubModels[this.currentGithubIndex];
            const API_URL = `https://models.inference.ai.azure.com/chat/completions`;

            try {
                console.log(`🚀 GitHub Attempt: trying ${currentModel}${this.useProxy ? ' (via proxy)' : ''}...`);
                const response = await fetch(this.useProxy ? this.proxyUrl : API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.useProxy ? {
                        provider: 'github',
                        model: currentModel,
                        history: messages
                    } : {
                        model: currentModel,
                        messages: messages,
                        temperature: 0.7,
                        max_tokens: 2048
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error?.message || `Status ${response.status}`);

                if (data.choices && data.choices[0].message) {
                    return data.choices[0].message.content;
                }
                throw new Error("Empty response");
            } catch (error) {
                console.warn(`⚠️ GitHub model ${currentModel} failed: ${error.message}`);
                this.currentGithubIndex = (this.currentGithubIndex + 1) % this.githubModels.length;
                lastError = error;
                continue;
            }
        }
        throw lastError;
    }

    async callOpenRouterAPI(history) {
        const systemText = this.getSystemPrompt(this.siteContext);
        if (!this.openrouterKey && !this.useProxy) throw new Error("OpenRouter Key missing.");

        const messages = [
            { role: "system", content: systemText },
            ...history.map(h => ({
                role: h.role === "assistant" || h.role === "model" ? "assistant" : "user",
                content: h.parts[0].text
            }))
        ];

        let lastError = null;

        for (let attempt = 0; attempt < this.openrouterModels.length; attempt++) {
            const currentModel = this.openrouterModels[this.currentOpenRouterIndex];
            const API_URL = "https://openrouter.ai/api/v1/chat/completions";

            try {
                console.log(`🌐 OpenRouter Attempt: trying ${currentModel}${this.useProxy ? ' (via proxy)' : ''}...`);
                const response = await fetch(this.useProxy ? this.proxyUrl : API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.useProxy ? {
                        provider: 'openrouter',
                        model: currentModel,
                        history: messages
                    } : {
                        model: currentModel,
                        messages: messages,
                        temperature: 0.7,
                        max_tokens: 2048
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error?.message || `Status ${response.status}`);

                if (data.choices && data.choices[0].message) {
                    return data.choices[0].message.content;
                }
                throw new Error("Empty response");
            } catch (error) {
                console.warn(`⚠️ OpenRouter model ${currentModel} failed: ${error.message}`);
                this.currentOpenRouterIndex = (this.currentOpenRouterIndex + 1) % this.openrouterModels.length;
                lastError = error;
                continue;
            }
        }
        throw lastError;
    }

    getSystemPrompt(context) {
        return `You are Mohamed Salah's Professional AI Assistant. 
        
        CRITICAL BILINGUAL INSTRUCTIONS:
        1. MIRROR the user's language: If the user speaks Arabic, respond ONLY in Arabic (العربية). If they speak English, respond ONLY in English.
        2. Format all numbers, dates, and currencies clearly with comma separators.
        3. Use professional Markdown (bold titles, clean bullet points).
        
        COMMANDER CAPABILITIES:
        You can trigger UI actions by including these specific tags at the END of your response (they will be hidden from the user but executed by the system):
        - To scroll to a section: [COMMAND: SCROLL #section-id] (IDs: #home, #about, #experience, #skills, #projects, #contact)
        - To open the CV: [COMMAND: OPEN_CV]
        - To open WhatsApp: [COMMAND: OPEN_WHATSAPP]
        
        Example: "Sure, let's look at my projects. [COMMAND: SCROLL #projects]"
        
        Current Portfolio Data:
        ${context}
        
        Contact: WhatsApp +201148295790, Email mohamedsalahacc5050@gmail.com.`;
    }

    startTooltipAnimation() {
        setInterval(() => {
            if (!this.isOpen && this.tooltip) {
                this.tooltip.classList.add('wiggle');
                setTimeout(() => this.tooltip.classList.remove('wiggle'), 1000);
            }
        }, 5000); // Wiggle every 5 seconds
    }
}

// Initialize Chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioChatbot = new PortfolioChatbot();
});