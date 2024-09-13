export type UserType = {
  id: string;
  username: string;
  email: string;
};

export type GetUsersResponseType = {
  users: UserType[];
};
