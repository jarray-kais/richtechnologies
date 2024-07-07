import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
        const existingItemIndex = state.findIndex(item => item.id === action.payload.id);
        if (existingItemIndex > -1) {
          const updatedCart = state.map((item, index) =>
            index === existingItemIndex ? { ...item, quantity: item.quantity + action.payload.quantity } : item
          );
          return updatedCart;
        }
        return [...state, { ...action.payload, quantity: action.payload.quantity || 1 }];
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.payload.id);
      case 'UPDATE_QUANTITY':
        return state.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        );
    case 'SET_CART':
      return action.payload;
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    const localData = localStorage.getItem('cart');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = item => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = id => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
  };
  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const setCart = cartItems => {
    dispatch({ type: 'SET_CART', payload: cartItems });
  };


  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart , updateQuantity , setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
