"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ResumeContext = createContext();

export function ResumeProvider({ children }) {
  const [canvasBlocks, setCanvasBlocks] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [scale, setScale] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [historyStack, setHistoryStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // ✅ Stable id generation across re-renders and hydration
  const nextIdRef = useRef(1);
  const nextId = () => nextIdRef.current++;

  useEffect(() => {
    pushHistory(canvasBlocks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------
  // 📝 Smart addBlock supporting rich JSON templates
  // ------------------------------------------------
  const addBlock = (blockData = "New Section...") => {
    let newBlock;
    if (typeof blockData === "string") {
      newBlock = {
        id: nextId(), // ✅ hydration-safe id
        type: "paragraph",
        content: blockData.replace(/\n/g, "<br>"),
        styles: {},
      };
    } else {
      newBlock = {
        id: nextId(), // ✅ hydration-safe id
        type: blockData.type || "paragraph",
        content: Array.isArray(blockData.content)
          ? blockData.content
          : blockData.content?.replace?.(/\n/g, "<br>"),
        styles: blockData.styles || {},
      };
    }

    newBlock = {
      x: 50,
      y: 50 + canvasBlocks.length * 80,
      width: 300,
      height: 100,
      fontFamily: "'Roboto', sans-serif",
      fontSize: 16,
      background: "#fff",
      rotation: 0,
      opacity: 1,
      alignment: "left",
      letterSpacing: "normal",
      lineHeight: "normal",
      textTransform: "none",
      effects: [],
      ...newBlock,
    };

    const updated = [...canvasBlocks, newBlock];
    setCanvasBlocks(updated);
    pushHistory(updated);
    setSelectedBlockId(newBlock.id);
  };

  // ------------------------------------------------
  // 🛠 Update functions
  // ------------------------------------------------
  const updateBlock = (id, updates) => {
    const updated = canvasBlocks.map((block) =>
      block.id === id
        ? { ...block, ...(typeof updates === "function" ? updates(block) : updates) }
        : block
    );
    setCanvasBlocks(updated);
    pushHistory(updated);
  };

  const updateBlockContent = (id, newContent) => {
    updateBlock(id, { content: newContent });
  };

  const deleteBlock = () => {
    if (!selectedBlockId) return;
    const updated = canvasBlocks.filter((b) => b.id !== selectedBlockId);
    setCanvasBlocks(updated);
    pushHistory(updated);
    setSelectedBlockId(null);
  };

  const changeFontSize = (op) => {
    if (!selectedBlockId) return;
    updateBlock(selectedBlockId, (prev) => ({
      fontSize: Math.max(10, prev.fontSize + (op === "+" ? 2 : -2)),
    }));
  };

  const changeFont = (font) => { if (selectedBlockId) updateBlock(selectedBlockId, { fontFamily: font }); };
  const changeTextColor = (color) => { if (selectedBlockId) updateBlock(selectedBlockId, { color }); };
  const changeLineHeight = (delta) => {
    if (selectedBlockId) updateBlock(selectedBlockId, (b) => ({
      lineHeight: ((parseFloat(b.lineHeight) || 1.4) + delta).toFixed(2)
    }));
  };
  const adjustLetterSpacing = (delta) => {
    if (selectedBlockId) updateBlock(selectedBlockId, (b) => ({
      letterSpacing: ((parseFloat(b.letterSpacing) || 0) + delta) + "px"
    }));
  };
  const toggleTextTransform = (type) => {
    if (selectedBlockId) updateBlock(selectedBlockId, (b) => ({
      textTransform: b.textTransform === type ? 'none' : type
    }));
  };
  const alignText = (dir) => { if (selectedBlockId) updateBlock(selectedBlockId, { alignment: dir }); };
  const randomColorBlock = () => { if (selectedBlockId) updateBlock(selectedBlockId, { background: '#' + Math.floor(Math.random()*16777215).toString(16) }); };
  const setGradient = (color1, color2) => { if (selectedBlockId) updateBlock(selectedBlockId, { background: `linear-gradient(45deg, ${color1}, ${color2})` }); };
  const changeOpacity = (delta) => {
    if (selectedBlockId) updateBlock(selectedBlockId, (b) => ({
      opacity: Math.min(1, Math.max(0, (parseFloat(b.opacity) || 1) + delta))
    }));
  };
  const adjustPadding = (delta) => { if (selectedBlockId) updateBlock(selectedBlockId, (b) => ({ padding: ((parseInt(b.padding) || 0) + delta) + "px" })); };
  const adjustMargin = (delta) => { if (selectedBlockId) updateBlock(selectedBlockId, (b) => ({ margin: ((parseInt(b.margin) || 0) + delta) + "px" })); };

  const rotateBlock = (deg) => { if (selectedBlockId) updateBlock(selectedBlockId, { rotation: deg }); };

  const toggleClassEffect = (className) => {
    if (selectedBlockId) updateBlock(selectedBlockId, (b) => ({
      effects: b.effects?.includes(className)
        ? b.effects.filter((c) => c !== className)
        : [...(b.effects || []), className]
    }));
  };

  const addGlow = () => toggleClassEffect("glow");
  const togglePulse = () => toggleClassEffect("pulse");
  const toggleBounce = () => toggleClassEffect("bounce");
  const toggleRotateAnim = () => toggleClassEffect("rotateAnim");
  const toggleBlur = () => toggleClassEffect("blur");
  const toggleInvert = () => toggleClassEffect("invert");

  const moveBlock = (id, x, y) => { updateBlock(id, { x, y }); };
  const resizeBlock = (id, width, height) => { updateBlock(id, { width, height }); };
  const nudgeBlock = (id, dx, dy) => {
    const block = canvasBlocks.find((b) => b.id === id);
    if (block) moveBlock(id, block.x + dx, block.y + dy);
  };

  const changeColorPicker = (color) => { if (selectedBlockId) updateBlock(selectedBlockId, { background: color }); };
  const insertImage = (file) => {
    if (!file || !selectedBlockId) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateBlock(selectedBlockId, (prev) => ({
        content: prev.content + `<img src="${reader.result}" style="max-width:100%;">`,
      }));
    };
    reader.readAsDataURL(file);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark");
  };
  const togglePreview = () => { setPreviewMode((prev) => !prev); };
  const zoomCanvas = (factor) => { setScale((prev) => prev * factor); };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(canvasBlocks, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", "canvas.json");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const importJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      setCanvasBlocks(data);
      pushHistory(data);
    };
    reader.readAsText(file);
  };

  const cleanBorders = () => canvasBlocks.map(block => {
    const { border, ...rest } = block;
    return rest;
  });

  const exportPNG = async (canvasRef) => {
    if (!canvasRef?.current) return;
    const el = canvasRef.current;
    el.classList.add("preview");
    setTimeout(async () => {
      setCanvasBlocks(cleanBorders());
      const canvasImage = await html2canvas(el, { scale: 2 });
      const link = document.createElement("a");
      link.download = "resume.png";
      link.href = canvasImage.toDataURL();
      link.click();
      el.classList.remove("preview");
    }, 100);
  };

  const downloadPDF = async (canvasRef) => {
    if (!canvasRef?.current) return;
    const el = canvasRef.current;
    el.classList.add("preview");
    setTimeout(async () => {
      setCanvasBlocks(cleanBorders());
      const canvasImage = await html2canvas(el, { scale: 2 });
      const imageData = canvasImage.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvasImage.height * pdfWidth) / canvasImage.width;
      pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("resume.pdf");
      el.classList.remove("preview");
    }, 100);
  };

  const pushHistory = (state) => {
    setHistoryStack((prev) => {
      const newStack = [...prev, JSON.stringify(state)];
      if (newStack.length > 50) newStack.shift();
      return newStack;
    });
    setRedoStack([]);
  };

  const undo = () => {
    if (historyStack.length <= 1) return;
    const newStack = [...historyStack];
    const last = newStack.pop();
    setRedoStack((r) => [...r, last]);
    const prevState = JSON.parse(newStack[newStack.length - 1]);
    setCanvasBlocks(prevState);
    setHistoryStack(newStack);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const newRedo = [...redoStack];
    const next = newRedo.pop();
    setCanvasBlocks(JSON.parse(next));
    setHistoryStack((h) => [...h, next]);
    setRedoStack(newRedo);
  };

  return (
    <ResumeContext.Provider value={{
      canvasBlocks, selectedBlockId, scale, previewMode, darkMode,
      addBlock, updateBlock, deleteBlock, updateBlockContent,
      changeFontSize, changeFont, changeTextColor, changeLineHeight,
      adjustLetterSpacing, toggleTextTransform, alignText,
      randomColorBlock, setGradient, changeOpacity,
      adjustPadding, adjustMargin, rotateBlock,
      addGlow, togglePulse, toggleBounce, toggleRotateAnim, toggleBlur, toggleInvert,
      moveBlock, resizeBlock, nudgeBlock,
      changeColorPicker, insertImage,
      toggleDarkMode, togglePreview, zoomCanvas,
      exportJSON, importJSON, exportPNG, downloadPDF,
      undo, redo, setSelectedBlockId
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  return useContext(ResumeContext);
}
