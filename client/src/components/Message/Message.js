

import './SuccessMessage.css';

const SuccessMessage = (props ) => {
  return (
    <div className={`alert alert-${props.variant || 'info'}`}>
    {props.children}
  </div>
  );
};

export default SuccessMessage;
