export const handleLogin = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token } = response.data;
    
    // Store the token
    localStorage.setItem('token', token);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};