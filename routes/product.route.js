const product = require("../src/controllers/product.controller");

module.exports = ({ app, middleware }) => {
  // get JWT api token API
  app.get("/v1/getProducts", product.getAllProducts);

  app.post("/v1/createProducts", product.createProduct);

  app.post("/v1/editProducts", product.editProduct);

  app.post("/v1/deleteProducts", product.deleteProduct);

  // User Signup API
};
