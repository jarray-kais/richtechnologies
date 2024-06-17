import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { signIn } from "../API";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";


const SigningScreen = () => {
  const navigate = useNavigate()
    const [email , setEmail] = useState('')
    const [password, setPassword] = useState('')
    console.log(signIn)
    const mutation = useMutation({ mutationFn: signIn ,
        onSuccess : (data) => {
        Cookies.set('token',  data.token, { expires: 1 } )
        navigate('/')
        } ,
        onError: (error) => {
            console.error('Error:', error.response?.data?.message || error.message);
          },
      
    } )
console.log(mutation)
    const handleSubmit = (e) => {
        e.preventDefault()
        mutation.mutate({email, password})
    }

  return (
    <div>
    <h2>Sign In</h2>
    <div>
      <p>Do not have an account, <Link to={"/register"}> create a new one</Link></p>
    </div>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Signing In...' : 'Sign In'}
      </button>
      {mutation.isError && <p style={{ color: 'red' }}>{mutation.error.message}</p>}
    </form>
  </div>
  )
}

export default SigningScreen