window.onload = () => {
  if ($(".bxslider").length)
    $(".bxslider").bxSlider({
      auto: true,
      autoControls: true,
      stopAutoOnClick: true,
      pager: true,
      slideWidth: 600,
    });

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
};
