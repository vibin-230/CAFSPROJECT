const userRoute = require("./routes/user.route");

module.exports = ({ app, middleware }) => {
	userRoute({ app, middleware });
  };