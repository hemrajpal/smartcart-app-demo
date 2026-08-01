import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Provider as ReduxProvider } from "react-redux";

import store from "./redux/store";

export function Provider({ children }) {
  return (
    <ReduxProvider store={store}>
      <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
    </ReduxProvider>
  );
}
