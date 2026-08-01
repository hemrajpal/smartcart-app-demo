import React from "react";

import AppRoutes from "./routes/AppRoutes";
import { Provider } from "./provider";

export default function App() {
  return (
    <Provider>
      <AppRoutes />
    </Provider>
  );
}