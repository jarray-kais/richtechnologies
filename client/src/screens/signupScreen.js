import { useState } from "react"
import { signUp } from "../API"
import { useMutation } from "@tanstack/react-query"
import { Link, useNavigate } from "react-router-dom"

const SignupScreen = () => {
  const navigate = useNavigate()
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

  return (
    <div>
    <h2>signup</h2>

    <h4>Already Have An Account,  <Link to={"/signin"}>Login</Link></h4>
   
    <form onSubmit={handleSubmit}>
    <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>confirmed Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>telephone:</label>
        <input
          type="tel"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>country:</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>photo de profil:</label>
        <input
          type="file"
          name="profilePicture"
           accept="image/*"
          onChange={handleChange}
          required
        />
      </div>
      <div>
          <label>
            <input
              type="checkbox"
              name="termsAccepted"
              checked={check}
              onChange={(e)=>setCheck (e.target.checked)}
              required
            /> 
            I have read and agreed to the <Link to="/terms">Terms</Link> of Service and <Link to="/privacy">  Privacy Policy</Link>
          </label>
        </div>
      <button type="submit" disabled={mutation.isLoading || !check}>
        {mutation.isLoading ? 'Sign Up...' : 'Sign Up'}
      </button>
      {message && <p style={{ color:'red' }}>{message}</p>}
    </form>
  </div>
  )
}

export default SignupScreen