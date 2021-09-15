module.exports = function (min, max) {
  const nr = Math.floor(Math.random() * (max - min)) + min;
  let text =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea at, praesentium molestias, error nulla iste aut architecto, id illum itaque minima velit mollitia earum perspiciatis vel veritatis in fugiat temporibus.";
  while (text.split(" ").length < nr) text += " " + text;

  return text
    .split(" ")
    .filter((it, i) => i < nr)
    .join(" ");
};
