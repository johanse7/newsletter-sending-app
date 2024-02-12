export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  password: string;
};

export type Recipient = {
  id: string;
  name: string;
  email: string;
};

export type UserSession = {
  user: { name: string; email: string };
  expires: string;
  id: string;
  isAdmin: boolean;
};

export type UserSelectType = Omit<User, 'password'>;

export type NewslatterPayload = {
  title: string;
  file: File;
  userId: string;
  recipientIds: Array<string>;
};

export type NewslatterType = {
  id: string;
  title: string;
  file: any;
  recipients?: Array<Recipient>;
  createdname?: string;
};
