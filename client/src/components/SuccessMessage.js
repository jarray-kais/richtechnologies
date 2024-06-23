

import './SuccessMessage.css';

const SuccessMessage = ({ message }) => {
  return (
    <div className="success-message">
      <img src="/images/Vector.svg" alt="Success Icon" className="success-icon" />
      <span>{message}</span>
    </div>
  );
};

export default SuccessMessage;
