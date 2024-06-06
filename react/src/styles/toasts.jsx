import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

//Custom global toast styles
const defaultDark = {
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
};

export function toastSuccess(message) {
  toast.success(message, defaultDark);
}

export function toastError(message) {
  toast.error(message, defaultDark);
}
