export interface IUser {
  id: string;
  groupId?: string;
}
export type UserContextType = {
  User: IUser;
  updateUser: (User: IUser) => void;
};
