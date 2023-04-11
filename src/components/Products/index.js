import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ProductsData } from "../../config";
import { addProduct, addToWishList } from "../../store/cartSlice";
const Products = () => {
  const [list, setList] = useState(ProductsData);
  const dispatch = useDispatch();

  //   useEffect(() => {
  //     apiCall
  //       .get("/products")
  //       .then((res) => {
  //         setList(res.data);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }, []);

  const handleAddToCart = (productItem) => {
    dispatch(addProduct(productItem));
  };
  const handleAddToWishList = (productItem) => {
    dispatch(addToWishList(productItem));
  };

  return (
    <div>
      <h1>Products</h1>
      <section
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {list.map((item, index) => {
          return (
            <div
              key={item.id}
              style={{
                border: "1px solid #cdcdcd",
                margin: 2,
                textAlign: "center",
                padding: 10,
              }}
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <img src={item.image} alt={item.title} />
              <p>₹ {item.price}</p>
              <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
              <button onClick={() => handleAddToWishList(item)}>
                Add to Wishlist
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Products;
