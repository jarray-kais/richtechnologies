import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { resetPassword } from "../API";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
    const navigate = useNavigate()
    const {token} = useParams()
    const [password, setPassword] = useState('')
    const [confirmedpassword, setConfirmedPassword] = useState('')
    const [message, setMessage] = useState('')
    const mutation = useMutation({
        mutationFn: resetPassword,
        onSuccess: (data) => {
            setMessage('Password reset successfully');
            navigate('/signin');
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setMessage(errorMessage);
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        if(password !== confirmedpassword){
            setMessage('Passwords do not match')
            return
        }
        mutation.mutate({token , password})
    }
  return (
 
    <div>   
    <h2>forgot Password</h2>
    <p>Create a new password. Ensure it differs from
    previous ones for security</p>
    <form onSubmit={handleSubmit}>
    <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>confirmed Password:</label>
        <input
          type="password"
          name="confirmedPassword"
          value={confirmedpassword}
          onChange={(e)=>setConfirmedPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">update  password</button>
      </form>
      {message && <p style={{ color:'red' }}>{message}</p>}
    </div>
  )
}

export default ResetPassword