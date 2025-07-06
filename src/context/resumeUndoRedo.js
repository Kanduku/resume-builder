// // resumeUndoRedo.js
// "use client";

// export function useUndoRedoFunctions(
//   setCanvasBlocks,
//   historyStack,
//   setHistoryStack,
//   redoStack,
//   setRedoStack
// ) {
//   const undo = () => {
//     setHistoryStack((prev) => {
//       if (prev.length <= 1) return prev;
//       const newStack = [...prev];
//       const lastState = newStack.pop();
//       setRedoStack((r) => [...r, lastState]);
//       setCanvasBlocks(JSON.parse(newStack[newStack.length - 1]));
//       return newStack;
//     });
//   };

//   const redo = () => {
//     setRedoStack((prev) => {
//       if (prev.length === 0) return prev;
//       const nextState = prev.pop();
//       setCanvasBlocks(JSON.parse(nextState));
//       setHistoryStack((h) => [...h, nextState]);
//       return prev;
//     });
//   };

//   return { undo, redo };
// }
