"use client";
import { useResume } from "@/context/ResumeContext";
import { useEffect, useState } from "react";
import styles from "./CanvasArea.module.css";

export default function CanvasArea({ canvasRef }) {
  const {
    canvasBlocks,
    selectedBlockId,
    moveBlock,
    resizeBlock,
    updateBlockContent,
    nudgeBlock,
    setSelectedBlockId,
    scale,
    darkMode,
    previewMode,
    deleteBlock,
  } = useResume();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const GEMINI_API_KEY = "AIzaSyCkAbS7rT0uK-GqBgVSfCGRZWMMftmOEyc";

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      setSelectedBlockId(null);
    }
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();
      let text = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (!text && json?.candidates?.[0]?.output) {
        text = json.candidates[0].output;
      }

      if (!text) {
        text = "❌ No meaningful text response from AI.";
      }

      text = text
        .replace(/[\*\_\#\-\`]/g, "")
        .replace(/\s{2,}/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      setPrompt(text);
    } catch (err) {
      setPrompt(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    alert("Copied to clipboard ✅");
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (!selectedBlockId || previewMode) return;
      const step = e.shiftKey ? 10 : 1;
      let dx = 0, dy = 0;
      if (e.key === "ArrowLeft") dx = -step;
      if (e.key === "ArrowRight") dx = step;
      if (e.key === "ArrowUp") dy = -step;
      if (e.key === "ArrowDown") dy = step;

      if (dx || dy) {
        e.preventDefault();
        nudgeBlock(selectedBlockId, dx, dy);
      }

      if (e.key === "Delete") deleteBlock();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedBlockId, previewMode]);

  const handleMouseDown = (e, block) => {
    e.stopPropagation();
    setSelectedBlockId(block.id);

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - canvasRect.left - block.x;
    const offsetY = e.clientY - canvasRect.top - block.y;
    const freeMove = e.altKey;

    const onMouseMove = (moveEvent) => {
      const newX = moveEvent.clientX - canvasRect.left - offsetX;
      const newY = moveEvent.clientY - canvasRect.top - offsetY;

      const snappedX = freeMove ? newX : Math.round(newX / 20) * 20;
      const snappedY = freeMove ? newY : Math.round(newY / 20) * 20;

      moveBlock(block.id, Math.max(0, snappedX), Math.max(0, snappedY));
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleResize = (e, block) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = block.width;
    const startHeight = block.height;

    const onMouseMove = (moveEvent) => {
      const newWidth = Math.max(50, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(30, startHeight + (moveEvent.clientY - startY));
      resizeBlock(block.id, newWidth, newHeight);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const renderBlockContent = (block) => {
    if (block.type === "list" && Array.isArray(block.content)) {
      return (
        <ul style={{ margin: 0, paddingLeft: "1em" }}>
          {block.content.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }

    if (block.type === "table" && Array.isArray(block.content)) {
      return (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {block.content.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ border: "1px solid #ccc", padding: "4px" }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (block.type === "quote") {
      return <blockquote style={{ margin: 0, fontStyle: "italic" }}>{block.content}</blockquote>;
    }

    return (
      <div
        contentEditable={!previewMode && block.type === "paragraph"}
        suppressContentEditableWarning
        onBlur={(e) => updateBlockContent(block.id, e.target.innerHTML)}
        dangerouslySetInnerHTML={{ __html: block.content }}
        style={{ height: "100%", outline: "none" }}
      ></div>
    );
  };

  return (
    <>
      {/* AI Tool Section */}
      <div className={styles.aiTool}>
      <h3 style={{ textAlign: "center", width: "100%" }}>🧠 Ask AI about your resume</h3>

        <div className={styles.promptRow}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Suggest improvements to my experience section..."
            rows={4}
            className={styles.promptInput}
          />
          <div className={styles.aiButtons}>
            <button
              onClick={handleGenerateAI}
              disabled={loading}
              className={styles.askButton}
            >
              {loading ? "Thinking..." : "Ask Gemini"}
            </button>
            <button onClick={handleCopy} className={styles.copyButton}>
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area Section */}
      <div
        ref={canvasRef}
        onClick={handleCanvasClick}
        className={`${styles.canvasArea} ${darkMode ? styles.dark : ""} ${previewMode ? styles.preview : ""}`}
        style={{ transform: `scale(${scale})` }}
      >
        {canvasBlocks.map((block) => (
          <div
            key={block.id}
            onMouseDown={(e) => handleMouseDown(e, block)}
            tabIndex={0}
            className={`${styles.block} ${selectedBlockId === block.id ? styles.selected : ""}`}
            style={{
              ...block.styles,
              left: block.x,
              top: block.y,
              width: block.width,
              height: block.height,
              background: block.background,
              fontFamily: block.fontFamily,
              fontSize: `${block.fontSize}px`,
              textAlign: block.alignment,
              letterSpacing: block.letterSpacing,
              lineHeight: block.lineHeight,
              textTransform: block.textTransform,
              color: block.styles?.color || (darkMode ? "#fff" : "#000"),
              opacity: block.opacity,
              transform: `rotate(${block.rotation}deg)`,
              textShadow: block.textShadow !== "none" ? block.textShadow : "none",
            }}
          >
            {renderBlockContent(block)}

            {!previewMode && (
              <div
                onMouseDown={(e) => handleResize(e, block)}
                className={styles.resizeHandle}
              ></div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
