interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResult {
  message: string;
  token: string;
  user: User;
}
