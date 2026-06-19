import { useState, useRef } from "react"

export default function App() {
  const [platform, setPlatform] = useState("instagram")
  const [tone, setTone] = useState("professional")
  const [topic, setTopic] = useState("")
  const [image, setImage] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(URL.createObjectURL(file))
    const reader = new FileReader()
    reader.onload = () => setImageBase64(reader.result.split(",")[1])
    reader.readAsDataURL(file)
  }

  const generate = async () => {
    if (!topic.trim() && !imageBase64) return
    setLoading(true)
    setResult("")

    const content = []

    if (imageBase64) {
      content.push({
        type: "image",
        source: { type: "base64", media_type: "image/jpeg", data: imageBase64 }
      })
    }

    content.push({
      type: "text",
      text: `Write a ${tone} ${platform} post for Eastwear Basketball League in Nairobi.${topic ? " Context: " + topic : ""} ${imageBase64 ? "Use the image as inspiration for the caption." : ""} Include relevant hashtags.`
    })

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content }]
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
      <h1 style={{ fontSize: "22px" }}>Eastwear Social Manager</h1>

      <label>Platform</label><br />
      <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "12px" }}>
        <option value="instagram">Instagram</option>
        <option value="twitter">Twitter/X</option>
        <option value="facebook">Facebook</option>
        <option value="whatsapp">WhatsApp</option>
      </select>

      <label>Tone</label><br />
      <select value={tone} onChange={e => setTone(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "12px" }}>
        <option value="professional">Professional</option>
        <option value="hype">Hype</option>
        <option value="casual">Casual</option>
      </select>

      <label>Upload Image (optional)</label><br />
      <input type="file" accept="image/*" ref={fileRef} onChange={handleImage} style={{ marginBottom: "12px" }} />
      {image && <img src={image} alt="preview" style={{ width: "100%", borderRadius: "8px", marginBottom: "12px" }} />}

      <label>Describe your video or add extra context (optional)</label><br />
      <textarea
        rows={3}
        style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        placeholder="e.g. Highlight reel from Sunday's game, new shoe drop, league announcement..."
        value={topic}
        onChange={e => setTopic(e.target.value)}
      />

      <button
        onClick={generate}
        disabled={loading}
        style={{ width: "100%", padding: "12px", background: "#000", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px" }}
      >
        {loading ? "Generating..." : "Generate Post"}
      </button>

      {result && (
        <div style={{ marginTop: "20px", background: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
          <pre style={{ whiteSpace: "pre-wrap", fontFamily: "sans-serif" }}>{result}</pre>
          <button
            onClick={() => navigator.clipboard.writeText(result)}
            style={{ marginTop: "10px", padding: "8px 16px", background: "#333", color: "#fff", border: "none", borderRadius: "6px" }}
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  )
}
