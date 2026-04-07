import toast from "react-hot-toast";

type toastProp = {
  type: "ERROR" | "SUCCESS" | "LOADING";
  msg: string;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
};

export const showToast = ({ type, msg, position }: toastProp) => {
  switch (type) {
    case "SUCCESS":
      toast.success(msg, {
        id: msg,
        position: position ?? "top-center",
      });
      break;

    case "ERROR":
      toast.error(msg, {
        id: msg,
        position: position ?? "top-center",
      });
      break;

    case "LOADING":
      toast.loading(msg, {
        id: msg,
        position: position ?? "top-center",
      });
      break;

    default:
      return;
  }
};
