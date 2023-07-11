module.exports = function (app) {
  const user = require("./userController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // id 중복 확인
  app.get("/app/users/checkid/:id", user.repeatId);

  // 닉네임 중복 확인
  app.get("/app/users/checkname/:nickname", user.repeatName);
};
