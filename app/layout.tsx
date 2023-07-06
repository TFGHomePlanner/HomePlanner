import React from "react";
import LoginScreen from "./screens/login";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "login",
};

export default function RootLayoutNav() {
  return (
    <>
      <LoginScreen />
    </>
  );
}
