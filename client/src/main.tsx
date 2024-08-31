import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import React, { useCallback } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setup } from "./dojo/setup.ts";
import { DojoProvider } from "./dojo/DojoContext.tsx";
import { dojoConfig } from "../dojoConfig.ts";
import Landing from "./pages/Landing.tsx";
import Mine from "./pages/Mine.tsx";
import { StarknetConfig, jsonRpcProvider } from "@starknet-react/core";
import { Chain, sepolia } from "@starknet-react/chains";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { getConnectors } from "@/hooks/connectors.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/app",
    element: <App />,
  },
]);

const { connectors } = getConnectors();

async function init() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("React root not found");
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  const setupResult = await setup(dojoConfig);

  !setupResult && <div>Loading....</div>;

  const rpc = (_chain: Chain) => {
    return { nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL };
  };

  root.render(
    <React.StrictMode>
      <StarknetConfig
        chains={[sepolia]}
        provider={jsonRpcProvider({ rpc })}
        connectors={connectors}
        autoConnect
      >
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <DojoProvider value={setupResult}>
            <RouterProvider router={router} />
            <Toaster />
          </DojoProvider>
        </ThemeProvider>
      </StarknetConfig>
    </React.StrictMode>
  );
}

init();
