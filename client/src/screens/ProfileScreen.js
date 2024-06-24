import BackButton from "../components/BackButton"

const ProfileScreen = () => {
  return (
    <div className="signup">
    <BackButton />
    <h2>Profile Information</h2>
   <form >
   <div className="flexProfile">
   <div className="form-group form-input">
          <input
            type="text"
            name="name"
            placeholder="name ..."
            required
          />
        </div>
        <div className="form-group form-input">
          <input
            type="email"
            name="email"
           placeholder="Email ..."
            required
          />
        </div>
        </div>
        <div className="change">
          <h4>Change Password</h4>
        </div>
        <div className="flexProfile">
        <div className="form-group form-input">
        <input
          type="password"
          name="password"
          placeholder="********"
          required
        />
        </div>
        <div className="form-group form-input"></div>
        </div>
   </form>
      
    </div>
  )
}

export default ProfileScreen