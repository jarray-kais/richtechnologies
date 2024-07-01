import { Link } from "react-router-dom";

const Category = ({ product }) => {
  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
  }
  const slugifiedCategory = slugify(product);

  console.log(product);
  return (
    <div className="maincategory">
      <Link to={`/search?query=${product}`}>
        <img
          id="image-category"
          src={`/images/${slugifiedCategory}.svg`}
          alt={product}
        />
      </Link>
      <div className="name-catgory">
      <Link to={`/search?query=${product}`}>
        <h3>{product}</h3>
      </Link>
      </div>
    </div>
  );
};

export default Category;
