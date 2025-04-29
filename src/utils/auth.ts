// Save token
export const saveToken = (token: string) => {
    localStorage.setItem('token', token);
  };
  
  // Get token
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Remove token
  export const clearToken = () => {
    localStorage.removeItem('token');
  };
  
  // Check if user is logged in
  export const isAuthenticated = () => {
    return !!getToken();
  };
  