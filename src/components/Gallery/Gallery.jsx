const Gallery = (props) => {
  return (
    <div className="gallery">
      {props.children}
      <div className="items d-none">
        {props.items.map((item, i) => (
          <div key={i} data-src={item.image} data-title={item.title} className="item"></div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;