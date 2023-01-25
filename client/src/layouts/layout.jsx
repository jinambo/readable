
import { useState, useEffect } from "react";
import Navigation from "components/navigation";
import Footer from "components/footer";
import Cart from "components/cart";

const Layout = ({ children }) => {
  const [cartOpened, setCartOpened] = useState(false);

  return (
    <div className="main">
      <Navigation
        setCartOpened={ setCartOpened }
      />
      { cartOpened &&
        <Cart
          setCartOpened={ setCartOpened }
        />
      }
      {/* <div className="top-effect"></div> */}
      { children }
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;

