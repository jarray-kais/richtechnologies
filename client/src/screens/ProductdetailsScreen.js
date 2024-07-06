import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CarouselImage from "../components/Best-Deal/Carousel";

import { findproduct } from "../API";
import Loading from "../components/Loading/Loading";
import Message from "../components/Message/Message";

const ProductdetailsScreen = () => {
  const { id } = useParams();

  const {
   
    data: productdetail,
    isLoading: loadingproductdetails,
    error: errorproductdetails,
  } = useQuery({
    queryKey :['productdetails',id],
    queryFn : () => findproduct(id),
    refetchOnWindowFocus: false,
   retry : 2,
   
    
  });

  if (loadingproductdetails) {
    return <Loading />;
  }

  if (errorproductdetails) {
    return <Message variant="danger">{errorproductdetails?.message}</Message>;
  }
   
  const imageUrls = productdetail?.image?.map((img) => img.url);
  console.log('Image URLs:', imageUrls);

  return (
    <div>
      <div>
        <h6>Product detail</h6>
      </div>
      <div className="productDetail">
        <div>
            <CarouselImage images={imageUrls} />
       
        </div>
        <div></div>
      </div>
    </div>
  );
};


export default ProductdetailsScreen