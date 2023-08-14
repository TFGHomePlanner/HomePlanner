import { trpc } from "../app/server/utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { create } from "react-test-renderer";
import LoginScreen from "../app/screens/login";
import UserProvider from "../app/context/userContext";

test("renders correctly", () => {
  const queryClient = new QueryClient();
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: "http://192.168.1.38:4000/trpc",
      }),
    ],
  });

  const tree = create(
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <UserProvider>
          <LoginScreen />
        </UserProvider>
      </trpc.Provider>
    </QueryClientProvider>
  )
    .toJSON();
  expect(tree).toMatchSnapshot();
});