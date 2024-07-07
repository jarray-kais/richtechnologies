import "./Header.css";
import { Link } from "react-router-dom";
import DropdownCategory from "./DropdownCategory";
import { useCart } from "../../Context/CartContext";

const Header = () => {
  const { cart } = useCart();

  return (
    <div className="header">
      <div className="col1">
        <div className="logo">
          <Link to="/">
            <img src="/images/logo.svg" alt="logo"  style={{height : "80px"}}/>
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
          <Link to="/register-seller">Become a Seller</Link>
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
      <div className="col2">
        <DropdownCategory />
        <div className="search-bar">
          <input type="text" placeholder="Search product ..." />
          <img src="/images/search.svg" alt="search" className="search-icon" />
        </div>
        <div className="user-actions">
          <Link to="/signin">Sign In</Link>
          <div className="cart-badge"><Link to="/cart">Cart 🛒 {cart.length > 0 && <span className="badge">{cart.length}</span>}</Link></div>
          
        </div>
      </div>
    </div>
  );
};

export default Header;
