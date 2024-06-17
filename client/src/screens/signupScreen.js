import { useState } from "react"
import { signUp } from "../API"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

const SignupScreen = () => {
  const navigate = useNavigate()
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
      console.error('Error:', error.response?.data?.message || error.message);
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
    mutation.mutate(formData)
  }

  return (
    <div>
    <h2>signup</h2>
   
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
      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Sign Up...' : 'Sign Up'}
      </button>
      {mutation.isError && <p style={{ color: 'red' }}>{mutation.error.message}</p>}
    </form>
  </div>
  )
}

export default SignupScreen