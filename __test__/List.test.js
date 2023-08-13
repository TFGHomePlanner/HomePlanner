import { trpc } from "../app/server/utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { create } from "react-test-renderer";
import CreateListScreen from "../app/screens/lists/createList";
import UserProvider from "../app/context/userContext";

jest.mock("react-native-vector-icons/FontAwesome5", () => ({
  ...jest.requireActual("react-native-vector-icons/FontAwesome5"),
}));

test("Interfaz crear lista de la compra renderizada correctamente", () => {
  const queryClient = new QueryClient();
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: "http://192.168.1.46:4000/trpc",
      }),
    ],
  });

  const list = create(
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <UserProvider>
          <CreateListScreen navigation={{ navigate: jest.fn(() => { }) }} route={{ params: { Edit: false } }} />
        </UserProvider>
      </trpc.Provider>
    </QueryClientProvider>
  )
    .toJSON();
  expect(list).toMatchSnapshot();
});