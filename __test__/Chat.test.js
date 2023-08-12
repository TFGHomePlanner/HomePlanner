import React from "react";
import renderer from "react-test-renderer";
import { NavigationContainer } from "@react-navigation/native";
import trpc from "../app/server/utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { test, expect } from "@jest/globals";
import LoginScreen from "../app/screens/login";



test("renders correctly", () => {
  const tree = renderer.create(
    <LoginScreen />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
