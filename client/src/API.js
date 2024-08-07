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
    console.log(formData)
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
//route product by id --------------------------------
export const findproduct = async (id) => {
  try {
    const response = await axios.get(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error); 
    throw error;
  }
};
//Route Brand ------------------------------------------------------------
export const fetchbrand = async(category)=>{
  const encodecategory = encodeURIComponent(category)
  console.log(encodecategory)
  const response = await axios.get(`/api/products/brand?mainCategory=${encodecategory}`)
  return response.data;
}

//Route edit Profile
export const editProfile = async(user)=>{
  const response = await axios.put('/api/users/profile',user)
    return response.data
}


//Route get featured products --------------------------------

export const featuredproduct = async(page , limit)=>{
  const response = await axios.get(`/api/products/featured?page=${page}&limit=${limit}`)
 
  return response.data;
 
}

//Route get deal products --------------------------------
export const getdeals = async(page , limit)=>{
  const response = await axios.get(`/api/products/deal?page=${page}&limit=${limit}`)
 
  return response.data;
}
export const getdeal5stars = async(page , limit)=>{
  const response = await axios.get(`/api/products/deal5stars?page=${page}&limit=${limit}`)
  return response.data;
}

//route shop with category --------------------------------
export const shop = async()=>{
  const response = await axios.get('/api/products/maincategories')
  return response.data;
}

//route accessoires --------------------------------
export const accessoires = async( mainCategory , subCategory)=>{
  const response =await axios.get(`/api/products/main/${mainCategory}/${subCategory}`)
  return response.data
}


//Route search --------------------------------

export const search = async(query , page )=>{
  const url= decodeURIComponent(query).toLocaleLowerCase();

  const response = await axios.get(`/api/products/search?query=${url}&page=${page}`)
  return response.data
}

//Route suggestions --------------------------------

export const suggestions = async(query )=>{
  const response = await axios.get(`/api/products/suggest?query=${query}`)
  return response.data
}


//Route post review --------------------------------
export const postReview = async({review , id })=>{
  const response = await axios.post(`/api/products/${id}/review`,review)
  return response.data
}
//Route Similar Product --------------------------------

export const similarProduct = async(id )=>{
  const response = await axios.get(`/api/products/${id}/similar`)
  return response.data
}

//Route google api --------------------------------
export const google = async()=>{
  const response = await axios.get("/api/config/google")
  return response.data
  
}

//Route post placeOrder --------------------------------

export const placeOrder = async(orders)=>{
  const response = await axios.post(`/api/orders/`,orders)
  return response.data
}

////Route find order --------------------------------

export const findOrder = async(id)=>{
  const response = await axios.get(`/api/orders/${id}`)
  return response.data
}
//Route payment Floucy --------------------------------
export const initiatePayment = async ({id, totalPrice}) => {

 
  const response = await axios.post(`/api/payment/${id}`,{totalPrice} );
  return response.data;
};

//Route verify payment flouci --------------------------------
export const verifyPayment = async({id , payment_id})=>{
  const response = await axios.post(`/api/verify/${id}/${payment_id}`)
  return response.data;
}

//Route post cash payment --------------------------------

export const sendcashPayment = async(id)=>{
  const response = await axios.post(`/api/orders/${id}/cashpay`)
  return response.data;
}


//Route cash payment --------------------------------
export const cashPayment = async(id)=>{
  console.log(id)
  const response = await axios.get(`/api/orders/${id}/cashpay`)
  return response.data;
}
