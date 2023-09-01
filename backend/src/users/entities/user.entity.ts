export class User {
  _id: string;
  login: string;
  email: string;
  name: string;
  password: string;
  applications: Array<{ login: string; _id: string }>;
  friends: Array<{ login: string; _id: string }>;
}
