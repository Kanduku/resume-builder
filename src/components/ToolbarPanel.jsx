"use client";
import { useResume } from "@/context/ResumeContext";
import QuickPalette from "./QuickPalette";
import { useRef, useState, useEffect } from "react";
import styles from "./ToolbarPanel.module.css";
import Link from "next/link";
import {
  FaPlus, FaTrash, FaUndo, FaRedo, FaSearchPlus, FaSearchMinus,
  FaMoon, FaEye, FaDownload, FaFileUpload, FaPalette, FaImage,
  FaFilePdf, FaSave
} from "react-icons/fa";
import {
  MdGradient, MdRotateRight, MdTextIncrease, MdTextDecrease, MdOpacity
} from "react-icons/md";

export default function ToolbarPanel({ canvasRef }) {
  const {
    addBlock, deleteBlock,
    changeFont, changeFontSize, changeTextColor,
    changeOpacity, rotateBlock,
    randomColorBlock, setGradient,
    undo, redo, insertImage,
    toggleDarkMode, togglePreview, zoomCanvas,
    exportJSON, importJSON, exportPNG, downloadPDF,
  } = useResume();

  const fileInputRef = useRef();
  const imageInputRef = useRef();
  const [mounted, setMounted] = useState(false);

  // Controlled inputs
  const [fontSizeValue, setFontSizeValue] = useState("");
  const [colorValue, setColorValue] = useState("#000000");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (file) importJSON(file);
  };

  const handleInsertImage = (e) => {
    const file = e.target.files[0];
    if (file) insertImage(file);
  };

  const handleSetGradient = () => {
    const color1 = prompt("Start color:", "#ff7e5f");
    const color2 = prompt("End color:", "#feb47b");
    if (color1 && color2) setGradient(color1, color2);
  };

  const handleRotate = () => {
    const deg = parseInt(prompt("Rotate degrees:", "0"), 10);
    if (!isNaN(deg)) rotateBlock(deg);
  };

  const handleFontSizeChange = (e) => {
    const value = e.target.value;
    setFontSizeValue(value);
    if (!isNaN(value) && value !== "") {
      changeFontSize(+value);
    }
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    setColorValue(color);
    changeTextColor(color);
  };

  if (!mounted) return null;

  return (
    <div className={styles.toolbarContainer}>
     <div className={`${styles.card} ${styles.mode}`}>
        <button onClick={toggleDarkMode}><FaMoon /></button>
        <button onClick={togglePreview}><FaEye /></button>
      </div>
      <div className={`${styles.card} ${styles.delete}`}>
        <button onClick={deleteBlock}><FaTrash /></button>
      </div>

      <div className={`${styles.card} ${styles.font}`}>
        <select onChange={(e) => changeFont(e.target.value)} defaultValue="">
          <option value="">Font</option>
          <option value="'Roboto', sans-serif">Roboto</option>
          <option value="'Poppins', sans-serif">Poppins</option>
          <option value="'Lobster', cursive">Lobster</option>
        </select>
      </div>

      <div className={`${styles.card} ${styles.fontSize}`}>
        <button onClick={() => changeFontSize("+")}><MdTextIncrease /></button>
        <button onClick={() => changeFontSize("-")}><MdTextDecrease /></button>
      </div>

      <div className={`${styles.card} ${styles.sizeInput}`}>
        <input
          type="number"
          placeholder="Size"
          value={fontSizeValue}
          onChange={handleFontSizeChange}
        />
      </div>

      <div className={`${styles.card} ${styles.colorPicker}`}>
        <input
          type="color"
          value={colorValue}
          onChange={handleColorChange}
        />
      </div>

      <div className={`${styles.card} ${styles.opacity}`}>
        <button onClick={() => changeOpacity(0.1)}><MdOpacity /></button>
        <button onClick={() => changeOpacity(-0.1)}><MdOpacity style={{ transform: 'scaleX(-1)' }} /></button>
      </div>

      <div className={`${styles.card} ${styles.rotate}`}>
        <button onClick={handleRotate}><MdRotateRight /></button>
      </div>

      <div className={`${styles.card} ${styles.gradient}`}>
        <button onClick={randomColorBlock}><FaPalette /></button>
        <button onClick={handleSetGradient}><MdGradient /></button>
      </div>

      <div className={`${styles.card} ${styles.palette}`}>
        <QuickPalette />
      </div>

      <div className={`${styles.card} ${styles.imageUpload}`}>
        <input type="file" accept="image/*" ref={imageInputRef} onChange={handleInsertImage} />
      </div>

      <div className={`${styles.card} ${styles.undoRedo}`}>
        <button onClick={undo}><FaUndo /></button>
        <button onClick={redo}><FaRedo /></button>
      </div>

      <div className={`${styles.card} ${styles.zoom}`}>
        <button onClick={() => zoomCanvas(1.1)}><FaSearchPlus /></button>
        <button onClick={() => zoomCanvas(0.9)}><FaSearchMinus /></button>
      </div>

      

      <div className={`${styles.card} ${styles.files}`}>
        <button onClick={exportJSON}><FaSave /></button>
        <button onClick={() => fileInputRef.current.click()}><FaFileUpload /></button>
        <input type="file" accept=".json" ref={fileInputRef} onChange={handleImportJSON} style={{ display: "none" }} />
      </div>

      <div className={`${styles.card} ${styles.export}`}>
        <button onClick={() => exportPNG(canvasRef)}><FaImage /></button>
        <button onClick={() => downloadPDF(canvasRef)}><FaFilePdf /></button>
      </div>
      

      

      <div className={styles.downloadContainer}>
        <button className={`${styles.downloadButton} ${styles.downloadImage}`} onClick={() => exportPNG(canvasRef)}>
          <FaDownload /> Download Image
        </button>
        <button className={`${styles.downloadButton} ${styles.downloadPDF}`} onClick={() => downloadPDF(canvasRef)}>
          <FaFilePdf /> Download PDF
        </button>
      </div>
     <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
  {/* Back Button */}
  <Link href="/">
    <button
      style={{
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '20px',
        cursor: 'pointer',
        background: 'rgba(255, 255, 255, 0.7)',
        color: '#000',
        fontWeight: '600',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        minWidth: '120px'
      }}
    >
      ← Back
    </button>
  </Link>

  {/* AI Button */}
  <Link href="/ai">
    <button
      style={{
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '20px',
        cursor: 'pointer',
        background: 'rgba(255, 255, 255, 0.7)',
        color: '#000',
        fontWeight: '600',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        minWidth: '120px'
      }}
    >
      🤖 AI
    </button>
  </Link>
</div>


    </div>
  );
}
