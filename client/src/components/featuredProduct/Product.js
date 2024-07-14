import Rating from "./Rating";
import { Link } from "react-router-dom";

const Product = (props) => {
  const { product } = props;
  console.log(product);

  return (
    <div className="card" key={product._id}>
      <Link to={`/product/${product._id}`}>
        <img className="image" src={product.image[0].url} alt={product.name} />
      </Link>
      <div className="card-body">
        <Rating rating={product.rating} numReviews={product.numReviews} />

        <Link to={`/product/${product._id}`}>
          <h2 id="cardbody">{product.name}</h2>
        </Link>

        <div className="row">
        <span className="price">{product.price} TND</span>
          <div className="old-price ">
          
            {product.promotion && product.promotion.discountedPrice ? (
              <span className="price-section ">
                {product.promotion.discountedPrice} TND
              </span>
            ) : null}

            
          </div>
        </div>
      </div>
      <div className="seller">
        {product.seller && product.seller.name ? (
          <Link to={`/seller/${product.seller._id}`}>
            {product.seller.name}
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default Product;
