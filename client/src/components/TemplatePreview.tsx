import { useEffect, useCallback } from "react";
import "../AppointmentBooking/AppointmentBooking.css";

interface TemplatePreviewProps {
  htmlContent: string;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ htmlContent }) => {
  const clearSignature = useCallback((canvasId?: string) => {
    const container = document.getElementById("template-container");
    if (!container) return;

    if (canvasId) {
      const canvas = container.querySelector<HTMLCanvasElement>(`#${canvasId}`);
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    } else {
      const canvases = container.querySelectorAll<HTMLCanvasElement>("canvas");
      canvases.forEach((canvas) => {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      });
    }
  }, []);

  useEffect(() => {
    const container = document.getElementById("template-container");
    if (!container) return;

    // Process HTML content to remove problematic inline handlers
    const processedHtmlContent = htmlContent.replace(/onclick="[^"]*"/g, "");

    // Set the processed HTML
    const templateContainer = container.querySelector(".template-content");
    if (templateContainer) {
      templateContainer.innerHTML = processedHtmlContent;
    }

    const canvases = container.querySelectorAll("canvas");
    const buttons = container.querySelectorAll("button");

    // Set up canvas drawing functionality
    canvases.forEach((canvas) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Configure canvas
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const signatureUrl = canvas.dataset.signature;
      if (signatureUrl) {
        // Load image as base64 to avoid cross-origin taint
        fetch(signatureUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.onload = () => {
              const img = new Image();
              img.src = reader.result as string; // base64 string
              img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              };
            };
            reader.readAsDataURL(blob);
          })
          .catch((err) => console.warn("Failed to load signature:", err));
      }

      let isDrawing = false;

      const startDrawing = (e: MouseEvent | Touch) => {
        isDrawing = true;
        draw(e);
      };

      const draw = (e: MouseEvent | Touch | any) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = "clientX" in e ? e.clientX - rect.left : e.pageX - rect.left;
        const y = "clientY" in e ? e.clientY - rect.top : e.pageY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
      };

      const stopDrawing = () => {
        isDrawing = false;
        ctx.beginPath();
      };

      // Event listeners
      canvas.addEventListener("mousedown", startDrawing);
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("mouseup", stopDrawing);
      canvas.addEventListener("mouseout", stopDrawing);

      canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        startDrawing(e.touches[0]);
      });
      canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        draw(e.touches[0]);
      });
      canvas.addEventListener("touchend", (e) => {
        e.preventDefault();
        stopDrawing();
      });

      // Cleanup function
      return () => {
        canvas.removeEventListener("mousedown", startDrawing);
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("mouseup", stopDrawing);
        canvas.removeEventListener("mouseout", stopDrawing);
        canvas.removeEventListener("touchstart", startDrawing as any);
        canvas.removeEventListener("touchmove", draw as any);
        canvas.removeEventListener("touchend", stopDrawing as any);
      };
    });

    // Set up button functionality
    buttons.forEach((btn) => {
      const targetCanvasId = btn.getAttribute("data-canvas");

      btn.addEventListener("click", () => {
        if (targetCanvasId) {
          clearSignature(targetCanvasId);
        } else {
          // If no specific canvas, clear all
          clearSignature();
        }
      });

      // Cleanup function
      return () => {
        btn.removeEventListener("click", clearSignature as any);
      };
    });
  }, [htmlContent, clearSignature]);

  return (
    <div className="space-y-6">
      <div className="p-4">
        <div
          className="template-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
};

export default TemplatePreview;

/**
 * Extracts all form input data from the given container ID.
 * Works for input, textarea, select (text, number, date, radio, checkbox).
 */
export function extractFormData(containerId: string): Record<string, any> {
  const container = document.getElementById(containerId);
  if (!container) return {};

  const inputs = container.querySelectorAll<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >("input[name], textarea[name], select[name]");

  const data: Record<string, any> = {};

  inputs.forEach((input) => {
    const name = input.name;
    if (!name) return;

    if (input instanceof HTMLInputElement) {
      switch (input.type) {
        case "checkbox":
          data[name] = input.checked;
          break;
        case "radio":
          if (input.checked) data[name] = input.value;
          else if (!(name in data)) data[name] = ""; // Unchecked radios default to empty
          break;
        default:
          data[name] = input.value || "";
      }
    } else {
      // textarea or select
      data[name] = input.value || "";
    }
  });

  console.log("✅ Extracted Template Data:", data);
  return data;
}

export function prefillForm(containerId: string, data: Record<string, any>) {
  const container = document.getElementById(containerId);
  if (!container) return;

  Object.keys(data).forEach((key) => {
    const inputs = container.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >(`[name="${key}"]`);

    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement) {
        if (input.type === "checkbox") {
          input.checked = Boolean(data[key]);
        } else if (input.type === "radio") {
          input.checked = input.value === data[key];
        } else {
          input.value = data[key] ?? "";
        }
      } else {
        input.value = data[key] ?? "";
      }
    });
  });
}
