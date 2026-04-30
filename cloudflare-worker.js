/**
 * CLOUDFLARE WORKER PROXY - MULTI-PROVIDER VERSION
 * Supports Gemini, GitHub Models, and OpenRouter.
 */

export default {
    async fetch(request, env) {
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*", // Restrict to your domain in production
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
        if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

        try {
            const body = await request.json();
            const { provider, model, history, prompt } = body;

            let apiUrl = "";
            let headers = { "Content-Type": "application/json" };
            let fetchBody = {};

            // 1. Gemini Configuration
            if (provider === "gemini") {
                const apiKey = env.GEMINI_API_KEY;
                apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                // Gemini expects { contents: [...] }
                fetchBody = { contents: history };
            }

            // 2. GitHub Models Configuration
            else if (provider === "github") {
                const token = env.GITHUB_TOKEN;
                apiUrl = "https://models.inference.ai.azure.com/chat/completions";
                headers["Authorization"] = `Bearer ${token}`;
                // GitHub expects OpenAI-style format
                fetchBody = {
                    model: model,
                    messages: history,
                    temperature: 0.7,
                    max_tokens: 1000
                };
            }

            // 3. OpenRouter Configuration
            else if (provider === "openrouter") {
                const apiKey = env.OPENROUTER_KEY;
                apiUrl = "https://openrouter.ai/api/v1/chat/completions";
                headers["Authorization"] = `Bearer ${apiKey}`;
                headers["HTTP-Referer"] = "https://github.com/mohamedsalahabdelhamid/portfolio"; // Optional
                headers["X-Title"] = "Mohamed Salah Portfolio";
                fetchBody = {
                    model: model,
                    messages: history
                };
            }

            // 4. Content Moderation, Translation & Persistence (Feedback)
            else if (provider === "moderation") {
                const apiKey = env.GEMINI_API_KEY;
                const githubToken = env.GITHUB_TOKEN;
                const owner = "mohamedsalahabdelhamid";
                const repoCandidate1 = "my-portfolio-main";
                const repoCandidate2 = "portfolio";
                const path = "data/reviews.json";

                const testimonialDataIn = JSON.parse(prompt);

                // 1. Moderate & Translate with Gemini (using JSON mode)
                const moderationPrompt = `
                    TASK: Analyze this feedback for a professional portfolio.
                    1. Check for spam/insults.
                    2. Translate fields into Arabic and English.
                    
                    Respond with a JSON object exactly like this:
                    {
                      "status": "PASS" or "FAIL",
                      "translated": {
                        "name_en": "...", "name_ar": "...",
                        "role_en": "...", "role_ar": "...",
                        "content_en": "...", "content_ar": "..."
                      }
                    }

                    INPUT:
                    Name: ${testimonialDataIn.name_en || testimonialDataIn.name_ar}
                    Role: ${testimonialDataIn.role_en || testimonialDataIn.role_ar}
                    Content: ${testimonialDataIn.content_en || testimonialDataIn.content_ar}
                `;
                
                const modRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        contents: [{ parts: [{ text: moderationPrompt }] }],
                        generationConfig: { response_mime_type: "application/json" }
                    })
                });
                
                const modData = await modRes.json();
                
                let aiResponse;
                try {
                    if (modData.candidates && modData.candidates[0].content) {
                        aiResponse = JSON.parse(modData.candidates[0].content.parts[0].text);
                    } else {
                        throw new Error("No AI Content");
                    }
                } catch (e) {
                    aiResponse = { 
                        status: "PASS", 
                        translated: {
                            name_en: testimonialDataIn.name_en || testimonialDataIn.name_ar,
                            name_ar: testimonialDataIn.name_ar || testimonialDataIn.name_en,
                            role_en: testimonialDataIn.role_en || testimonialDataIn.role_ar,
                            role_ar: testimonialDataIn.role_ar || testimonialDataIn.role_en,
                            content_en: testimonialDataIn.content_en || testimonialDataIn.content_ar,
                            content_ar: testimonialDataIn.content_ar || testimonialDataIn.content_en
                        }
                    };
                }

                if (aiResponse.status !== "PASS") {
                    return new Response(JSON.stringify({ result: "FAIL", status: "Inappropriate Content" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
                }

                const finalizedTestimonial = {
                    ...aiResponse.translated,
                    avatar: testimonialDataIn.avatar,
                    date: testimonialDataIn.date || new Date().toISOString()
                };

                // 2. Persist to GitHub with Repo Fallback
                let activeRepo = repoCandidate1;
                let persistenceStatus = "SUCCESS";
                let persistenceError = "None";

                async function tryPersist(repoName) {
                    try {
                        const fileRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${path}`, {
                            headers: { "Authorization": `token ${githubToken}`, "User-Agent": "Cloudflare-Worker" }
                        });
                        
                        let currentContent = [];
                        let sha = null;

                        if (fileRes.status === 404) return { success: false, error: "404 Not Found" };
                        if (!fileRes.ok) return { success: false, error: `Auth/API Error: ${fileRes.status}` };

                        const fileData = await fileRes.json();
                        sha = fileData.sha;
                        const binaryString = atob(fileData.content);
                        const bytes = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
                        currentContent = JSON.parse(new TextDecoder().decode(bytes));
                        
                        currentContent.unshift(finalizedTestimonial);
                        const utf8Bytes = new TextEncoder().encode(JSON.stringify(currentContent, null, 2));
                        const base64Content = btoa(String.fromCharCode(...utf8Bytes));

                        const putRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${path}`, {
                            method: "PUT",
                            headers: { "Authorization": `token ${githubToken}`, "User-Agent": "Cloudflare-Worker", "Content-Type": "application/json" },
                            body: JSON.stringify({ message: "chore: add review", content: base64Content, sha: sha })
                        });

                        return { success: putRes.ok, error: putRes.ok ? null : `PUT Error: ${putRes.status}` };
                    } catch (e) {
                        return { success: false, error: e.message };
                    }
                }

                let result = await tryPersist(repoCandidate1);
                activeRepo = repoCandidate1;
                if (!result.success) {
                    activeRepo = repoCandidate2;
                    result = await tryPersist(repoCandidate2);
                }

                return new Response(JSON.stringify({ 
                    result: "PASS", 
                    testimonial: finalizedTestimonial, 
                    persistence: result.success ? "SUCCESS" : "FAILED",
                    error: result.error || "Unknown Error",
                    diagnostics: { owner, repo: activeRepo, path }
                }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
            }

            // 5. Fetch Reviews from GitHub
            else if (provider === "get_reviews") {
                const githubToken = env.GITHUB_TOKEN;
                const owner = "mohamedsalahabdelhamid";
                const repo = "my-portfolio-main";
                const path = "data/reviews.json";

                try {
                    const fileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
                        headers: { "Authorization": `token ${githubToken}`, "User-Agent": "Cloudflare-Worker" }
                    });

                    if (!fileRes.ok) return new Response(JSON.stringify([]), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

                    const fileData = await fileRes.json();
                    const binaryString = atob(fileData.content);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
                    const currentContent = JSON.parse(new TextDecoder().decode(bytes));

                    return new Response(JSON.stringify(currentContent), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
                } catch (err) {
                    return new Response(JSON.stringify([]), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
                }
            }

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(fetchBody),
            });

            const data = await response.json();
            return new Response(JSON.stringify(data), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });

        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }
    },
};

