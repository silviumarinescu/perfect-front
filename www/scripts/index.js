window.onload = () => {
  $(".bxslider").each((i, el) => {
    $(el).bxSlider({
      auto: true,
      autoControls: true,
      stopAutoOnClick: true,
      pager: true,
      slideWidth: 600,
    });
  })  

  window.galleies = [];
  $(".gallery").each((i, el) => {
    $(el).attr("data-gal", i);
    window.galleies.push(
      lightGallery(el, {
        dynamic: true,
        plugins: [lgZoom, lgThumbnail],
        dynamicEl: $(el)
          .find(".items .item")
          .toArray()
          .map((it) => ({
            src: $(it).attr("data-src"),
            thumb: $(it).attr("data-src"),
            subHtml: `<h4>${$(it).attr("data-title")}</h4>`,
          })),
      })
    );
  });
  $(".gallery").on("click", function () {
    window.galleies[parseInt($(this).attr("data-gal"))].openGallery(0);
  });

  $(".truncate").each((i, el) => {
    new Dotdotdot(el, {
      height: 50,
    });
  });

  $(".owl-carousel").each((i, el) => {
    $(el).on("initialized.owl.carousel", function (event) {
      $(".truncate").each((i, el) => {
        new Dotdotdot(el, {
          height: 50,
        });
      });
    });
    $(el).owlCarousel({
      loop: true,
      center: true,
      nav: true,
      items: 1,
      responsive: {
        0: {
          items: 1,
        },
        1024: {
          items: 3,
        },
        1600: {
          items: 5,
        },
      },
    });
  });
};
