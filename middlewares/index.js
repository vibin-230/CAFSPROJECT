const { authentication } = require("./authentication");

const createMiddleware = () => {
  const auth = authentication();
  return {
    authenticate: {
      verify: auth.verify
    }
  };
};

module.exports = {
  createMiddleware
};
