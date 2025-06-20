import React from "react";
import "./Toast.css";

export const showToast = (
  type: "success" | "error" | "info" | "warning" = "success",
  message: string,
  duration: number = 3000
): void => {
  const toast = document.createElement("div");
  toast.className = `custom-toast ${type}`;
  toast.innerHTML = `
    <button class="toast-close">&times;</button>
    <span class="toast-message">${message}</span>
    <div class="toast-timer"></div>
  `;

  document.body.appendChild(toast);

  const timerBar = toast.querySelector(".toast-timer") as HTMLElement | null;
  const closeButton = toast.querySelector(
    ".toast-close"
  ) as HTMLButtonElement | null;

  if (!timerBar || !closeButton) {
    console.error("Toast elements not found.");
    return;
  }

  let startTime = performance.now();
  let paused = false;
  let elapsed = 0;
  let animationFrame: number;

  const updateTimer = (now: number) => {
    if (!paused) {
      elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      timerBar.style.width = `${100 - progress * 100}%`;

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateTimer);
      } else {
        closeToast();
      }
    } else {
      animationFrame = requestAnimationFrame(updateTimer);
    }
  };

  const closeToast = () => {
    cancelAnimationFrame(animationFrame);
    toast.classList.add("hide");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  };

  toast.addEventListener("mouseenter", () => {
    paused = true;
  });

  toast.addEventListener("mouseleave", () => {
    paused = false;
    startTime = performance.now() - elapsed;
  });

  closeButton.addEventListener("click", closeToast);

  animationFrame = requestAnimationFrame(updateTimer);
};
