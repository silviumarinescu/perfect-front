window.onload = () => {
  if ($(".bxslider").length)
    $(".bxslider").bxSlider({
      auto: true,
      autoControls: true,
      stopAutoOnClick: true,
      pager: true,
      slideWidth: 600,
    });

  $(".gallery").on("click", () => {
    let gallery = new PhotoSwipe(
      $(".pswp")[0],
      PhotoSwipeUI_Default,
      [
        {
          src: "https://unsplash.it/1200/900/?image=702",
          w: "1200",
          h: "900",
          title: "test",
        },
      ],
      {
        index: 0,
        bgOpacity: 0.85,
        showHideOpacity: true,
      }
    );
    gallery.init();
  });
};
