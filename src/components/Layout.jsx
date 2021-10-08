import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";

const Layout = (props) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title}</title>
        <link rel="icon" type="image/svg+xml" href="images/logo.svg" />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/bxslider/4.2.12/jquery.bxslider.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/lightgallery@2.2.0/css/lightgallery-bundle.css"
        />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.1.6/assets/owl.carousel.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.1.6/assets/owl.theme.default.min.css"
        />

        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <Header title={props.title} />
        {props.children}
        <Footer />

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
        <script src="https://cdn.jsdelivr.net/bxslider/4.2.12/jquery.bxslider.min.js"></script>
        <script src="https://unpkg.com/lightgallery@2.2.0/lightgallery.min.js"></script>

        <script src="https://unpkg.com/lightgallery@2.2.0/plugins/thumbnail/lg-thumbnail.min.js"></script>
        <script src="https://unpkg.com/lightgallery@2.2.0/plugins/zoom/lg-zoom.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jQuery.dotdotdot/4.1.0/dotdotdot.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"></script>

        <script src="scripts/index.js"></script>
      </body>
    </html>
  );
};

export default Layout;
