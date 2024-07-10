import { useContext } from 'react';
import Message from "../components/Message/Message";
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Context/CartContext';
import { findproduct } from '../API';
import { useQuery } from '@tanstack/react-query';

const CartScreen = () => {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
      cart: { cartItems },
    } = state;

    const UpdateCartHandler = async (item, quantity) => {
        const {
            data: productdetail,
            isLoading: loadingproductdetails,
            error: errorproductdetails,
          } = useQuery({
            queryKey: ["productdetails", item._id],
            queryFn: () => findproduct(item._id),
            refetchOnWindowFocus: false,
            retry: 2,
          });
        if (productdetail.countInStock < quantity) {
          window.alert('Sorry. Product is out of stock');
          return;
        }
        ctxDispatch({
          type: 'CART_ADD_ITEM',
          payload: { ...item, quantity },
        });
      };
      const removeItemHandler = (item) => {
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
      };
    
      const checkoutHandler = () => {
        navigate('/signin?redirect=/shipping');
      };
  return (
    <div className='cart'>
    
    <div className='cart-left'>
        <h1>Shopping Cart</h1>
    </div>
        {cartItems.length === 0 ? (
            <Message>
              Cart Is Empty <Link to="/">Go Shopping</Link>
            </Message>
          ):(
            <>
            <div className='List-group'>
                {cartItems.map((item) => (
                  <div key={item._id} className='list-group-item d-flex justify-content-between'>
                    <div>
                      <img src={item.image[0].url} alt={item.name} className='img-fluid rounded-start' />
                      <h3>{item.name}</h3>
                    </div>
                    <div>
                      <select>
                      <button onClick={() =>
                          UpdateCartHandler(item, item.quantity - 1)
                        } variant="light" disabled={item.quantity === 1}>
                        <i className="fas fa-minus-circle"></i>
                      </button>{" "}
                      <span>{item.quantity}</span>{" "}
                      <button
                      onClick={() =>
                        UpdateCartHandler(item, item.quantity + 1)
                        }
                        variant="light"
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </button>
                      </select>
                      <button
                        className='btn btn-danger btn-sm'
                        onClick={() => removeItemHandler(item)}>
                        <i className="fas fa-trash"></i>
                        </button>
                    </div> 
              </div> 
              ))}
               
            </div>
            </>
          )}
    <div className='cart-right'></div>

                
                    <div>
                        <h3>Subtotal: {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)} TND</h3>
                        <button className='btn btn-primary' onClick={checkoutHandler}>Checkout</button>
                    </div>
                    
                    <div>
                        <Link to='/'>Continue Shopping</Link>
                    </div>
                    
                    <div>
                        <h3>Estimated shipping: {cartItems.reduce((a, c) => a + c.price * c.quantity, 0) > 1000? 'Free' : '20 TND'}</h3>
                    </div>
                    
                    <div>
                        <h3>Total: {cartItems.reduce((a, c) => a + c.price * c.quantity, 0) + (cartItems.reduce((a, c) => a + c.
                        price * c.quantity, 0) > 1000? 0 : 20)} TND</h3>                                  
                        </div>
            

    </div>
  )
}

export default CartScreen