
// TODO: change to absolute path
import Footer from "components/footer";
import Navigation from "components/navigation";
import Home from "pages/home";

function App() {
  return (
    <div className="main">
      <Navigation />
      {/* <div className="top-effect"></div> */}
      {/* vyřešit přes router */}
      <Home />
      {/* <Footer /> */}
    </div>
  );
};

export default App;
