import React, { useState, useEffect } from "react";
import FileManager from "./FileManager";

const UnlockScreen = () => {
  const [accessStatus, setAccessStatus] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [attempt, setAttempt] = useState("");
  const [matrixLines, setMatrixLines] = useState(Array(30).fill(" "));

  const PASSWORD = "unlock2024";

  const authenticate = () => {
    if (attempt === PASSWORD) {
      setAccessStatus("granted");
      setTimeout(() => {
        setIsUnlocked(true);
      }, 1500);
    } else {
      setAccessStatus("denied");
      setTimeout(() => setAccessStatus(null), 1500);
    }
  };

  useEffect(() => {
    if (!isUnlocked) {
      const interval = setInterval(() => {
        const binaryLine = Array.from({ length: 20 }, () => {
          const rand = Math.random();
          if (rand > 0.985) return "SRD";
          if (rand > 0.95) return String.fromCharCode(65 + Math.floor(Math.random() * 26));
          return rand > 0.75 ? Math.floor(Math.random() * 2) : " ";
        }).join(" ");
        const phrases = [
          "# Authorized by SRD #",
          "Initializing secure environment...",
          "Verifying identity...",
          "Access log verified.",
          "System ready.",
          `#####  #####  #####\n#   #  #   #  #   #\n#####  #   #  #####\n#      #   #      #\n#      #####      #`
        ];
        const special = Math.random() > 0.995 ? phrases[Math.floor(Math.random() * phrases.length)] : null;
        const offset = Math.floor(Math.random() * 40);
        const paddedLine = " ".repeat(offset) + (special || binaryLine);
        setMatrixLines((lines) => {
          const newLine = paddedLine;
          const updated = [...lines.slice(1), newLine];
          while (updated.length < Math.floor(window.innerHeight / 24)) {
            updated.unshift(" ");
          }
          return updated;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isUnlocked]);

  if (isUnlocked) return <FileManager />;

  return (
    <div style={styles.terminalWrapper}>
      <div style={styles.matrixBackground}>
        <div style={styles.matrixStream}>
          {matrixLines.map((line, idx) => (
            <pre key={idx} style={styles.matrixLine}>{line}</pre>
          ))}
        </div>
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

      {accessStatus && (
  <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '420px',
    maxWidth: '90vw',
    minHeight: '200px',
    backdropFilter: 'blur(12px)',
    backgroundImage: 'linear-gradient(to bottom, rgba(0, 8, 20, 0.5), rgba(0, 31, 63, 0.5))',
    borderRadius: '12px',
    border: `3px solid ${accessStatus === 'granted' ? '#00ff99' : '#ff4c4c'}`,
    color: accessStatus === 'granted' ? '#00ff99' : '#ff4c4c',
    fontWeight: 'bold',
    fontSize: '2.4rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '40px 20px',
    boxShadow: `0 0 20px ${accessStatus === 'granted' ? '#00ff99' : '#ff4c4c'}`,
    zIndex: 999
  }}>
    {accessStatus === 'granted' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
  </div>
)}

    </div>
  );
};

const styles = {
  terminalWrapper: {
    backgroundColor: "#000814",
    color: "#00ff99",
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
    width: "100vw",
    height: "100vh",
    zIndex: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    background: "linear-gradient(to bottom, #000000, #001f3f)",
    padding: "0",
    margin: "0"
  },
  matrixStream: {
    flexGrow: 1,
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  matrixLine: {
    color: "#00ffcc",
    fontSize: "clamp(10px, 1.5vw, 18px)",
    fontWeight: "400",
    opacity: 0.85,
    textShadow: "0 0 8px #00ffcc",
    whiteSpace: "pre",
    wordBreak: "break-word",
    width: "100%",
    lineHeight: "2.2",
    overflow: "hidden",
  },
  authBadge: {
    position: "fixed",
    bottom: "10vh",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "clamp(14px, 3vw, 20px)",
    color: "#00e6e6",
    fontWeight: "bold",
    animation: "fadeGlow 3s ease-in-out infinite alternate",
    textShadow: "0 0 10px #00e6e6",
    zIndex: 2,
    whiteSpace: "nowrap",
  },
  terminalBox: {
    border: "1px solid #00ffcc",
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
    backgroundColor: "#00e6e6",
    color: "#000",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 0 10px rgba(0, 230, 230, 0.6)",
    fontSize: "16px"
  },
};

export default UnlockScreen;
