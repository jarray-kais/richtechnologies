import FeaturedProducts from "../components/FeaturedProducts"
import ImageCarousel from "../components/ImageCarousel"


const HomeScreen = () => {
  return (
    <div className="home">
     <ImageCarousel />
     <FeaturedProducts />
    </div>
    
  )
}

export default HomeScreen