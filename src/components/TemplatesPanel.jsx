"use client";
import { useResume } from "@/context/ResumeContext";
import { useState, useEffect } from "react";
import templates from "@/data/templates";
import styles from "./TemplatesPanel.module.css";

export default function TemplatesPanel() {
  const { addBlock } = useResume();
  const [mounted, setMounted] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const renderContent = (option) => {
    if (option.type === "paragraph" || option.type === "quote") {
      return option.content.replace(/\n/g, "<br>");
    }
    if (option.type === "list") {
      return `<ul style="margin:0; padding-left:20px;">
        ${option.content.map(item => `<li>${item}</li>`).join("")}
      </ul>`;
    }
    if (option.type === "table") {
      return `<table style="border-collapse:collapse;width:100%;">
        ${option.content.map(row => `
          <tr>${row.map(cell => `<td style="border:1px solid #ccc;padding:4px;">${cell}</td>`).join("")}</tr>
        `).join("")}
      </table>`;
    }
    return "";
  };

  return (
    <div className={styles.panelContainer}>
      <h3 className={styles.heading}> Templates</h3>
      {templates.map((template, i) => (
        <div key={i} className={styles.templateSection}>
          <div
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className={`${styles.templateHeader} ${openIndex === i ? styles.open : ""}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setOpenIndex(openIndex === i ? null : i);
              }
            }}
          >
            <span>{template.label}</span>
            <span className={`${styles.arrow} ${openIndex === i ? styles.open : ""}`} aria-hidden="true">▶</span>
          </div>

          {openIndex === i && (
            <div className={styles.optionsContainer}>
              {template.options.map((option, j) => (
                <div
                  key={j}
                  onClick={() => addBlock(option)}
                  className={styles.optionBlock}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      addBlock(option);
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: renderContent(option) }}
                ></div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
