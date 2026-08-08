import React from "react";

import AppRoutes from "./routes/AppRoutes";
import { Provider } from "./provider";
import { ToastProvider } from "./components/ToastProvider";

export default function App() {
  return (
    <Provider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </Provider>
  );
}
