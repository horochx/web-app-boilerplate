const getCustomTransformers = () => ({
  before: [require("react-refresh-typescript")()],
});

module.exports = getCustomTransformers;
