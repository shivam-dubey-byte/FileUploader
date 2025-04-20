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
        setMatrixLines((lines) => [
          ...lines.slice(-50),
          Array.from({ length: 60 }, () => (Math.random() > 0.7 ? Math.floor(Math.random() * 2) : " ")).join(" "),
        ]);
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isUnlocked]);

  if (isUnlocked) return <FileManager />;

  return (
    <div style={styles.terminalWrapper}>
      <div style={styles.matrixBackground}>
        {matrixLines.map((line, idx) => (
          <div key={idx} style={styles.matrixLine}>{line}</div>
        ))}
        <div style={styles.authBadge}>Authorized by SRD !!</div>
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
    backgroundColor: "#0d0d0d",
    color: "#33ff33",
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
    zIndex: 1000
  },
  matrixBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 0,
    overflow: "hidden",
    padding: "20px",
    pointerEvents: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    animation: "fadeIn 1s ease-in-out",
    background: "linear-gradient(to bottom, #000428, #004e92)",
  },
  matrixLine: {
    color: "#00ccff",
    fontSize: "14px",
    lineHeight: "18px",
    whiteSpace: "pre",
    fontWeight: "bold",
    opacity: 0.8,
    animation: "scrollFade 10s linear infinite",
  },
  authBadge: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "18px",
    color: "#00bcd4",
    fontWeight: "bold",
    animation: "fadeGlow 2s ease-in-out infinite alternate",
  },
  terminalBox: {
    border: "1px solid #33ff33",
    padding: "30px",
    borderRadius: "12px",
    backgroundColor: "#000",
    width: "90%",
    maxWidth: "400px",
    textAlign: "center",
    zIndex: 10,
    boxShadow: "0 0 20px rgba(0,255,0,0.4)"
  },
  terminalPrompt: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "10px"
  },
  terminalText: {
    marginBottom: "8px"
  },
  terminalInput: {
    padding: "10px",
    width: "100%",
    backgroundColor: "#111",
    color: "#33ff33",
    border: "1px solid #33ff33",
    borderRadius: "6px",
    fontFamily: "monospace"
  },
  buttonAnimated: {
    marginTop: "12px",
    backgroundColor: "#33ff33",
    color: "#000",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 0 10px rgba(51, 255, 51, 0.5)",
  },
};

export default UnlockScreen;
