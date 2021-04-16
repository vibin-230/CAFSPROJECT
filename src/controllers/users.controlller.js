const { sendResponse } = require("../utils/helper");
const jwt = require("jsonwebtoken");
const { userSchema, apiUserSchema } = require("../models/users.model");
const aes = require("../utils/aes");
const crypto = require("crypto");
const { employeeSchema } = require("../models/employee.model");

exports.getApiToken = async (req, res) => {
  const {
    body: { username, password },
  } = req;
  try {
    console.log("get api token started...");
    if (!username || !password) {
      sendResponse(res, 400, {
        message: "Request Failed",
        error: "username & password are required",
      });
      return;
    }
    const apiUserDoc = await apiUserSchema.findOne({
      username: username,
    });
    if (!apiUserDoc) {
      sendResponse(res, 401, {
        message: "Request Failed",
        error: "Unauthorized",
      });
      return;
    }
    if (apiUserDoc && apiUserDoc.password) {
      if (apiUserDoc.password === password) {
        const token = jwt.sign(req.body, process.env.apiKey, {
          expiresIn: "5h",
        });
        sendResponse(res, 200, {
          message: "Success",
          token: `Bearer ${token}`,
        });
      } else {
        sendResponse(res, 401, {
          message: "Unauthorized",
          error: "Invalid password",
        });
        return;
      }
    }
  } catch (err) {
    sendResponse(res, 400, {
      message: "Request Failed",
      error: err.toString(),
    });
  }
};

exports.userSignUp = async (req, res) => {
  const {
    body: { email, password },
  } = req;
  try {
    if (!email || !password) {
      sendResponse(res, 400, {
        message: "Missing Parameters",
        error: " email or password missing",
      });
      return;
    }
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      sendResponse(res, 400, {
        message: "email format is invalid",
      });
      return;
    }
    let userDoc = await userSchema.findOne({ email: email });
    if (userDoc && userDoc.id) {
      sendResponse(res, 400, { message: "User Already Exists" });
      return;
    }
    let encryptedPwd = aes.encrypt(password, process.env.keyBase64);
    if (!encryptedPwd) {
      sendResponse(res, 400, {
        message: "An Error Occured",
        error: "Error in encrypting",
      });
      return;
    }
    req.body.encryptedPassword = encryptedPwd;
    const createDoc = await new userSchema(req.body).save();
    if (createDoc && createDoc.id) {
      sendResponse(res, 200, {
        message:
          "User Created Successfully.Login with encrypted Password to proceed further",
        encrytedPassword: encryptedPwd,
      });
      return;
    } else {
      sendResponse(res, 400, {
        message: "User not created",
        error: createDoc.toString(),
      });
      return;
    }
  } catch (error) {
    sendResponse(res, 400, {
      message: "An Unkown Error Occured",
      error: error.toString(),
    });
    return;
  }
};

exports.userLogin = async (req, res) => {
  const {
    body: { email, encryptedPassword },
  } = req;
  try {
    if (!email || !encryptedPassword) {
      sendResponse(res, 400, {
        message: "Missing Parameters",
        error: " email or password missing",
      });
      return;
    }
    let userDoc = await userSchema.findOne({ email: email });
    if (!userDoc || !userDoc.id) {
      sendResponse(res, 404, {
        message: "User not found",
      });
      return;
    }

    let decryptedPassword = aes.decrypt(
      encryptedPassword,
      process.env.keyBase64
    );
    if (!decryptedPassword) {
      sendResponse(res, 400, {
        message: "An Error Occured",
        error: "Error in decrypting",
      });
      return;
    }
    if (decryptedPassword == userDoc.password) {
      let accesstoken = crypto.randomBytes(100);
      accesstoken = accesstoken.toString("hex");
      userDoc.loggedInDevices.push({ token: accesstoken });
      await userSchema.findByIdAndUpdate(
        userDoc.id,
        {
          $set: {
            loggedInDevices: userDoc.loggedInDevices,
          },
        },
        { new: true },
        (err, doc) => {
          if (doc && doc.id) {
            sendResponse(res, 200, {
              message: "Login Successfull",
              logintoken: accesstoken,
            });
            return;
          } else {
            sendResponse(res, 400, {
              message: "Login Failure",
              error: err,
            });
          }
        }
      );
    } else {
      sendResponse(res, 401, {
        message: "Unauthorized",
        error: "Invalid Password",
      });
      return;
    }
  } catch (error) {
    sendResponse(res, 400, {
      message: "An Unkown Error Occured",
      error: error.toString(),
    });
    return;
  }
};

