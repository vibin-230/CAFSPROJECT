

exports.sendResponse = (res, statusCode, options) => {
  const resObj = { responseCode: statusCode };
  for (let key in options) {
    resObj[key] = options[key];
  }
  res.status(statusCode).send(resObj);
};
