import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

//Custom toast styles for reuse
export function toastSuccess(message) {
  toast.success(message, {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    newestOnTop: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: "dark",
  });
}
