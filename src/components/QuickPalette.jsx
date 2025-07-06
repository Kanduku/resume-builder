"use client";
import React from "react";
import { useResume } from "./../context/ResumeContext";

export default function QuickPalette() {
  const { changeColorPicker } = useResume(); // ✅ fixed

  const colors = ["#e74c3c", "#27ae60", "#2980b9", "#f39c12", "#8e44ad"];

  return (
    <div style={{ margin: "10px" }}>
      {colors.map((color) => (
        <span
          key={color}
          onClick={() => changeColorPicker(color)} // ✅ fixed
          style={{
            background: color,
            width: "20px",
            height: "20px",
            display: "inline-block",
            cursor: "pointer",
            marginRight: "5px",
            border: "2px solid #fff",
            borderRadius: "50%",
            boxShadow: "0 0 2px rgba(0,0,0,0.5)"
          }}
          title={color}
        ></span>
      ))}
    </div>
  );
}
