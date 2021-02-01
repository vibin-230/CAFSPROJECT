const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema(
	{
		email: String,
		name:String,
		mobileNo : Number,
		skills :[],
		role :{type:String,enum : ["Admin","User"]},
		dob: String,
		gender : {type:String,enum : ["Male", "Female", "TransGender"]}
	  },
	  { timestamps: true }
);


module.exports = {
	employeeSchema: mongoose.model("employee", employeeSchema),
};
