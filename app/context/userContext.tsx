import React from "react";
import { UserContextType, IUser } from "./types";

export const UserContext = React.createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: React.ReactNode;
}

const UserProvider: React.FunctionComponent<UserProviderProps> = ({
  children,
}) => {
  const [User, setUser] = React.useState<IUser>({
    id: "",
    groupId: "",
    isAdmin: false,
  });

  const updateUser = (User: IUser) => {
    setUser(User);
  };
  return (
    <UserContext.Provider value={{ User, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
