

import './SuccessMessage.css';

const Message = (props ) => {
  return (
    <div className={`alert alert-${props.variant || 'info'}`}>
    {props.children}
  </div>
  );
};

export default Message;
