import { toast } from "react-toastify";
import { notificationStrings } from "../components/mainPage.tsx";

export const errorToast = (e) => {
  toast.error(e, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    rtl: false,
    draggable: true,
  });
  notificationStrings.unshift({ type: "error", message: e });
  if (notificationStrings.length >= 6) {
    notificationStrings.pop();
  }
};

export const successfulToast = (message = "File uploaded") => {
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    rtl: false,
    draggable: true,
  });
  notificationStrings.unshift({ type: "successful", message: message });
  if (notificationStrings.length >= 6) {
    notificationStrings.pop();
  }
};
