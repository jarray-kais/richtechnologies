import { Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import SigningScreen from "./screens/signingScreen";
import SignupScreen from "./screens/signupScreen";
import TermsScreen from "./screens/TermsScreen";
import PrivacyScreen from "./screens/PrivacyScreen";
import Forgetpassword from "./screens/Forgetpassword";
import ResetPassword from "./screens/ResetPassword";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SignupSellerScreen from "./screens/SignupSellerScreen";


function App() {
  return (
    <div> 
    <Header />
    <main>
    <Routes>
      <Route path={"/"} element=<HomeScreen /> />
      <Route path={"/signin"} element=<SigningScreen /> />
      <Route path={"/register"} element=<SignupScreen /> />
      <Route path={"/register-seller"} element=<SignupSellerScreen /> />
      <Route path={"/terms"} element=<TermsScreen /> />
      <Route path={"/privacy"} element=<PrivacyScreen /> />
      <Route path={"/forget-password"} element=<Forgetpassword /> />
      <Route path={"/reset-password/:token"} element=<ResetPassword /> />

    </Routes>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
