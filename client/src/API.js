import axios from 'axios';

export const signIn = async (credentials) => {
    const response = await axios.post('/api/users/signin' , credentials);
   return response.data
  };

  export const signUp = async (userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });
    
    const response = await axios.post('/api/users/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };