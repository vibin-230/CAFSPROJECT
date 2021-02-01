const {
  sendResponse
} = require("../src/utils/helper");

const authentication = () => {
  return {
    verify: async function (req, res, next) {
      let { user } = req;
      if (!user)
        sendResponse(res, 401, {
          message: "Unauthorized",
        });
      else return next();
    }
  };
};

module.exports = {
  authentication
};
