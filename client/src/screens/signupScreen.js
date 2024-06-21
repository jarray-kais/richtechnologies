import { useState } from "react"
import { signUp } from "../API"
import { useMutation } from "@tanstack/react-query"
import { Link, useNavigate } from "react-router-dom"

const SignupScreen = () => {
  const navigate = useNavigate()
  const [fileName, setFileName] = useState('');
  const [check , setCheck] = useState(false)
  const [message, setMessage] = useState('')
  const [formData , setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: '',
    country: '',
    profilePicture: null,
  })
  const mutation = useMutation({ mutationFn: signUp ,
    onSuccess: (data) =>{
      console.log(data)
      navigate('/signin')
    } ,
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      setMessage(errorMessage);
    }
  })

  const handleChange = (e) => {
    const {name , value , files} = e.target
    if(name === 'profilePicture'){
      setFormData({
       ...formData,
        profilePicture: files[0]
      })
    }
    else {
      setFormData({
     ...formData,
      [name]: value
    })
  }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if(formData.password !== formData.confirmPassword){
      setMessage('Passwords do not match')
      return
  }
    mutation.mutate(formData)
  }
 

  const handleChangefile = (event) => {
    if (event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    }
  };

  return (
    <div>
     {/* <div className="col1" style={{height : '80px'}}>
        <div className="logo">
          <Link to="/">
            <img src="/images/logo.svg" alt="logo" />
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/track-order">Track Order</Link>
          <Link to="/customer-support">Customer Support</Link>
          <Link to="/need-help">Need Help</Link>
        </div>
        <div className="become-seller">
          <Link to="/become-seller">Become a Seller</Link>
        </div>
        <div className="follow-us">
          <span>Follow us:</span>
          <Link to="https://facebook.com">
            <img src="/images/facebook.svg" alt="facebook" />
          </Link>
          <Link to="https://twitter.com">
            <img src="/images/Twitter.svg" alt="twitter" />
          </Link>
          <Link to="https://instagram.com">
            <img src="/images/instagram.svg" alt="instagram" />
          </Link>
          <Link to="https://youtube.com">
            <img src="/images/youtube.svg" alt="youtube" />
          </Link>
        </div>
      </div> */}
      <div className="signup">
    <h2>signup</h2>
      <div >
    <p style={{fontSize : "16"}}>Already Have An Account,  <Link style={{color : "#2B2B2B"}} to={"/signin"}>Login</Link></p>
    </div>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
          <label>Name:</label>
          <input
         
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>confirmed Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>telephone:</label>
        <input
          type="tel"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>country:</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
      <label>Photo de profil:</label>
      <div className="file-input">
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleChangefile}
          required
          id="file"
          className="file"
        />
        <label htmlFor="file" className="file-label">
          Choisir un fichier
        </label>
        <span className="file-name">{fileName || 'Aucun fichier choisi'}</span>
      </div>
    </div>
  
    <div className="checkbox-container">
      <label className="custom-checkbox">
        <input
          type="checkbox"
          name="termsAccepted"
          checked={check}
          onChange={(e) => setCheck(e.target.checked)}
          required
        />
        <span className="checkmark"></span>
        I have read and agreed to the <Link to="/terms" className="link">Terms of Service</Link> and <Link to="/privacy" className="link">Privacy Policy</Link>
      </label>
    </div>
      <button type="submit" disabled={mutation.isLoading || !check} className="signin-button">
        {mutation.isLoading ? 'Create Account...' : 'Create Account'}
      </button>
      {message && <p style={{ color:'red' }}>{message}</p>}
    </form>
    <div className="signin-with-google signup-with-google">
    <div>
        <div className='horizontal'></div>
          <span>or</span>
          <div className='horizontal'></div>
        </div>
          <button className="google-signin-button">
            <img src="/images/Google.png" alt="Google" /> Login up with Google
          </button>
        </div>
  </div>
  
  </div>
  )
}

export default SignupScreen