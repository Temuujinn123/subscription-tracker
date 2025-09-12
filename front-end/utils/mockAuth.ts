// Mock authentication utilities
export const mockAuth = {
  login: (email: string, password: string): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === "user@example.com" && password === "password") {
          const user: User = {
            id: 1,
            email: email,
            name: "John Doe",
          };
          localStorage.setItem("user", JSON.stringify(user));
          resolve(user);
        } else {
          resolve(null);
        }
      }, 1000);
    });
  },

  register: (email: string, password: string, name: string): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: Date.now(),
          email,
          name,
        };
        localStorage.setItem("user", JSON.stringify(user));
        resolve(user);
      }, 1000);
    });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("subscriptions");
  },

  getCurrentUser: (): User | null => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },
};
