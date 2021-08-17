window.onload = () => {
  if ($(".bxslider").length)
    $(".bxslider").bxSlider({
      auto: true,
      autoControls: true,
      stopAutoOnClick: true,
      pager: true,
      slideWidth: 600,
    });
};