exports.addEmployee = async (req, res) => {
  const { isLoggedIn, body } = req;
  try {
    if (!isLoggedIn) {
      sendResponse(res, 401, {
        message: "Unauthorized",
        error: "User not logged in",
      });
      return;
    }
    if (
      !body.email ||
      !body.name ||
      !body.mobileNo ||
      !body.skills ||
      !body.skills.length ||
      !body.role ||
      !["Admin", "User"].includes(body.role) ||
      !body.dob ||
      !["Male", "Female", "TransGender"].includes(body.gender)
    ) {
      sendResponse(res, 400, {
        message: "Invalid Parameters",
        error: "Parameters missinf in body",
      });
      return;
    }

    let newDoc = await new employeeSchema(req.body).save();
    if (newDoc && newDoc.id) {
      sendResponse(res, 200, { message: "User created successfully" });
      return;
    } else {
      sendResponse(res, 400, {
        message: "User not created",
        error: newDoc.toString(),
      });
      return;
    }
  } catch (error) {
    sendResponse(res, 400, {
      message: "An Unkown Error Occured",
      error: error.toString(),
    });
    return;
  }
};

exports.editEmployee = async (req, res) => {
  const { isLoggedIn, body } = req;
  try {
    if (!isLoggedIn) {
      sendResponse(res, 401, {
        message: "Unauthorized",
        error: "User not logged in",
      });
      return;
    }
    if (!body.id) {
      sendResponse(res, 401, {
        message: "Missing Parameters",
        error: "id missing in body",
      });
      return;
    }
    if (body.role && !["Admin", "User"].includes(body.role)) {
      sendResponse(res, 401, {
        message: "Invalid Parameters",
        error: "role should be either Admin or User only",
      });
      return;
    }
    if (
      body.gender &&
      !["Male", "Female", "TransGender"].includes(body.gender)
    ) {
      sendResponse(res, 401, {
        message: "Invalid Parameters",
        error: "gender should be either Male or Female or TransGender only",
      });
      return;
    }
    let employeeDoc = await employeeSchema.findOne({ _id: body.id });
    if (!employeeDoc || !employeeDoc.id) {
      sendResponse(res, 404, { message: "User does not exist" });
      return;
    }
    employeeDoc.name = body.name ? body.name : employeeDoc.name;
    employeeDoc.email = body.email ? body.email : employeeDoc.email;
    employeeDoc.mobileNo = body.mobileNo ? body.mobileNo : employeeDoc.mobileNo;
    employeeDoc.skills = body.skills ? body.skills : employeeDoc.skills;
    employeeDoc.role = body.role ? body.role : employeeDoc.role;
    employeeDoc.DOB = body.DOB ? body.DOB : employeeDoc.DOB;
    employeeDoc.gender = body.gender ? body.gender : employeeDoc.gender;

    let updateDoc = await employeeSchema.findByIdAndUpdate(
      employeeDoc.id,
      {
        $set: employeeDoc,
      },
      {
        new: true,
      }
    );
    if (updateDoc && updateDoc.id) {
      sendResponse(res, 200, { message: "User updated successfully" });
      return;
    } else {
      sendResponse(res, 400, {
        message: "User update failed",
        error: updateDoc.toString(),
      });
      ``;
      return;
    }
  } catch (error) {
    sendResponse(res, 400, {
      message: "An Unkown Error Occured",
      error: error.toString(),
    });
    return;
  }
};

exports.deleteEmployee = async (req, res) => {
  const { isLoggedIn, body } = req;
  try {
    if (!isLoggedIn) {
      sendResponse(res, 401, {
        message: "Unauthorized",
        error: "User not logged in",
      });
      return;
    }
    if (!body.id) {
      sendResponse(res, 401, {
        message: "Missing Parameters",
        error: "id missing in body",
      });
      return;
    }
    let employeeDoc = employeeSchema.findById(body.id);
    if (!employeeDoc || !employeeDoc.id) {
      sendResponse(res, 404, { message: "Employee does not exist" });
      return;
    }
    await employeeSchema.findByIdAndDelete(body.id);
    sendResponse(res, 200, { message: "User deleted successfully" });
  } catch (error) {
    sendResponse(res, 400, {
      message: "An Unkown Error Occured",
      error: error.toString(),
    });
    return;
  }
};

exports.getAllEmployee = async (req, res) => {
  const { isLoggedIn, body } = req;
  try {
    if (!isLoggedIn) {
      sendResponse(res, 401, {
        message: "Unauthorized",
        error: "User not logged in",
      });
      return;
    }
    let employeesDoc = await employeeSchema.find();
    if (employeesDoc && employeesDoc.length) {
      sendResponse(res, 200, { message: "Success", result: employeesDoc });
    }
    if (employeesDoc && !employeesDoc.length) {
      sendResponse(res, 404, { message: "No records found" });
    }
  } catch (error) {
    sendResponse(res, 400, {
      message: "An Unkown Error Occured",
      error: error.toString(),
    });
    return;
  }
};
