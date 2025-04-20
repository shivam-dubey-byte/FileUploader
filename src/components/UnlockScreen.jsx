import React, { useState, useEffect } from "react";
import FileManager from "./FileManager";

const UnlockScreen = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [attempt, setAttempt] = useState("");
  const [matrixLines, setMatrixLines] = useState([]);

  const PASSWORD = "unlock2024";

  const authenticate = () => {
    if (attempt === PASSWORD) {
      setIsUnlocked(true);
    } else {
      alert("❌ Invalid command. Try again.");
    }
  };

  useEffect(() => {
    if (!isUnlocked) {
      const interval = setInterval(() => {
        const horizontal = Array.from({ length: 70 }, () => (Math.random() > 0.8 ? Math.floor(Math.random() * 2) : " ")).join(" ");
        const vertical = `| ${Array.from({ length: 10 }, () => (Math.random() > 0.7 ? Math.floor(Math.random() * 2) : " ")).join("\n| ")}`;
        setMatrixLines((lines) => [...lines.slice(-40), horizontal, vertical]);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isUnlocked]);

  if (isUnlocked) return <FileManager />;

  return (
    <div style={styles.terminalWrapper}>
      <div style={styles.matrixBackground}>
        {matrixLines.map((line, idx) => (
          <pre key={idx} style={styles.matrixLine}>{line}</pre>
        ))}
        <div style={styles.authBadge}># Authorized by SRD #</div>
      </div>
      <div style={styles.terminalBox}>
        <p style={styles.terminalPrompt}>Developer Mode Access</p>
        <p style={styles.terminalText}>$ Enter access code:</p>
        <input
          type="password"
          style={styles.terminalInput}
          value={attempt}
          onChange={(e) => setAttempt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && authenticate()}
          autoFocus
        />
        <button style={styles.buttonAnimated} onClick={authenticate}>Enter</button>
      </div>
    </div>
  );
};

const styles = {
  terminalWrapper: {
    backgroundColor: "#000814",
    color: "#33ccff",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    fontFamily: "monospace",
    overflow: "hidden",
    zIndex: 1000,
    padding: "16px",
    boxSizing: "border-box"
  },
  matrixBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
    overflow: "hidden",
    padding: "20px",
    pointerEvents: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    background: "radial-gradient(circle, #001d3d, #000814)",
  },
  matrixLine: {
    color: "#00bfff",
    fontSize: "3vw",
    lineHeight: "1.2em",
    fontWeight: "500",
    opacity: 0.85,
    textShadow: "0 0 6px #00bfff",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word"
  },
  authBadge: {
    position: "absolute",
    bottom: "25px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "4vw",
    maxFontSize: "18px",
    color: "#1de9b6",
    fontWeight: "bold",
    animation: "fadeGlow 3s ease-in-out infinite alternate",
  },
  terminalBox: {
    border: "1px solid #1de9b6",
    padding: "30px",
    borderRadius: "12px",
    backgroundColor: "#001d3d",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    zIndex: 10,
    boxShadow: "0 0 20px rgba(0,255,255,0.3)",
    boxSizing: "border-box"
  },
  terminalPrompt: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px"
  },
  terminalText: {
    marginBottom: "8px",
    fontSize: "16px"
  },
  terminalInput: {
    padding: "10px",
    width: "100%",
    backgroundColor: "#0a192f",
    color: "#33ccff",
    border: "1px solid #33ccff",
    borderRadius: "6px",
    fontFamily: "monospace",
    fontSize: "16px"
  },
  buttonAnimated: {
    marginTop: "12px",
    backgroundColor: "#1de9b6",
    color: "#000",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 0 10px rgba(29, 233, 182, 0.6)",
    fontSize: "16px"
  },
};

export default UnlockScreen;
