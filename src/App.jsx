import { useState } from "react"

export default function App() {
  const [platform, setPlatform] = useState("instagram")
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("professional")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setResult("")
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Write a ${tone} ${platform} post about: ${topic}. For Eastwear Basketball League in Nairobi.`
          }]
        })
      })
      const data = await response.json()
      setResult(data.content[0].text)
    } catch (e) {
      setResult("Error generating post. Try again.")
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Eastwear Social Manager</h1>
      <select value={platform} onChange={e => setPlatform(e.target.value)}>
        <option value="instagram">Instagram</option>
        <option value="twitter">Twitter/X</option>
        <option value="facebook">Facebook</option>
        <option value="whatsapp">WhatsApp</option>
      </select>
      <br/><br/>
      <select value={tone} onChange={e => setTone(e.target.value)}>
        <option value="professional">Professional</option>
        <option value="hype">Hype</option>
        <option value="casual">Casual</option>
      </select>
      <br/><br/>
      <textarea
        rows={4}
        style={{ width: "100%" }}
        placeholder="What's the post about? e.g. Game day, new shoes, league results..."
        value={topic}
        onChange={e => setTopic(e.target.value)}
      />
      <br/>
      <button onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate Post"}
      </button>
      {result && (
        <div style={{ marginTop: "20px", background: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
          <pre style={{ whiteSpace: "pre-wrap" }}>{result}</pre>
        </div>
      )}
    </div>
  )
}
