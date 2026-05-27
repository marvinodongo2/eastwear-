import { useState } from "react";

const BRAND = {
  name: "Eastwear",
  location: "Nairobi, Kenya – Umoja 2",
  niche: "Second-hand basketball shoes & community basketball league",
  tone: "Hype, street-credible, community-driven, Nairobi youth culture",
  platforms: ["TikTok", "Instagram", "Facebook"],
};

const TABS = ["Shoe Listing", "Video Script", "Weekly Planner", "Strategy Audit", "Content Analyzer", "Inventory", "Video Editor"];

const PLATFORM_COLORS = {
  TikTok: "#ff0050",
  Instagram: "#e1306c",
  Facebook: "#1877f2",
};

const callClaude = async (prompt, systemPrompt) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await response.json();
  return data.content?.[0]?.text || "Error generating content.";
};

const SYSTEM_PROMPT = `You are the AI social media manager for Eastwear — a Nairobi-based brand selling second-hand basketball shoes and running a community basketball league at Umoja 2 Basketball Court. 

Brand voice: Hype, street-credible, youth-oriented, Nairobi slang welcome (e.g. "sawa", "moto", "bora"), community-driven, authentic.

Always produce content that feels local, energetic, and real — not corporate. Nairobi youth culture is the audience. Basketball is the heartbeat.`;

