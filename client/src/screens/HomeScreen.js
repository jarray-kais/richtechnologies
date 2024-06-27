import Bestdeal from "../components/Best-Deal/Bestdeal"
import FeaturedProducts from "../components/featuredProduct/FeaturedProducts"
import ImageCarousel from "../components/ImageCarousel/ImageCarousel"


const HomeScreen = () => {
  return (
    <div className="home">
     <ImageCarousel />
     <FeaturedProducts />
     <Bestdeal/>
    </div>
    
  )
}

export default HomeScreen