import React from "react";

const UserContext = React.createContext();

export const ProviderUser = UserContext.Provider;
export const ConsumerUser = UserContext.Consumer;

export default UserContext;