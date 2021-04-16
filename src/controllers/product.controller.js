const { sendResponse } = require("../utils/helper");
const { productSchema } = require("../models/products.model");
// const aes = require("../utils/aes");
// const crypto = require("crypto");
// const { employeeSchema } = require("../models/employee.model");

exports.getAllProducts = async (req, res) => {
  // const { isLoggedIn, body } = req;
  try {
    //   if (!isLoggedIn) {
    // 	sendResponse(res, 401, {
    // 	  message: "Unauthorized",
    // 	  error: "User not logged in",
    // 	});
    // 	return;
    //   }
    let productDoc = await productSchema.find();
    if (productDoc && productDoc.length) {
      sendResponse(res, 200, { message: "Success", result: productDoc });
    }
    if (productDoc && !productDoc.length) {
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

exports.createProduct = async (req, res) => {
  // const { isLoggedIn, body } = req;
  try {
    console.log(req.body);
    let productDoc = await new productSchema(req.body).save();
    if (productDoc && productDoc._id) {
      sendResponse(res, 200, { message: "Success", result: productDoc });
    } else {
      sendResponse(res, 400, { message: productDoc.toString() });
    }
  } catch (error) {
    sendResponse(res, 400, {
      message: "An Unkown Error Occured",
      error: error.toString(),
    });
    return;
  }
};

exports.editProduct = async (req, res) => {
  // const { isLoggedIn, body } = req;
  try {
    //   if (!isLoggedIn) {
    // 	sendResponse(res, 401, {
    // 	  message: "Unauthorized",
    // 	  error: "User not logged in",
    // 	});
    // 	return;
    //   }
    console.log(req.body);
    let productDoc = await productSchema.findOne({
      id_code: req.query.id_code,
    });
    if (productDoc && productDoc._id) {
      if (productDoc.quantity_in_hand > req.body.sold_items) {
        productDoc.sell_price = req.body.sell_price
          ? req.body.sell_price
          : productDoc.sell_price;
        productDoc.quantity_in_hand = req.body.sold_items
          ? productDoc.quantity_in_hand - req.body.sold_items
          : productDoc.quantity_in_hand;
        let updateDoc = await productSchema.findByIdAndUpdate(
          productDoc.id,
          {
            $set: productDoc,
          },
          {
            new: true,
          }
        );
        if (updateDoc && updateDoc.id) {
          sendResponse(res, 200, { message: "Product updated successfully" });
          return;
        } else {
          sendResponse(res, 400, {
            message: "User update failed",
            error: updateDoc.toString(),
          });
          ``;
          return;
        }
      } else
        sendResponse(res, 300, {
          message: "Insuficient quantity",
          result: productDoc,
        });
    } else {
      sendResponse(res, 400, { message: productDoc.toString() });
    }
  } catch (error) {
    sendResponse(res, 400, {
      message: "An Unkown Error Occured",
      error: error.toString(),
    });
    return;
  }
};
exports.deleteProduct = async (req, res) => {
  const { body } = req;
  try {
    if (!body.id_code) {
      sendResponse(res, 401, {
        message: "Missing Parameters",
        error: "id missing in body",
      });
      return;
    }
    let productDoc = productSchema.findOne({ id_code: body.id_code });
    if (!productDoc || !productDoc.id) {
      sendResponse(res, 404, { message: productDoc });
      return;
    }
    await productSchema.findByIdAndDelete(productDoc.id);
    sendResponse(res, 200, { message: "Product deleted successfully" });
  } catch (error) {
    sendResponse(res, 400, {
      message: "An Unkown Error Occured",
      error: error.toString(),
    });
    return;
  }
};
