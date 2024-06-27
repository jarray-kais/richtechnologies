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
        <div className="price-section">
        {product.oldPrice ?( 
        <span className="old-price">${product.oldPrice}</span>)
         : null}
            
            <span className="price">${product.price}</span>
          </div>
          </div>
          </div>
           <div className="seller">
           {product.seller&&product.seller.seller && product.seller.seller.nameBrand  ? (
              <Link to={`/seller/${product.seller._id}`}>{!product.seller.seller.nameBrand}</Link>
            ) :null}
            
           </div>
        
      
    </div>
  );
};

export default Product;