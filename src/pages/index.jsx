import Layout from "../components/Layout.jsx";
import Rating from "../components/Rating/Rating.jsx";
import carusel from "../data/carusel.js";

const Homepage = () => {
  return (
    <Layout title="Homepage">
      <div className="container home mt-5">
        <div className="row">
          <div className="col">
            <div className="bxslider">
              {carusel.map((item,i) => (
                <div key={i} className="item">
                  <img src={item.image} />
                </div>
              ))}
            </div>
          </div>
          <div className="col">
            <div className="d-flex justify-content-end">
              <Rating score="10" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Homepage;
