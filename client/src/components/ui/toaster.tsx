import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

type VariantType = "default" | "success" | "warn" | "error";

const variantStyles: Record<VariantType, string> = {
  default: "bg-gray-800 text-white",
  success: "bg-[#3be178] text-white",  // rgb(59, 225, 120)
  warn: "bg-[#f3cf61] text-black",     // rgb(243, 207, 97)
  error: "bg-[#dc4343] text-white",    // rgb(220, 67, 67)
};

const timerBarColors: Record<VariantType, string> = {
  default: "bg-white/50",
  success: "bg-green-400",
  warn: "bg-yellow-300",
  error: "bg-red-400",
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant = "default",
        ...props
      }) {
        const bgClass = variantStyles[variant as VariantType] || variantStyles.default;
        const barClass = timerBarColors[variant as VariantType] || timerBarColors.default;

        return (
          <Toast
            key={id}
            {...props}
            className={`relative ${bgClass} border-0 shadow-lg`}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>

            {action}

            <ToastClose className="ml-auto text-sm font-medium underline text-white/80 hover:text-white">
              Cancel
            </ToastClose>

            {/* Timer progress bar */}
            <div className={`absolute bottom-0 left-0 h-1 ${barClass} animate-toast-timer`} />
          </Toast>
        );
      })}
      <ToastViewport className="fixed top-4 right-4 flex flex-col space-y-2 z-[100]" />
    </ToastProvider>
  );
}
