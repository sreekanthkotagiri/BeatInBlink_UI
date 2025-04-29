
export type User = {
    token: string;
    refreshToken: string;
    user: {
      id: number;
      name: string;
      email: string;
      institute_name: string;
      role: "student"; // or you can use string if it's not always "student"
    };
  };