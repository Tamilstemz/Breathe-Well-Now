// FullPageLoader.tsx
import React from "react";

interface FullPageLoaderProps {
  progress: number; // Percentage progress (0–100)
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({ progress }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      {/* Spinner */}
      <div className="spinner" style={{
        border: "8px solid #f3f3f3",
        borderTop: "8px solid #3498db",
        borderRadius: "50%",
        width: "80px",
        height: "80px",
        animation: "spin 1s linear infinite"
      }} />

      {/* Progress Percentage */}
      <div style={{ marginTop: "20px", fontSize: "18px", fontWeight: "bold" }}>
        {progress}% Completed
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FullPageLoader;
