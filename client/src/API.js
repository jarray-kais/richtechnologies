import axios from 'axios';

export const signIn = async (credentials) => {
    const response = await axios.post('/api/users/signin' , credentials);
   return response.data
  };
//Route signup user --------------------------------
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
  //Route signup seller --------------------------------
  export const sellerSignup = async (userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });
    
   
  const response = await axios.post('/api/users/sellerSignup', formData)
    return response.data;
  }

  //Route authorization----------------------------------------------------------------
  export const auth = async()=>{
  const response = await axios.get('/api/check-auth',{ withCredentials: true })
  return response.data;
  }
  //Route authorization admin----------------------------------------------------------------
    export const admin = async()=>{
    const response = await axios.get('/api/check-admin',{ withCredentials: true })
    return response.data;
    }
  //Route authorization sellerOrAdmin----------------------------------------------------------------
  export const sellerOrAdmin = async()=>{
    const response = await axios.get('/api/check-selleOradmin',{ withCredentials: true })
    return response.data;
    }
  //Route forget password --------------------------------
  export const forgetPassword = async(email)=>{
    const response = await axios.post('/api/users/forget-password',email ,
       {headers: {
        'Content-Type': 'application/json'
      }});
    return response.data;
  }
  //Route Reset Password----------------------------------------------------------------
  export const resetPassword = async({password,token})=>{
    const response = await axios.post('/api/users/reset-password',{password,token} , 
      {headers: {
        'Content-Type': 'application/json',
        'token' : token
      }})
    
    return response.data;
  }
// Route category-------------------------------------------------------------------------
export const maincategory = async(category)=>{
  const response = await axios.get('/api/products/maincategories',{category})
  return response.data;
}

//Route Brand ------------------------------------------------------------
export const fetchbrand = async(category)=>{
  const response = await axios.get(`/api/products/brand/${category}`)
  return response.data;
}

//Route edit Profile
export const editProfile = async(user)=>{
  const response = await axios.put('/api/users/profile',user)
    return response.data
}
