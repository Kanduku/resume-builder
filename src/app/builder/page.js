'use client';
import { ResumeProvider } from "@/context/ResumeContext";
import MainHeader from "@/components/MainHeader";
import LayoutContainer from "@/components/LayoutContainer";
import { useRef, useEffect, useState } from "react";

export default function BuilderPage() {
  const canvasRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <ResumeProvider>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column",backgroundColor:"grey", }}>
        {!isLoaded ? (
          <div style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.5rem",
            fontWeight: "bold",
            flexDirection: "row",
            gap: "1rem"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "5px solid #ccc",
              borderTop: "5px solid #3498db",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            <span>Loading Builder...</span>
            <style>
              {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
            </style>
          </div>
        ) : (
          <>
            <MainHeader canvasRef={canvasRef} />
            <LayoutContainer canvasRef={canvasRef} />
          </>
        )}
      </div>
    </ResumeProvider>
  );
}
