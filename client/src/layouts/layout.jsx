
import Navigation from "components/navigation";
import Footer from "components/footer";

import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="main">
      <Navigation />
      {/* <div className="top-effect"></div> */}
      { children }
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;

