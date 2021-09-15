module.exports = function (count, options) {
  let result = "";
  for (var i = 0; i < count; i++) {
    result += options.fn(this);
  }
  return result;
};
