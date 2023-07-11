module.exports = function (app) {
  const user = require("./userController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  //수정수정수정
  // 승아 - 수정합니다. git 테스트
  // git test중입니다.
  // git test중입니다.
  // 수정22222

  // 중복 id 검사
  //app.get("/app/users:id", user.repeatId);

  //회원가입
  app.post("/app/users", user.postUsers);

  //로그인
  app.post("/app/login", user.login);
  // id 중복 확인
  app.get("/app/users/checkid/:id", user.repeatId);

  // 닉네임 중복 확인
  app.get("/app/users/checkname/:nickname", user.repeatName);
};
