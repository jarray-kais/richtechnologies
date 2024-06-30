import Bestdeal from "../components/Best-Deal/Bestdeal";
import FeaturedProducts from "../components/featuredProduct/FeaturedProducts";
import ImageCarousel from "../components/ImageCarousel/ImageCarousel";

const HomeScreen = () => {
  return (
    <div className="home">
      <ImageCarousel />
      <FeaturedProducts />
      <Bestdeal />
      <div className="Xiaomi">
        <div className="left">
          <div className="left_left">
            <h4 className="introducing">INTRODUCING</h4>
            <div className="name">
              <p>New Apple Homepod Mini</p>
            </div>
            <div>
              <p>
                Jam-packed with innovation, HomePod mini delivers unexpectedly.
              </p>
            </div>
            <button className="add-to-card-button">Shop Now</button>
          </div>
          <div>
            <img src="/images/apple.svg" alt="" />
          </div>
        </div>
        <div className="right">
          <div className="right-left">
            <h4 className="introducing-right">INTRODUCING New</h4>
            <div className="name-right">
              <p>New Apple Homepod Mini</p>
            </div>
            <div style={{ color: "#ADB7BC" }}>
              <p>
                Jam-packed with innovation, HomePod mini delivers unexpectedly.
              </p>
            </div>
            <button className="add-to-card-button">Shop Now</button>
          </div>
          <div className="right-right">
          <div className="prix">590 TND</div>
          <div className="image-right">
            <img src="/images/telephone.svg" alt="" />
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
