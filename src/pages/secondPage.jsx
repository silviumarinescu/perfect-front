import Layout from "../components/Layout.jsx";
import Gallery from "../components/Gallery/Gallery.jsx";
import data from "../data/data.js";
import carusel from "../data/carusel.js";

const SecondLevel = () => {
  return (
    <Layout title="SecondLevel">
      <div className="container second mt-5">
        <div className="row">
          <div className="col">
            <div>
              the mesage is {data.msg}
              <i className="fas fa-space-shuttle text-secondary"></i>
              <i className="fas fa-space-shuttle text-primaty"></i>
              <i className="fas fa-space-shuttle text-warning"></i>
              <i className="fas fa-space-shuttle text-success"></i>
            </div>
            <ul>
              {data.people.map((person, i) => (
                <li key={i}>{person.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <hr />
      <Gallery items={carusel}>
        <div>click to see</div>
        {carusel
          .filter((it, i) => i < 2)
          .map((item, i) => (
            <span key={i} className="item">
              <img width="100" src={item.image} />
            </span>
          ))}
      </Gallery>
      <hr />
      <Gallery items={carusel}>
        <div>click to see </div>
      </Gallery>
      <hr />
    </Layout>
  );
};

export default SecondLevel;
