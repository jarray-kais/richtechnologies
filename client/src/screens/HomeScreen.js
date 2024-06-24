import FeaturedProducts from "../components/featuredProduct/FeaturedProducts"
import ImageCarousel from "../components/ImageCarousel/ImageCarousel"


const HomeScreen = () => {
  return (
    <div className="home">
     <ImageCarousel />
     <FeaturedProducts />
    </div>
    
  )
}

export default HomeScreen