module.exports = function (app) {
  const user = require("./userController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 중복 id 검사
  app.get("/app/users:id", user.repeatId);
};
