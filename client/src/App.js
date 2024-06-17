import { Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import SigningScreen from "./screens/signingScreen";
import SignupScreen from "./screens/signupScreen";


function App() {
  return (
    <div> 
    <Routes>
      <Route path={"/"} element=<HomeScreen /> />
      <Route path={"/signin"} element=<SigningScreen /> />
      <Route path={"/register"} element=<SignupScreen /> />
    </Routes>
      
    </div>
  );
}

export default App;
