const mongoose = require("mongoose");

const usersSchema = mongoose.Schema(
	{
		email: String,
		password: String,
		encryptedPassword: String,
		loggedInDevices: [
			{
			  token: { type: String },
			  deviceName: { type: String, default: "Unknown" },
			},
		  ]
	  },
	  { timestamps: true }
);

const apiUserSchema = mongoose.Schema(
  {
    username: String,
    password: String,
  },
  { timestamps: true }
);

module.exports = {
  userSchema: mongoose.model("user", usersSchema),
  apiUserSchema: mongoose.model("apiuser", apiUserSchema),
};
