const { userSchema } = require("../models/users.model");

exports.checkUserLoggedin = async (req) => {
  try {
    let isLoggedIn = false;
    if (!req.headers.logintoken) {
      return false;
    }
    let userDoc = await userSchema.findOne({
      loggedInDevices: {
        $elemMatch: {
          token: req.headers.logintoken,
        },
      },
    });

    isLoggedIn =
      (userDoc && userDoc.id) ? true : false;
    let doc = (userDoc && userDoc.id) ? userDoc : {}

    return {
      isLoggedIn: isLoggedIn,
	  userDoc : doc
    };
  } catch (err) {
	  console.log(err.toString())
    return false;
  }
};
