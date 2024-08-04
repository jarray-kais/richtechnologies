import { Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import SigningScreen from "./screens/signingScreen";
import SignupScreen from "./screens/signupScreen";
import TermsScreen from "./screens/TermsScreen";
import PrivacyScreen from "./screens/PrivacyScreen";
import Forgetpassword from "./screens/Forgetpassword";
import ResetPassword from "./screens/ResetPassword";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import SignupSellerScreen from "./screens/SignupSellerScreen";
import ProfileScreen from "./screens/ProfileScreen";
import Auth from "./components/Auth";
import SearchScreen from "./screens/SearchScreen";
import ProductdetailsScreen from "./screens/ProductdetailsScreen";
import CartScreen from "./screens/CartScreen";
import ShippingScreen from "./screens/ShippingScreen";
import MapScreen from "./screens/MapScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import SuccessScreen from "./screens/SuccessScreen";
import FailScreen from "./screens/FailScreen";
import CashPayDelevery from "./screens/CashPayDelevery";



function App() {
  return (
    <div> 
    <Header />
    <main>
    <Routes>
      <Route path={"/"} element=<HomeScreen /> />
      <Route path={"/search"} element=<SearchScreen /> />
      <Route path={"/signin"} element=<SigningScreen /> />
      <Route path={"/register"} element=<SignupScreen /> />
      <Route path={"/cart"} element=<CartScreen /> />
      <Route path={"/shipping"} element=<ShippingScreen /> />
      <Route path={"/payment"} element=<PaymentMethodScreen /> />
      <Route path={"/placeorder"} element=<PlaceOrderScreen /> />
      <Route path={"/order/:id"} element=<OrderScreen /> />
      <Route path={"/success/:id/:payment_id"} element=<SuccessScreen /> />
      <Route path={"/map"} element={<Auth><MapScreen /></Auth>} />
      <Route path={"product/:id"} element=<ProductdetailsScreen /> />
      <Route path={"/profile"} element={<Auth><ProfileScreen/></Auth>} exact/>
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
