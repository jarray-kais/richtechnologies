import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "./FeaturedProducts.css"; // Your custom styles
import { useQuery } from "@tanstack/react-query";
import { featuredproduct } from "../../API";
import Product from "./Product";

const FeaturedProducts = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["featured"],
    queryFn: featuredproduct,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 100000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="featured">
      <div className="featured-title">
        <h2>Featured Products</h2>
      </div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={6}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: true  }}
      >
        {data.map((product) => (
          <SwiperSlide >
            <Product key={product._id} product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedProducts;
