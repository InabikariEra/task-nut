import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose: () => void;
}

const styles = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
};

export default function Toast({ message, type = "info", onClose }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(timer);
  }, [onClose]);
  return (
    <div
      className={`fixed bottom-5 right-5 z-[60] flex max-w-sm items-start gap-3 border px-4 py-3 text-sm shadow-lg animate-[toast-in_200ms_ease-out] ${styles[type]}`}
      role="status"
    >
      <span className="mt-0.5 font-bold" aria-hidden="true">
        {type === "success"
          ? "✓"
          : type === "error"
            ? "!"
            : type === "warning"
              ? "!"
              : "i"}
      </span>
      <p className="flex-1 leading-6">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="font-semibold opacity-70 hover:opacity-100"
        aria-label="ปิดการแจ้งเตือน"
      >
        ×
      </button>
    </div>
  );
}
