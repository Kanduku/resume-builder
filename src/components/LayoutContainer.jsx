// LayoutContainer.jsx
import { useRef, useEffect, useState } from "react";
import TemplatesPanel from "./TemplatesPanel";
import CanvasArea from "./CanvasArea";
import ToolbarPanel from "./ToolbarPanel";

export default function LayoutContainer() {
  const canvasRef = useRef();

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const matchDark = window.matchMedia("(prefers-color-scheme: dark)");
    const updateMode = () => setIsDarkMode(matchDark.matches);
    updateMode();

    matchDark.addEventListener("change", updateMode);
    return () => matchDark.removeEventListener("change", updateMode);
  }, []);

  const backgroundColor = isDarkMode ? "#121212" : "#f5f5f5";
  const panelBorderColor = isDarkMode ? "#333" : "#ddd";

  return (
    <div style={{ flex: 1, display: "flex", backgroundColor }}>
      <div style={{ width: "20%", borderRight: `1px solid ${panelBorderColor}` }}>
        <TemplatesPanel />
      </div>
      <div
        style={{
          flex: "0 0 210mm",
          margin: "0 auto",
          background: "#fff",
          border: "2px solid #000",
          height: "297mm",
          overflowY: "auto",
          padding: "10px",
          boxSizing: "border-box",
        }}
      >
        <CanvasArea canvasRef={canvasRef} />
      </div>
      <div style={{ flex: 1, borderLeft: `1px solid ${panelBorderColor}` }}>
        <ToolbarPanel canvasRef={canvasRef} />
      </div>
    </div>
  );
}
