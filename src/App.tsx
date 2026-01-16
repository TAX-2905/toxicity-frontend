import { useState } from "react";

type Result = {
  label: "toxic" | "non_toxic";
  confidence: number;
};

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

const res = await fetch(
  `${import.meta.env.VITE_API_URL}/predict`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  }
);

    const data: Result = await res.json();
    setResult(data);
    setLoading(false);
  };

  const clear = () => {
    setText("");
    setResult(null);
    setLoading(false);
  };

  const confidence = result ? Math.round(result.confidence * 100) : 0;
  const isToxic = result?.label === "toxic";

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🛡️ Toxicity Checker</h1>
        <p style={styles.subtitle}>
          ✍️ Paste text below to detect toxic language in Kreol Mauricien
        </p>

        <textarea
          placeholder="💬 Type or paste your text here…"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setResult(null);
          }}
          style={styles.textarea}
        />

        <div style={styles.buttonRow}>
          <button
            onClick={analyze}
            disabled={loading || !text.trim()}
            style={{
              ...styles.button,
              flex: 1,
              opacity: loading || !text.trim() ? 0.6 : 1,
            }}
          >
            {loading ? "🔍 Analyzing…" : "🚀 Analyze Text"}
          </button>

          <button
            onClick={clear}
            disabled={!text && !result}
            style={{
              ...styles.clearButton,
              opacity: !text && !result ? 0.6 : 1,
            }}
          >
            🧹 Clear
          </button>
        </div>

        {result && (
          <div style={styles.result}>
            <span
              style={{
                ...styles.resultLabel,
                color: isToxic ? "#c62828" : "#2e7d32",
              }}
            >
              {isToxic
                ? "⚠️ Toxic content detected"
                : "✅ Content looks safe"}
            </span>

            <div style={styles.bar}>
              <div
                style={{
                  ...styles.barFill,
                  width: `${confidence}%`,
                  background: isToxic
                    ? "linear-gradient(90deg, #ff5252, #ff867c)"
                    : "linear-gradient(90deg, #4caf50, #81c784)",
                }}
              />
            </div>

            <span style={styles.confidence}>
              📊 Confidence: {confidence}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "clamp(20px, 4vw, 30px)",
    boxShadow: "0 20px 45px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  title: {
    margin: 0,
    fontSize: "clamp(20px, 5vw, 26px)",
    fontWeight: 800,
    color: "#111",
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#555",
  },
  textarea: {
    height: "clamp(110px, 25vw, 150px)",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #ddd",
    fontSize: "14px",
    resize: "none" as const,
    outline: "none",
    background: "#fafafa",
    color: "#000",
    caretColor: "#000",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
  },
  button: {
    height: "46px",
    borderRadius: "14px",
    border: "none",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    background: "linear-gradient(135deg, #5f6cff, #8a7cff)",
    color: "#fff",
    boxShadow: "0 6px 18px rgba(95,108,255,0.4)",
  },
  clearButton: {
    height: "46px",
    borderRadius: "14px",
    border: "1px solid #ddd",
    background: "#f5f5f5",
    color: "#333",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    padding: "0 16px",
  },
  result: {
    marginTop: "4px",
    background: "#f4f6fb",
    borderRadius: "14px",
    padding: "14px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  resultLabel: {
    fontSize: "15px",
    fontWeight: 700,
  },
  bar: {
    height: "8px",
    background: "#ddd",
    borderRadius: "999px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    transition: "width 0.4s ease",
  },
  confidence: {
    fontSize: "12px",
    color: "#555",
    textAlign: "center" as const,
    fontWeight: 700,
  },
};
