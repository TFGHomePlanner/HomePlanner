export interface IUser {
  id: string;
  groupId: string;
  isAdmin: boolean;
}
export type UserContextType = {
  User: IUser;
  updateUser: (User: IUser) => void;
};
