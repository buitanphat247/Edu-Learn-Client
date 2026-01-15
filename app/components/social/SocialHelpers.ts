import Swal from "sweetalert2";

interface ConfirmActionOptions {
  title: string;
  html: string;
  confirmButtonText: string;
  onConfirm: () => void;
  icon?: "warning" | "error" | "success" | "info" | "question";
}

export const showConfirmModal = ({
  title,
  html,
  confirmButtonText,
  onConfirm,
  icon = "warning",
}: ConfirmActionOptions) => {
  Swal.fire({
    title,
    html,
    icon,
    background: "#1e293b",
    color: "#fff",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#334155",
    confirmButtonText,
    cancelButtonText: "Hủy",
    focusCancel: true,
    customClass: {
      popup: "rounded-2xl border border-slate-700 shadow-xl",
      title: "text-xl font-bold text-white",
      confirmButton: "rounded-xl px-6 py-2.5 font-medium shadow-lg shadow-red-600/20 text-sm",
      cancelButton: "rounded-xl px-6 py-2.5 font-medium hover:bg-slate-600 text-white text-sm",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};
