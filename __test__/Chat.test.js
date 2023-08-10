import React from "react";
import renderer from "react-test-renderer";
import { NavigationContainer } from "@react-navigation/native";
import trpc from "../app/server/utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { test, expect } from "@jest/globals";

const mockUser = {
  id: "clkvmcm2h0002uc2w87gax0dl",
  groupId: "clkvmcmu10005uc2wcdti26mu",
  isAdmin: false,
};

const mockUserContextValue = {
  User: mockUser,
  updateUser: jest.fn(),
};

jest.mock("../app/context/userContext", () => ({
  UserContext: {
    Consumer: ({ children }) => children(mockUserContextValue),
  },
}));

import ChatScreen from "../app/screens/chat";

test("renders correctly", () => {
  const queryClient = new QueryClient();
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: "http://192.168.1.144:4000/trpc", // Actualiza la URL según tu configuración
      }),
    ],
  });

  const tree = renderer.create(
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <NavigationContainer>
          <ChatScreen />
        </NavigationContainer>
      </trpc.Provider>
    </QueryClientProvider>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
