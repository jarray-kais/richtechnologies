import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { signIn } from "../API";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Footer from "../components/Footer";



const SigningScreen = () => {
  const navigate = useNavigate()
    const [email , setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('');
    const mutation = useMutation({ mutationFn: signIn ,
    
        onSuccess : (data) => {
        Cookies.set('token',  data.token, { expires: 1 } )
        navigate('/')
        } ,
        onError: (error) => {
          const errorMessage = error.response?.data?.message || error.message || "An error occurred";
          setMessage(errorMessage);
          },
      
    } )
console.log(mutation)
    const handleSubmit = (e) => {
        e.preventDefault()
        mutation.mutate({email, password})
    }

  return (
    <div>
    <div className="col1" style={{height : '80px'}}>
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
      </div>
      <div className="signin-container">
      <div className="signin-left">
        <h2>Sign In</h2>
        <div>
          <p>
            Do not have an account, <Link to="/register" style={{color : "#2B2B2B"}}>create a new one</Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="michael.joe@xmail.com"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="*****"
            />
          </div>
          <button type="submit" disabled={mutation.isLoading} className="signin-button">
            {mutation.isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        {message && <p className="error-message">{message}</p>}
        <div className="center">
        <div>
          <Link to="/forget-password">Forgot Your Password</Link>
        </div>
        <div className="signin-with-google">
          <span>or</span>
          <button className="google-signin-button">
            <img src="/images/Google.png" alt="Google" /> Login up with Google
          </button>
        </div>
        </div>
      </div>
      <div >
        <img src="/images/signin.jpg" alt="Sign In" className="signin-right"/>
      </div>
    </div>^
    <Footer />
  </div>
  )
}

export default SigningScreen