import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CarouselImage from "../components/Best-Deal/Carousel";
import { findproduct } from "../API";
import Loading from "../components/Loading/Loading";
import Message from "../components/Message/Message";
import Rating from "../components/featuredProduct/Rating";
import { useContext, useState } from "react";
import { Store } from "../Context/CartContext";

const ProductdetailsScreen = () => {
  const { id } = useParams();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const {
    data: productdetail,
    isLoading: loadingproductdetails,
    error: errorproductdetails,
  } = useQuery({
    queryKey: ["productdetails", id],
    queryFn: () => findproduct(id),
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const imageUrls = productdetail?.image?.map((img) => img.url);

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === productdetail._id);
    const updatedQuantity = existItem ? existItem.quantity + 1 : 1;
    if (productdetail?.countInStock < updatedQuantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...productdetail, quantity: updatedQuantity },
    });
    navigate('/cart');
  };

  return (
    <div className="productscreen">
      {loadingproductdetails ? (
        <Loading />
      ) : errorproductdetails ? (
        <Message variant="danger">{errorproductdetails.message}</Message>
      ) : (
        <>
          <div className="ppp">
            <h2>Product detail</h2>
            <i className="fa fa-angle-right" aria-hidden="true"></i>
          </div>
          <div className="productDetail">
            <div className="caroselimage-productdetail">
              <CarouselImage images={imageUrls} />
            </div>
            <div className="productDetail-right">
              <h2>{productdetail?.name}</h2>
              <div className="row">
                <span className="price">{productdetail?.price} TND</span>
                {productdetail?.promotion?.discountedPrice && (
                  <div className="old-price">
                    <span className="price-section">
                      {productdetail.promotion.discountedPrice} TND
                    </span>
                  </div>
                )}
              </div>
              <Rating
                rating={productdetail?.rating}
                numReviews={productdetail?.numReviews}
              />
              <div>
                {productdetail?.countInStock > 0 ? (
                  <p>
                    Availability: <span style={{ color: "green" }}>InStock</span>
                  </p>
                ) : (
                  <p>
                    Availability: <span style={{ color: "red" }}>Out of Stock</span>
                  </p>
                )}
                <p>Brand: {productdetail?.brand}</p>
                <p>Category: {productdetail?.category.sub}</p>
              </div>
              <div className="horizontal-line"></div>
              <div className="description">
                {productdetail?.description}
              </div>
              <div className="product-actions">
                <div className="quantity-selector">
                  <button
                    className="quantity-button"
                    onClick={() => setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1))}
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button
                    className="quantity-button"
                    onClick={() => setQuantity(prevQuantity => prevQuantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button className="add-to-cart" onClick={addToCartHandler}>
                  Add to Cart <span>&#9654;</span>
                </button>
                <button className="buy-now">Buy Now</button>
                <div className="safe-checkout">
                  <p>100% Guarantee Safe Checkout</p>
                  <div className="payment-icons">
                    <img src="/images/ApplePay.svg" alt="Apple Pay" />
                    <img src="/images/GooglePay.svg" alt="Google Pay" />
                    <img src="/images/Maestro.svg" alt="Maestro" />
                    <img src="/images/Mastercard.svg" alt="Mastercard" />
                    <img src="/images/Paypal.svg" alt="Paypal" />
                    <img src="/images/Stripestripe.svg" alt="Stripe" />
                    <img src="/images/Visa.svg" alt="Visa" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductdetailsScreen;
