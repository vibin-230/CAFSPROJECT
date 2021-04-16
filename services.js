// const userRoute = require("./routes/user.route");
const productRoute = require("./routes/product.route");

module.exports = ({ app, middleware }) => {
  //   userRoute({ app, middleware });
  productRoute({ app });
};
