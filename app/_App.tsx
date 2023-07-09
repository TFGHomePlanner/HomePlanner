import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import React from "react";
import { trpc } from "./server/utils/trpc";
import { httpBatchLink } from "@trpc/client";
import LoginScreen from "./screens/login";
import { registerRootComponent } from "expo";

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "exp://192.168.1.12:19000/trpc",
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <LoginScreen />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

registerRootComponent(App);
