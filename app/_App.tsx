import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import React from "react";
import { trpc } from "./server/utils/trpc";
import { httpBatchLink } from "@trpc/client";
import RootLayout from "./layout";

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "exp://192.168.1.12:19000/trpc"
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RootLayout />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
