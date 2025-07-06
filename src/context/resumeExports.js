// "use client";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// export function useExportFunctions(canvasBlocks, setCanvasBlocks, pushHistory) {
//   const exportJSON = () => {
//     const dataStr =
//       "data:text/json;charset=utf-8," +
//       encodeURIComponent(JSON.stringify(canvasBlocks, null, 2));
//     const link = document.createElement("a");
//     link.setAttribute("href", dataStr);
//     link.setAttribute("download", "canvas.json");
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   };

//   const importJSON = (file) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = JSON.parse(e.target.result);
//       setCanvasBlocks(data);
//       pushHistory(data);
//     };
//     reader.readAsText(file);
//   };

//  const exportPNG = async (canvasRef, setPreviewMode) => {
//   if (!canvasRef?.current) return;
//   const el = canvasRef.current;
//   const originalTransform = el.style.transform;

//   try {
//     setPreviewMode(true); // ✅ Enable preview mode
//     el.classList.add("preview");
//     el.style.transform = "none";

//     await new Promise((res) => setTimeout(res, 100)); // Allow style to apply

//     const canvasImage = await html2canvas(el, {
//       scale: 2,
//       useCORS: true,
//       backgroundColor: null,
//     });

//     const link = document.createElement("a");
//     link.download = "resume.png";
//     link.href = canvasImage.toDataURL("image/png");
//     link.click();
//   } catch (err) {
//     console.error("❌ Failed to export PNG:", err);
//   } finally {
//     setPreviewMode(false); // ✅ Disable preview mode
//     el.classList.remove("preview");
//     el.style.transform = originalTransform;
//   }
// };

//   const downloadPDF = async (canvasRef) => {
//     if (!canvasRef?.current) return;
//     const el = canvasRef.current;
//     const originalTransform = el.style.transform;

//     try {
//       el.classList.add("preview");
//       el.style.transform = "none";

//       await new Promise((res) => setTimeout(res, 100));

//       const canvasImage = await html2canvas(el, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: "#ffffff", // Ensure white PDF background
//       });

//       const imageData = canvasImage.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvasImage.height * pdfWidth) / canvasImage.width;

//       pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save("resume.pdf");
//     } catch (err) {
//       console.error("❌ Failed to export PDF:", err);
//     } finally {
//       el.classList.remove("preview");
//       el.style.transform = originalTransform;
//     }
//   };

//   return {
//     exportJSON,
//     importJSON,
//     exportPNG,
//     downloadPDF,
//   };
// }
