export type Student = {
    id: number;
    name: string;
    email: string;
    branch: string;
    is_enabled: boolean;
    has_submitted: boolean;
  };
  
  export type NewStudent = {
    name: string;
    email: string;
    password: string;
    branchId: string;
  };
  