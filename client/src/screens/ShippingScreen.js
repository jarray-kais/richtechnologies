import { useState } from 'react';
import BackButton from '../components/BackButton/BackButton';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Context/CartContext';
import CheckoutSteps from '../components/Chekout/CheckoutSteps';

const ShippingAddressScreen = () => {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
   
  };

  return (
    <div className="shipping-container">
    
    <div className='shipping-body'>
    <BackButton />
      <h1 className="shipping-title">Shipping Address</h1>
      <p className="shipping-description">Please enter your shipping details.</p>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label className="form-label">Information</label>
          <input
            type="text"
            className="form-control"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <button className="location-btn">choose Location</button>
        </div>
        <div className="form-group">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            placeholder="Your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control"
            placeholder="Your country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control"
            placeholder="Your postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="continue-btn">continue</button>
      </form>
      </div>
    </div>
  );
};

export default ShippingAddressScreen;
