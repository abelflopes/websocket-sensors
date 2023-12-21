import "./styles/index.scss";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { Provider } from "react-redux";
import { Store } from "@store/index";
import { PersistGate } from "redux-persist/integration/react";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <PersistGate persistor={Store.persistor}>
      <Provider store={Store.store}>
        <App />
      </Provider>
    </PersistGate>
  </React.StrictMode>,
);
