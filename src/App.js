import logo from "./logo.svg";
import "./App.css";
import CartList from "./components/cartList.js";
import Products from "./components/Products";
import WishList from "./components/wishList";

function App() {
  return (
    <div className="App">
      <CartList />
      <Products />
      {/* wishList add seperate route */}
      <WishList />
    </div>
  );
}

export default App;
