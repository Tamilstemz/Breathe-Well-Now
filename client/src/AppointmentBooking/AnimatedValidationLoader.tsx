import { AlertCircle, CheckCircle2 } from "lucide-react";

interface AnimatedValidationLoaderProps {
  isLoading: boolean;
  status?: "validating" | "success" | "error";
  message?: string;
  onRetry?: () => void;
}

export default function AnimatedValidationLoader({
  isLoading,
  status = "validating",
  message = "Please wait while we verify your information",
  onRetry,
}: AnimatedValidationLoaderProps) {
  return (
    <div
      style={{
        // minHeight: "100vh",
        // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        width: '100%',
        height: '100%',
        background: 'transparent'
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "40px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        }}
      >
        {/* Loading State */}
        {isLoading && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  border: "4px solid #e5e7eb",
                  borderTop: "4px solid #667eea",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
            </div>

            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "12px",
                letterSpacing: "0.5px",
              }}
            >
              Validating
              <span
                style={{
                  display: "inline-block",
                  marginLeft: "4px",
                  animation: "dots 1.5s steps(4, end) infinite",
                }}
              >
                ...
              </span>
            </h2>

            <p style={{ color: "#6b7280", fontSize: "14px", margin: "0" }}>
              {message}
            </p>

            <div
              style={{
                marginTop: "24px",
                height: "4px",
                background: "#e5e7eb",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #667eea, #764ba2)",
                  animation: "progress 2.5s ease-in-out infinite",
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Success State */}
        {!isLoading && status === "success" && (
          <div style={{ textAlign: "center", animation: "slideIn 0.5s ease" }}>
            <CheckCircle2
              size={60}
              style={{
                color: "#10b981",
                marginBottom: "20px",
                animation: "bounce 0.6s ease-out",
              }}
            />
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "12px",
              }}
            >
              Validation Successful!
            </h2>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>
              Your information has been verified successfully.
            </p>

            {onRetry && (
              <button
                onClick={onRetry}
                style={buttonStyle("#10b981", "#059669")}
              >
                Validate Again
              </button>
            )}
          </div>
        )}

        {/* Error State */}
        {!isLoading && status === "error" && (
          <div style={{ textAlign: "center", animation: "slideIn 0.5s ease" }}>
            <AlertCircle
              size={60}
              style={{
                color: "#ef4444",
                marginBottom: "20px",
                animation: "shake 0.5s ease-out",
              }}
            />
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "12px",
              }}
            >
              Validation Failed
            </h2>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>
              Please check your information and try again.
            </p>

            {onRetry && (
              <button
                onClick={onRetry}
                style={buttonStyle("#ef4444", "#dc2626")}
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {/* Animations */}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes dots {
            0%, 20% { content: ''; }
            40% { content: '.'; }
            60% { content: '..'; }
            80%, 100% { content: '...'; }
          }
          @keyframes progress {
            0% { width: 0%; }
            50% { width: 100%; }
            100% { width: 0%; }
          }
          @keyframes bounce {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}

// 🔧 Shared Button Styles
const buttonStyle = (color: string, hoverColor: string): React.CSSProperties => ({
  padding: "10px 24px",
  background: color,
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.3s ease",
  boxShadow: "none",
  outline: "none",
  marginTop: "8px",
});
