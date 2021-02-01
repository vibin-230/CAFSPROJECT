const users = require("../src/controllers/users.controlller");

module.exports = ({ app, middleware }) => {
  // get JWT api token API
  app.post("/v1/get-api-token", users.getApiToken);

  // User Signup API
  app.post(
    "/v1/user/signup",
    middleware.authenticate.verify,
    users.userSignUp
  );

  // User Login API
  app.post(
    "/v1/user/login",
    middleware.authenticate.verify,
    users.userLogin
  );

  app.get(
    "/v1/employee/get",
    middleware.authenticate.verify,
    users.getAllEmployee
  );

  // Add Employee
  app.post(
    "/v1/employee/add",
    middleware.authenticate.verify,
    users.addEmployee
  );

  //Edit Employee
  app.post(
    "/v1/employee/edit",
    middleware.authenticate.verify,
    users.editEmployee
  );

  //Delete Employee
  app.post(
    "/v1/employee/delete",
    middleware.authenticate.verify,
    users.deleteEmployee
  );
};
