import { createContext, useContext, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = ({ title, description, type = "info" }) => {
    setToast({
      title,
      description,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div
          style={{
            position: "fixed",

            bottom: "20px",

            right: "20px",

            padding: "16px",

            borderRadius: "8px",

            color: "#fff",

            minWidth: "280px",

            background:
              toast.type === "success"
                ? "#38A169"
                : toast.type === "error"
                ? "#E53E3E"
                : "#3182CE",

            boxShadow: "0 4px 12px rgba(0,0,0,.2)",

            zIndex: 9999,
          }}
        >
          <strong>{toast.title}</strong>

          <div>{toast.description}</div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
