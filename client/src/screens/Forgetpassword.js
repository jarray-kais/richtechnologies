import { useState } from "react";
import { forgetPassword } from "../API";
import { useMutation } from "@tanstack/react-query";

const Forgetpassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const mutation = useMutation({
    mutationFn: forgetPassword,
    onSuccess: (data) => {
      console.log(data);
      alert("Email sent successfully");
      setEmail("");
    },
    onError: (error) => {
        const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      setMessage(errorMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email });
  };
  return (
    <div>
      <h2>forgot Password</h2>
      <p>Please enter your email to reset the password</p>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <button>Reset password</button>
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      
    </div>
  );
};

export default Forgetpassword;
