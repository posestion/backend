module.exports = function (app) {
  const user = require("./userController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 중복 id 검사
  //app.get("/app/users:id", user.repeatId);

  //회원가입
  app.post('/app/users', user.postUsers);

  //로그인
  app.post('/app/login', user.login);


}