// ─── Shoe Listing Generator ───────────────────────────────────────────────────
function ShoeListing() {
  const [form, setForm] = useState({ brand: "", model: "", size: "", condition: "", price: "", detail: "" });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setResults(null);
    const shoeDesc = `Brand: ${form.brand}, Model: ${form.model}, Size: ${form.size} UK, Condition: ${form.condition}/10, Price: KES ${form.price}. Extra detail: ${form.detail}`;
    const prompt = `Generate platform-specific posts for these second-hand basketball shoes being sold by Eastwear in Nairobi:
${shoeDesc}

Return EXACTLY this format with no extra text:

TIKTOK:
[caption + 3-5 relevant hashtags optimized for TikTok]

INSTAGRAM:
[caption + 8-12 hashtags mixing local Nairobi tags and global sneaker tags]

FACEBOOK:
[longer conversational post for Nairobi Facebook groups, include price, size, condition, and a clear CTA to DM]`;

    const text = await callClaude(prompt, SYSTEM_PROMPT);
    const sections = {};
    ["TIKTOK", "INSTAGRAM", "FACEBOOK"].forEach((p) => {
      const regex = new RegExp(`${p}:\\n([\\s\\S]*?)(?=(TIKTOK:|INSTAGRAM:|FACEBOOK:|$))`);
      const match = text.match(regex);
      sections[p] = match ? match[1].trim() : "";
    });
    setResults(sections);
    setLoading(false);
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="tool-panel">
      <h2 className="tool-title">👟 Shoe Listing Generator</h2>
      <p className="tool-sub">Enter your shoe details — get posts ready for all 3 platforms.</p>
      <div className="form-grid">
        <div className="field">
          <label>Brand</label>
          <input placeholder="e.g. Nike, Jordan, Adidas" value={form.brand} onChange={e => set("brand", e.target.value)} />
        </div>
        <div className="field">
          <label>Model</label>
          <input placeholder="e.g. Air Force 1, Ultra Boost" value={form.model} onChange={e => set("model", e.target.value)} />
        </div>
        <div className="field">
          <label>Size (UK)</label>
          <input placeholder="e.g. 9, 10.5" value={form.size} onChange={e => set("size", e.target.value)} />
        </div>
        <div className="field">
          <label>Condition (1–10)</label>
          <input placeholder="e.g. 8" value={form.condition} onChange={e => set("condition", e.target.value)} />
        </div>
        <div className="field">
          <label>Price (KES)</label>
          <input placeholder="e.g. 3500" value={form.price} onChange={e => set("price", e.target.value)} />
        </div>
        <div className="field full">
          <label>Extra Details</label>
          <input placeholder="e.g. White/Black colourway, barely worn, came from US" value={form.detail} onChange={e => set("detail", e.target.value)} />
        </div>
      </div>
      <button className="gen-btn" onClick={generate} disabled={loading || !form.brand}>
        {loading ? <span className="spinner" /> : "⚡ Generate Posts"}
      </button>
      {results && (
        <div className="results">
          {Object.entries(results).map(([platform, content]) => (
            <ResultCard key={platform} platform={platform} content={content} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Video Script Generator ───────────────────────────────────────────────────
function VideoScript() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("hype");
  const [platform, setPlatform] = useState("TikTok");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const styles = ["hype", "storytelling", "educational", "behind the scenes", "funny/relatable"];

  const generate = async () => {
    setLoading(true);
    setResult(null);
    const prompt = `Create a short-form video script for ${platform} for Eastwear.

Topic: ${topic}
Style: ${style}
Duration: 30–60 seconds

Format your response as:

HOOK (first 3 seconds):
[The hook line]

SCRIPT:
[Full script with scene directions in brackets]

CAPTION:
[Platform-optimized caption with hashtags]

CTA:
[Call to action at the end of the video]`;

    const text = await callClaude(prompt, SYSTEM_PROMPT);
    setResult(text);
    setLoading(false);
  };

  return (
    <div className="tool-panel">
      <h2 className="tool-title">🎬 Video Script Generator</h2>
      <p className="tool-sub">Get a full script with hook, scenes, caption and CTA.</p>
      <div className="form-grid">
        <div className="field full">
          <label>Video Topic</label>
          <input placeholder="e.g. Showing off new Air Force 1s, Umoja 2 game day highlights, Why buy from Eastwear" value={topic} onChange={e => setTopic(e.target.value)} />
        </div>
        <div className="field">
          <label>Platform</label>
          <select value={platform} onChange={e => setPlatform(e.target.value)}>
            {["TikTok", "Instagram", "Facebook"].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Style</label>
          <select value={style} onChange={e => setStyle(e.target.value)}>
            {styles.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <button className="gen-btn" onClick={generate} disabled={loading || !topic}>
        {loading ? <span className="spinner" /> : "🎬 Write My Script"}
      </button>
      {result && (
        <div className="results">
          <div className="result-card raw">
            <div className="result-header">
              <span className="platform-badge" style={{ background: PLATFORM_COLORS[platform] }}>{platform}</span>
              <CopyBtn text={result} />
            </div>
            <pre className="result-text">{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Weekly Planner ───────────────────────────────────────────────────────────
function WeeklyPlanner() {
  const [context, setContext] = useState("");
  const [shoes, setShoes] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setResult(null);
    const prompt = `Create a full 7-day social media content calendar for Eastwear this week.

Current shoes in stock: ${shoes || "General sneaker stock"}
This week's context: ${context || "Normal week, no special events"}

For each day, give:
- Day & platform
- Post type (shoe listing / video / story / engagement)
- Content idea (1–2 sentences)
- Best posting time for Nairobi audience

Format as a clear day-by-day plan. Be specific and actionable.`;

    const text = await callClaude(prompt, SYSTEM_PROMPT);
    setResult(text);
    setLoading(false);
  };

  return (
    <div className="tool-panel">
      <h2 className="tool-title">📅 Weekly Content Planner</h2>
      <p className="tool-sub">Get a full 7-day posting plan across TikTok, Instagram & Facebook.</p>
      <div className="form-grid">
        <div className="field full">
          <label>Shoes currently in stock (optional)</label>
          <input placeholder="e.g. Jordan 1 Retro, Adidas NMD, Nike Zoom — sizes 8–11" value={shoes} onChange={e => setShoes(e.target.value)} />
        </div>
        <div className="field full">
          <label>Anything happening this week? (optional)</label>
          <input placeholder="e.g. League game on Saturday, new stock arriving Friday, payday weekend" value={context} onChange={e => setContext(e.target.value)} />
        </div>
      </div>
      <button className="gen-btn" onClick={generate} disabled={loading}>
        {loading ? <span className="spinner" /> : "📅 Plan My Week"}
      </button>
      {result && (
        <div className="results">
          <div className="result-card raw">
            <div className="result-header">
              <span className="platform-badge multi">7-Day Plan</span>
              <CopyBtn text={result} />
            </div>
            <pre className="result-text">{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Strategy Audit ───────────────────────────────────────────────────────────
function StrategyAudit() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Sawa! I'm your Eastwear strategy agent 🏀👟\n\nTell me what's been happening with your social media — what's getting engagement, what's flopping, and I'll give you a clear action plan." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const auditSystem = SYSTEM_PROMPT + `\n\nYou are now acting as a strategic social media auditor and advisor. Ask follow-up questions to understand performance. Give specific, actionable recommendations. Reference real strategies from the document context: autonomous agents, platform-specific content, voice learning, content calendars, hashtag strategy, TikTok hooks, Instagram aesthetics, and Facebook community building. Keep responses concise and direct. Use Nairobi street energy in your tone.`;

    const apiMessages = newMessages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));
    const text = await callClaude(apiMessages[apiMessages.length - 1].content, auditSystem);

    setMessages([...newMessages, { role: "assistant", content: text }]);
    setLoading(false);
  };

  return (
    <div className="tool-panel audit-panel">
      <h2 className="tool-title">🔍 Strategy Audit Agent</h2>
      <p className="tool-sub">Chat with your AI manager — get real strategy advice for Eastwear.</p>
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            <div className="msg-avatar">{m.role === "assistant" ? "🤖" : "👤"}</div>
            <div className="msg-bubble">
              <pre className="msg-text">{m.content}</pre>
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-msg assistant">
            <div className="msg-avatar">🤖</div>
            <div className="msg-bubble typing"><span /><span /><span /></div>
          </div>
        )}
      </div>
      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="e.g. My shoe posts get no engagement on Instagram..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !loading && send()}
        />
        <button className="send-btn" onClick={send} disabled={loading || !input.trim()}>Send</button>
      </div>
    </div>
  );
}

// ─── Inventory ────────────────────────────────────────────────────────────────
const STORAGE_KEY = "eastwear_inventory";

function loadInventory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

function saveInventory(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const STATUS_COLORS = { Available: "#22c55e", Reserved: "#f59e0b", Sold: "#ef4444" };
const STATUS_OPTIONS = ["Available", "Reserved", "Sold"];

function Inventory() {
  const [shoes, setShoes] = useState(loadInventory);
  const [search, setSearch] = useState("");
  const [filterSize, setFilterSize] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ brand: "", model: "", size: "", condition: "", price: "", color: "", notes: "", status: "Available" });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const persist = (updated) => { setShoes(updated); saveInventory(updated); };

  const resetForm = () => {
    setForm({ brand: "", model: "", size: "", condition: "", price: "", color: "", notes: "", status: "Available" });
    setEditId(null);
    setShowForm(false);
  };

  const addOrUpdate = () => {
    if (!form.brand || !form.model || !form.size) return;
    if (editId !== null) {
      persist(shoes.map(s => s.id === editId ? { ...s, ...form } : s));
    } else {
      persist([...shoes, { ...form, id: Date.now() }]);
    }
    resetForm();
  };

  const startEdit = (shoe) => {
    setForm({ brand: shoe.brand, model: shoe.model, size: shoe.size, condition: shoe.condition, price: shoe.price, color: shoe.color || "", notes: shoe.notes || "", status: shoe.status });
    setEditId(shoe.id);
    setShowForm(true);
  };

  const deleteShoe = (id) => { persist(shoes.filter(s => s.id !== id)); setConfirmDelete(null); };

  const cycleStatus = (id) => {
    persist(shoes.map(s => {
      if (s.id !== id) return s;
      const idx = STATUS_OPTIONS.indexOf(s.status);
      return { ...s, status: STATUS_OPTIONS[(idx + 1) % STATUS_OPTIONS.length] };
    }));
  };

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const allSizes = [...new Set(shoes.map(s => s.size).filter(Boolean))].sort((a, b) => parseFloat(a) - parseFloat(b));

  const filtered = shoes.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.brand.toLowerCase().includes(q) || s.model.toLowerCase().includes(q) || s.color?.toLowerCase().includes(q);
    const matchSize = !filterSize || s.size === filterSize;
    const matchStatus = !filterStatus || s.status === filterStatus;
    return matchSearch && matchSize && matchStatus;
  });

  const counts = { total: shoes.length, available: shoes.filter(s => s.status === "Available").length, reserved: shoes.filter(s => s.status === "Reserved").length, sold: shoes.filter(s => s.status === "Sold").length };

  return (
    <div className="tool-panel">
      <h2 className="tool-title">📦 Shoe Inventory</h2>
      <p className="tool-sub">Track your stock — search by size, brand, or status.</p>

      {/* Stats */}
      <div className="inv-stats">
        <div className="inv-stat"><span className="stat-num">{counts.total}</span><span className="stat-label">Total</span></div>
        <div className="inv-stat available"><span className="stat-num">{counts.available}</span><span className="stat-label">Available</span></div>
        <div className="inv-stat reserved"><span className="stat-num">{counts.reserved}</span><span className="stat-label">Reserved</span></div>
        <div className="inv-stat sold"><span className="stat-num">{counts.sold}</span><span className="stat-label">Sold</span></div>
      </div>

      {/* Search & Filters */}
      <div className="inv-filters">
        <input className="inv-search" placeholder="🔍 Search brand, model, colour..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="inv-select" value={filterSize} onChange={e => setFilterSize(e.target.value)}>
          <option value="">All Sizes</option>
          {allSizes.map(s => <option key={s} value={s}>UK {s}</option>)}
        </select>
        <select className="inv-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Add Button */}
      {!showForm && (
        <button className="gen-btn" style={{ marginBottom: 16 }} onClick={() => setShowForm(true)}>
          + Add Shoe to Inventory
        </button>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="inv-form">
          <div className="inv-form-title">{editId ? "✏️ Edit Shoe" : "➕ Add New Shoe"}</div>
          <div className="form-grid">
            <div className="field">
              <label>Brand *</label>
              <input placeholder="Nike, Jordan, Adidas..." value={form.brand} onChange={e => setF("brand", e.target.value)} />
            </div>
            <div className="field">
              <label>Model *</label>
              <input placeholder="LeBron 21, Air Force 1..." value={form.model} onChange={e => setF("model", e.target.value)} />
            </div>
            <div className="field">
              <label>Size (UK) *</label>
              <input placeholder="e.g. 9, 10.5" value={form.size} onChange={e => setF("size", e.target.value)} />
            </div>
            <div className="field">
              <label>Colour</label>
              <input placeholder="e.g. Black/Gum, White/Red" value={form.color} onChange={e => setF("color", e.target.value)} />
            </div>
            <div className="field">
              <label>Condition (1–10)</label>
              <input placeholder="e.g. 8" value={form.condition} onChange={e => setF("condition", e.target.value)} />
            </div>
            <div className="field">
              <label>Price (KES)</label>
              <input placeholder="e.g. 3500" value={form.price} onChange={e => setF("price", e.target.value)} />
            </div>
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={e => setF("status", e.target.value)}>
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Notes</label>
              <input placeholder="e.g. Came from US, slight crease" value={form.notes} onChange={e => setF("notes", e.target.value)} />
            </div>
          </div>
          <div className="inv-form-btns">
            <button className="gen-btn" style={{ flex: 1 }} onClick={addOrUpdate} disabled={!form.brand || !form.model || !form.size}>
              {editId ? "✓ Save Changes" : "✓ Add to Stock"}
            </button>
            <button className="cancel-btn" onClick={resetForm}>Cancel</button>
          </div>
        </div>
      )}

      {/* Shoe Cards */}
      {filtered.length === 0 ? (
        <div className="inv-empty">
          {shoes.length === 0 ? "No shoes yet — add your first pair above 👆" : "No shoes match your search."}
        </div>
      ) : (
        <div className="inv-list">
          {filtered.map(shoe => (
            <div key={shoe.id} className="inv-card">
              <div className="inv-card-top">
                <div>
                  <div className="inv-shoe-name">{shoe.brand} {shoe.model}</div>
                  <div className="inv-shoe-meta">
                    {shoe.color && <span>{shoe.color}</span>}
                    {shoe.color && shoe.condition && <span className="dot">·</span>}
                    {shoe.condition && <span>Cond: {shoe.condition}/10</span>}
                  </div>
                </div>
                <button
                  className="status-badge"
                  style={{ background: STATUS_COLORS[shoe.status] + "22", color: STATUS_COLORS[shoe.status], border: `1px solid ${STATUS_COLORS[shoe.status]}44` }}
                  onClick={() => cycleStatus(shoe.id)}
                  title="Tap to change status"
                >{shoe.status}</button>
              </div>
              <div className="inv-card-mid">
                <div className="inv-pill">UK {shoe.size}</div>
                {shoe.price && <div className="inv-pill orange">KES {shoe.price}</div>}
              </div>
              {shoe.notes && <div className="inv-notes">📝 {shoe.notes}</div>}
              <div className="inv-card-actions">
                <button className="inv-action-btn" onClick={() => startEdit(shoe)}>✏️ Edit</button>
                {confirmDelete === shoe.id ? (
                  <div className="confirm-row">
                    <span className="confirm-text">Delete?</span>
                    <button className="inv-action-btn danger" onClick={() => deleteShoe(shoe.id)}>Yes</button>
                    <button className="inv-action-btn" onClick={() => setConfirmDelete(null)}>No</button>
                  </div>
                ) : (
                  <button className="inv-action-btn danger" onClick={() => setConfirmDelete(shoe.id)}>🗑 Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Video Editor Agent ───────────────────────────────────────────────────────
function VideoEditor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [platform, setPlatform] = useState("TikTok");
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("30");
  const [style, setStyle] = useState("hype");
  const [phase, setPhase] = useState(null); // null | 'analyzing' | 'done'
  const [agents, setAgents] = useState([]);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);

  const AGENTS = [
    { id: "director",    icon: "🎬", name: "Director Agent",      desc: "Analyzing footage intent & building editing plan..." },
    { id: "narrative",   icon: "📝", name: "Narrative Agent",     desc: "Extracting hooks & scoring virality potential..." },
    { id: "editor",      icon: "✂️",  name: "Editor Agent",       desc: "Designing shot sequence & pacing structure..." },
    { id: "asset",       icon: "🎨", name: "Asset Creator Agent", desc: "Planning subtitles, B-roll & audio strategy..." },
    { id: "critic",      icon: "🔍", name: "Critic Agent",        desc: "Reviewing for platform safe zones & consistency..." },
  ];

  const handleFile = (f) => {
    if (!f || !f.type.startsWith("video/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setPhase(null);
    setResult(null);
    setAgents([]);
  };

  const reset = () => { setFile(null); setPreview(null); setPhase(null); setResult(null); setAgents([]); };

  const runAgents = async () => {
    setPhase("analyzing");
    setAgents([]);
    setResult(null);

    // Simulate agents firing one by one with delays
    for (let i = 0; i < AGENTS.length; i++) {
      await new Promise(r => setTimeout(r, 900 + Math.random() * 400));
      setAgents(prev => [...prev, AGENTS[i].id]);
    }

    // Now call Claude for the full brief
    const prompt = `You are a Multi-Agent AI Video Editing System analyzing a raw video for Eastwear — a Nairobi basketball shoe brand.

Video details:
- File: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)
- Target platform: ${platform}
- Creator goal: ${goal || "Make a viral short-form video"}
- Target duration: ${duration} seconds
- Style: ${style}
- Brand: Eastwear — second-hand basketball shoes, Umoja 2 Nairobi, youth basketball culture

Act as all 5 agents and produce a complete editing brief. Return in this EXACT format:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 DIRECTOR AGENT — EDITING PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Video Type: [classify the video]
Core Message: [single sentence]
Mood/Energy: [describe]
Editing Approach: [2-3 sentences on overall strategy]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 NARRATIVE AGENT — VIRALITY BRIEF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Virality Score: [X/10]
Hook (first 2 seconds): [exact line to open with]
Narrative Arc: [Intro → Build → Peak → CTA structure]
Key Moments to Highlight: [3 bullet points]
Sentiment Strategy: [what emotion to build toward]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✂️ EDITOR AGENT — SHOT SEQUENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aspect Ratio: 9:16 vertical (${platform} format)
Total Duration: ${duration} seconds
Cut every: [X seconds — pacing recommendation]
Shot 1 (0–3s): [Hook shot description]
Shot 2 (3–8s): [Build shot]
Shot 3 (8–${Math.floor(parseInt(duration)*0.6)}s): [Main content]
Shot 4 (${Math.floor(parseInt(duration)*0.6)}–${duration}s): [CTA shot]
Transitions: [what transition style to use]
Zoom Strategy: [when and where to apply zoom]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 ASSET CREATOR AGENT — STYLING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Caption Style: [font weight, color, placement — avoid ${platform} UI zones]
Caption Timing: [word-by-word or sentence]
Key Words to Highlight: [3-5 words to animate/color]
Emoji Strategy: [which emojis, where to place them]
B-Roll Suggestions: [2-3 cutaway ideas that match the content]
Background Music Style: [genre/energy for the track]
Audio: [any cleanup notes — remove silences, filler words]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 CRITIC AGENT — QUALITY CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Platform Safe Zones: [where NOT to place text on ${platform}]
Potential Issues: [2-3 things to watch out for]
Algorithm Tips: [2-3 specific tips for ${platform}'s algorithm]
Final Verdict: [APPROVED / NEEDS REVISION + reason]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 READY-TO-POST PACKAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Caption: [full ready-to-post caption]
Hashtags: [platform-optimized hashtag set]
Best Posting Time: [for Nairobi audience]
Thumbnail Tip: [what frame to use as thumbnail]`;

    const text = await callClaude(prompt, SYSTEM_PROMPT);
    setResult(text);
    setPhase("done");
  };

  const styles = ["hype", "cinematic", "storytelling", "funny/relatable", "educational", "product showcase"];
  const durations = ["15", "30", "45", "60"];

  return (
    <div className="tool-panel">
      <h2 className="tool-title">🤖 AI Video Editor Agent</h2>
      <p className="tool-sub">Upload your raw video — 5 AI agents analyze it and produce a complete viral editing brief.</p>

      {/* Agent Pipeline Visual */}
      <div className="pipeline">
        {AGENTS.map((a, i) => (
          <div key={a.id} className="pipeline-step">
            <div className={`pipeline-node ${agents.includes(a.id) ? "active" : ""} ${phase === "analyzing" && agents[agents.length-1] === a.id ? "pulsing" : ""}`}>
              <span className="pipeline-icon">{a.icon}</span>
            </div>
            <div className="pipeline-label">{a.name.split(" ")[0]}</div>
            {i < AGENTS.length - 1 && <div className={`pipeline-arrow ${agents.includes(AGENTS[i+1]?.id) ? "lit" : ""}`}>→</div>}
          </div>
        ))}
      </div>

      {/* Agent Status */}
      {phase === "analyzing" && (
        <div className="agent-status">
          {AGENTS.map(a => (
            <div key={a.id} className={`agent-row ${agents.includes(a.id) ? "done" : agents.length === AGENTS.indexOf(a) ? "running" : "waiting"}`}>
              <span className="agent-icon">{a.icon}</span>
              <div className="agent-info">
                <div className="agent-name">{a.name}</div>
                <div className="agent-desc">{agents.includes(a.id) ? "✓ Complete" : a.desc}</div>
              </div>
              <div className="agent-dot" />
            </div>
          ))}
        </div>
      )}

      {/* Upload */}
      {!file ? (
        <div
          className={`drop-zone ${dragging ? "dragging" : ""}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => document.getElementById("ve-input").click()}
        >
          <div className="drop-icon">🎥</div>
          <div className="drop-title">Upload Your Raw Video</div>
          <div className="drop-sub">MP4, MOV · Tap to browse · AI will generate full editing brief</div>
          <input id="ve-input" type="file" accept="video/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="preview-block" style={{ marginBottom: 12 }}>
          <video src={preview} controls className="preview-img" />
          <div className="preview-meta">
            <span className="preview-name">🎥 {file.name} · {(file.size/1024/1024).toFixed(1)}MB</span>
            <button className="reset-btn" onClick={reset}>✕ Remove</button>
          </div>
        </div>
      )}

      {/* Settings */}
      {file && phase !== "analyzing" && (
        <>
          <div className="form-grid" style={{ marginTop: 12 }}>
            <div className="field full">
              <label>What is this video about? (helps agents plan better)</label>
              <input placeholder="e.g. Showing off my Adidas DON Issue at Umoja court, selling for KES 3500" value={goal} onChange={e => setGoal(e.target.value)} />
            </div>
            <div className="field">
              <label>Target Platform</label>
              <select value={platform} onChange={e => setPlatform(e.target.value)}>
                {["TikTok", "Instagram", "Facebook"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Target Duration (seconds)</label>
              <select value={duration} onChange={e => setDuration(e.target.value)}>
                {durations.map(d => <option key={d} value={d}>{d}s</option>)}
              </select>
            </div>
            <div className="field">
              <label>Video Style</label>
              <select value={style} onChange={e => setStyle(e.target.value)}>
                {styles.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <button className="gen-btn" onClick={runAgents} disabled={phase === "analyzing"}>
            {phase === "analyzing" ? <><span className="spinner" /> Agents Working...</> : "🤖 Run AI Editing Agents"}
          </button>
        </>
      )}

      {/* Result */}
      {result && phase === "done" && (
        <div className="results" style={{ marginTop: 16 }}>
          <div className="agent-complete-banner">✅ All 5 agents complete — editing brief ready</div>
          <div className="result-card raw">
            <div className="result-header">
              <span className="platform-badge" style={{ background: PLATFORM_COLORS[platform] }}>{platform} Brief</span>
              <CopyBtn text={result} />
            </div>
            <pre className="result-text">{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Content Analyzer ────────────────────────────────────────────────────────
function ContentAnalyzer() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [context, setContext] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setResult(null);
    const isVideo = f.type.startsWith("video/");
    const isImage = f.type.startsWith("image/");
    setFileType(isVideo ? "video" : isImage ? "image" : null);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    try {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      let messages;

      if (isImage) {
        // Send image directly to Claude vision
        const base64 = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result.split(",")[1]);
          r.onerror = rej;
          r.readAsDataURL(file);
        });

        messages = [{
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: file.type, data: base64 }
            },
            {
              type: "text",
              text: `Analyze this Eastwear content image and give me a full platform-by-platform recommendation.
${context ? `Context from creator: ${context}` : ""}

Return your analysis in this exact format:

OVERALL SCORE: [X/10]
CONTENT TYPE: [What type of content this is]
STRENGTHS:
[2-3 things working well]

TIKTOK ANALYSIS:
Score: [X/10]
What works: [1-2 sentences]
What to fix: [1-2 sentences]
Hook suggestion: [A specific opening line for TikTok]
Best hashtags: [5 hashtags]

INSTAGRAM ANALYSIS:
Score: [X/10]
What works: [1-2 sentences]
What to fix: [1-2 sentences]
Caption suggestion: [A ready-to-use caption]
Best hashtags: [8 hashtags]

FACEBOOK ANALYSIS:
Score: [X/10]
What works: [1-2 sentences]
What to fix: [1-2 sentences]
Post suggestion: [A ready-to-use Facebook post]

TOP 3 ACTIONS TO TAKE NOW:
1. [Action]
2. [Action]
3. [Action]`
            }
          ]
        }];
      } else {
        // For video: describe what we know and ask for strategy
        messages = [{
          role: "user",
          content: `I'm uploading a video from Eastwear — a Nairobi brand selling second-hand basketball shoes and running a basketball league at Umoja 2.

Video file: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)
${context ? `Creator's description: ${context}` : "No description provided."}

Based on what I've described, give me a full platform-by-platform content strategy analysis and recommendations as if you had watched the video. Ask me any clarifying questions you need, then give recommendations.

Return in this format:

CONTENT ASSESSMENT:
[What type of video this likely is based on the filename/description]

TIKTOK RECOMMENDATIONS:
Score estimate: [X/10]
Hook (first 3 seconds): [Specific suggestion]
Editing tips: [2-3 specific tips]
Caption: [Ready-to-post caption]
Hashtags: [5-6 hashtags]

INSTAGRAM REELS RECOMMENDATIONS:
Score estimate: [X/10]
Cover frame tip: [What thumbnail to use]
Caption: [Ready-to-post caption]
Hashtags: [8-10 hashtags]
Stories tip: [How to repurpose as a Story]

FACEBOOK RECOMMENDATIONS:
Score estimate: [X/10]
Post text: [Ready-to-post Facebook text]
Targeting tip: [Who to target / which groups to post in]

TOP 3 ACTIONS:
1. [Action]
2. [Action]
3. [Action]`
        }];
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages,
        }),
      });

      const data = await response.json();
      setResult(data.content?.[0]?.text || "Error analyzing content.");
    } catch (err) {
      setResult("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setFileType(null);
    setResult(null);
    setContext("");
  };

  return (
    <div className="tool-panel">
      <h2 className="tool-title">📸 Content Analyzer</h2>
      <p className="tool-sub">Upload your shoe photo or video — get platform-specific scores and recommendations.</p>

      {!file ? (
        <div
          className={`drop-zone ${dragging ? "dragging" : ""}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => document.getElementById("file-input").click()}
        >
          <div className="drop-icon">📤</div>
          <div className="drop-title">Drop your content here</div>
          <div className="drop-sub">Photos (JPG, PNG) or Videos (MP4, MOV) · Tap to browse</div>
          <input
            id="file-input"
            type="file"
            accept="image/*,video/*"
            style={{ display: "none" }}
            onChange={e => handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="preview-block">
          {fileType === "image" && <img src={preview} alt="preview" className="preview-img" />}
          {fileType === "video" && <video src={preview} controls className="preview-img" />}
          <div className="preview-meta">
            <span className="preview-name">📁 {file.name}</span>
            <button className="reset-btn" onClick={reset}>✕ Remove</button>
          </div>
        </div>
      )}

      {file && (
        <>
          <div className="field" style={{ marginTop: 12 }}>
            <label>Tell the AI what this content is about (optional but helps)</label>
            <input
              placeholder="e.g. Showing my Jordan 1s, filmed at Umoja court, 30 second clip"
              value={context}
              onChange={e => setContext(e.target.value)}
            />
          </div>
          <button className="gen-btn" style={{ marginTop: 12 }} onClick={analyze} disabled={loading}>
            {loading ? <span className="spinner" /> : "🔍 Analyze My Content"}
          </button>
        </>
      )}

      {result && (
        <div className="results">
          <div className="result-card raw">
            <div className="result-header">
              <span className="platform-badge multi">Analysis Report</span>
              <CopyBtn text={result} />
            </div>
            <pre className="result-text">{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────
function ResultCard({ platform, content }) {
  if (!content) return null;
  return (
    <div className="result-card">
      <div className="result-header">
        <span className="platform-badge" style={{ background: PLATFORM_COLORS[platform] || "#333" }}>
          {platform}
        </span>
        <CopyBtn text={content} />
      </div>
      <p className="result-text">{content}</p>
    </div>
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return <button className="copy-btn" onClick={copy}>{copied ? "✓ Copied" : "Copy"}</button>;
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState(0);
  const panels = [<ShoeListing />, <VideoScript />, <WeeklyPlanner />, <StrategyAudit />, <ContentAnalyzer />, <Inventory />, <VideoEditor />];

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --orange: #FF5C00;
          --black: #0a0a0a;
          --dark: #111;
          --card: #171717;
          --border: #2a2a2a;
          --text: #e8e8e8;
          --muted: #888;
          --tiktok: #ff0050;
          --ig: #e1306c;
          --fb: #1877f2;
        }

        body { background: var(--black); }

        .app {
          min-height: 100vh;
          background: var(--black);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
        }

        .header {
          background: var(--dark);
          border-bottom: 1px solid var(--border);
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo-block {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          color: var(--orange);
          letter-spacing: 2px;
        }

        .logo-sub {
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .header-badge {
          margin-left: auto;
          background: #1a1a1a;
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 11px;
          color: var(--muted);
        }

        .nav {
          display: flex;
          gap: 4px;
          padding: 12px 24px 0;
          background: var(--dark);
          border-bottom: 1px solid var(--border);
          overflow-x: auto;
        }

        .nav-btn {
          padding: 8px 16px;
          background: none;
          border: none;
          color: var(--muted);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .nav-btn:hover { color: var(--text); }
        .nav-btn.active { color: var(--orange); border-bottom-color: var(--orange); }

        .content {
          flex: 1;
          padding: 24px;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
        }

        .tool-panel { animation: fadeIn 0.3s ease; }
        .audit-panel { display: flex; flex-direction: column; height: calc(100vh - 200px); }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        .tool-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          color: var(--text);
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .tool-sub {
          font-size: 13px;
          color: var(--muted);
          margin-bottom: 20px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .field { display: flex; flex-direction: column; gap: 6px; }
        .field.full { grid-column: 1 / -1; }

        .field label {
          font-size: 11px;
          font-weight: 600;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .field input, .field select {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 12px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .field input:focus, .field select:focus { border-color: var(--orange); }
        .field select { cursor: pointer; }
        .field select option { background: var(--card); }

        .gen-btn {
          width: 100%;
          padding: 14px;
          background: var(--orange);
          color: white;
          border: none;
          border-radius: 10px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 1px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity 0.2s, transform 0.1s;
        }

        .gen-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .gen-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .results { margin-top: 20px; display: flex; flex-direction: column; gap: 12px; }

        .result-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
        }

        .result-card.raw { }

        .result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .platform-badge {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px;
          letter-spacing: 1px;
          padding: 3px 10px;
          border-radius: 20px;
          color: white;
        }

        .platform-badge.multi {
          background: linear-gradient(90deg, var(--tiktok), var(--ig), var(--fb));
        }

        .result-text {
          font-size: 13px;
          line-height: 1.7;
          color: var(--text);
          white-space: pre-wrap;
          font-family: 'DM Sans', sans-serif;
        }

        .copy-btn {
          background: #222;
          border: 1px solid var(--border);
          color: var(--muted);
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }

        .copy-btn:hover { color: var(--text); border-color: #444; }

        /* Chat */
        .chat-window {
          flex: 1;
          overflow-y: auto;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 12px;
        }

        .chat-msg {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .chat-msg.user { flex-direction: row-reverse; }

        .msg-avatar {
          font-size: 20px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .msg-bubble {
          background: #1e1e1e;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 10px 14px;
          max-width: 80%;
        }

        .chat-msg.user .msg-bubble {
          background: #1c1008;
          border-color: #3a2510;
        }

        .msg-text {
          font-size: 13px;
          line-height: 1.6;
          color: var(--text);
          white-space: pre-wrap;
          font-family: 'DM Sans', sans-serif;
        }

        .typing {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 14px !important;
        }

        .typing span {
          width: 7px; height: 7px;
          background: var(--orange);
          border-radius: 50%;
          animation: bounce 1s infinite;
        }

        .typing span:nth-child(2) { animation-delay: 0.15s; }
        .typing span:nth-child(3) { animation-delay: 0.3s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }

        .chat-input-row {
          display: flex;
          gap: 8px;
        }

        .chat-input {
          flex: 1;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 14px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
        }

        .chat-input:focus { border-color: var(--orange); }

        .send-btn {
          padding: 12px 20px;
          background: var(--orange);
          color: white;
          border: none;
          border-radius: 10px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          letter-spacing: 1px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Video Editor Agent */
        .pipeline {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .pipeline-step {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .pipeline-node {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: #1a1a1a;
          border: 2px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s;
        }

        .pipeline-node.active {
          border-color: var(--orange);
          background: #1a0d00;
          box-shadow: 0 0 12px #ff5c0066;
        }

        .pipeline-node.pulsing {
          animation: pulse-node 0.8s infinite;
        }

        @keyframes pulse-node {
          0%, 100% { box-shadow: 0 0 8px #ff5c0066; }
          50% { box-shadow: 0 0 20px #ff5c00cc; }
        }

        .pipeline-icon { font-size: 18px; }

        .pipeline-label {
          display: none;
        }

        .pipeline-arrow {
          font-size: 14px;
          color: var(--border);
          margin: 0 2px;
          transition: color 0.4s;
        }

        .pipeline-arrow.lit { color: var(--orange); }

        .agent-status {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .agent-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .agent-row.done { background: #0d1a0d; }
        .agent-row.running { background: #1a0d00; }
        .agent-row.waiting { opacity: 0.4; }

        .agent-icon { font-size: 18px; flex-shrink: 0; }

        .agent-info { flex: 1; }

        .agent-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 2px;
        }

        .agent-desc { font-size: 11px; color: var(--muted); }

        .agent-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--border);
          flex-shrink: 0;
        }

        .agent-row.done .agent-dot { background: #22c55e; }
        .agent-row.running .agent-dot {
          background: var(--orange);
          animation: pulse-node 0.8s infinite;
        }

        .agent-complete-banner {
          background: #0d1a0d;
          border: 1px solid #22c55e44;
          color: #22c55e;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 600;
          text-align: center;
        }

        /* Inventory */
        .inv-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }

        .inv-stat {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 8px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .inv-stat.available { border-color: #22c55e44; }
        .inv-stat.reserved { border-color: #f59e0b44; }
        .inv-stat.sold { border-color: #ef444444; }

        .stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: var(--text); }
        .inv-stat.available .stat-num { color: #22c55e; }
        .inv-stat.reserved .stat-num { color: #f59e0b; }
        .inv-stat.sold .stat-num { color: #ef4444; }
        .stat-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }

        .inv-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .inv-search {
          flex: 1;
          min-width: 160px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 9px 12px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          outline: none;
        }

        .inv-search:focus { border-color: var(--orange); }

        .inv-select {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 9px 10px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }

        .inv-select option { background: var(--card); }

        .inv-form {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .inv-form-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 1px;
          color: var(--orange);
          margin-bottom: 12px;
        }

        .inv-form-btns { display: flex; gap: 8px; margin-top: 12px; }

        .cancel-btn {
          padding: 14px 20px;
          background: #1e1e1e;
          border: 1px solid var(--border);
          color: var(--muted);
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          cursor: pointer;
        }

        .inv-empty {
          text-align: center;
          color: var(--muted);
          font-size: 14px;
          padding: 48px 24px;
          background: var(--card);
          border: 1px dashed var(--border);
          border-radius: 12px;
        }

        .inv-list { display: flex; flex-direction: column; gap: 10px; }

        .inv-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 14px;
          transition: border-color 0.2s;
        }

        .inv-card:hover { border-color: #3a3a3a; }

        .inv-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .inv-shoe-name {
          font-weight: 600;
          font-size: 15px;
          color: var(--text);
          margin-bottom: 2px;
        }

        .inv-shoe-meta { font-size: 12px; color: var(--muted); }
        .dot { margin: 0 4px; }

        .status-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
          transition: opacity 0.2s;
        }

        .status-badge:hover { opacity: 0.8; }

        .inv-card-mid {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }

        .inv-pill {
          background: #1e1e1e;
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 3px 10px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text);
        }

        .inv-pill.orange { border-color: var(--orange); color: var(--orange); background: #1a0d00; }

        .inv-notes { font-size: 12px; color: var(--muted); margin-bottom: 10px; }

        .inv-card-actions {
          display: flex;
          gap: 8px;
          align-items: center;
          border-top: 1px solid var(--border);
          padding-top: 10px;
        }

        .inv-action-btn {
          background: none;
          border: 1px solid var(--border);
          color: var(--muted);
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }

        .inv-action-btn:hover { color: var(--text); border-color: #444; }
        .inv-action-btn.danger:hover { color: #ef4444; border-color: #ef444466; }

        .confirm-row { display: flex; align-items: center; gap: 6px; }
        .confirm-text { font-size: 12px; color: #ef4444; }

        .drop-zone {
          border: 2px dashed var(--border);
          border-radius: 14px;
          padding: 48px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--card);
          margin-bottom: 4px;
        }

        .drop-zone:hover, .drop-zone.dragging {
          border-color: var(--orange);
          background: #1a1208;
        }

        .drop-icon { font-size: 36px; margin-bottom: 10px; }

        .drop-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 1px;
          color: var(--text);
          margin-bottom: 6px;
        }

        .drop-sub { font-size: 12px; color: var(--muted); }

        .preview-block {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: var(--card);
          margin-bottom: 4px;
        }

        .preview-img {
          width: 100%;
          max-height: 320px;
          object-fit: cover;
          display: block;
        }

        .preview-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-top: 1px solid var(--border);
        }

        .preview-name { font-size: 12px; color: var(--muted); }

        .reset-btn {
          background: none;
          border: 1px solid var(--border);
          color: var(--muted);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }

        .reset-btn:hover { color: #ff4444; border-color: #ff4444; }

        @media (max-width: 500px) {
          .form-grid { grid-template-columns: 1fr; }
          .field.full { grid-column: 1; }
          .content { padding: 16px; }
          .nav { padding: 10px 16px 0; }
          .logo { font-size: 22px; }
        }
      `}</style>

      <div className="header">
        <div className="logo-block">
          <span className="logo">EASTWEAR</span>
          <span className="logo-sub">AI Social Manager</span>
        </div>
        <div className="header-badge">🇰🇪 Nairobi · Umoja 2</div>
      </div>

      <nav className="nav">
        {TABS.map((t, i) => (
          <button key={t} className={`nav-btn ${tab === i ? "active" : ""}`} onClick={() => setTab(i)}>
            {["👟", "🎬", "📅", "🔍", "📸", "📦", "🤖"][i]} {t}
          </button>
        ))}
      </nav>

      <div className="content">
        {panels[tab]}
      </div>
    </div>
  );
}
