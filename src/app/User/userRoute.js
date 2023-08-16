const multer = require("multer");
const upload = multer();
const {
  imageUploader_profile,
  imageUploader_board,
} = require("../../../config/imageUploader");
module.exports = function (app) {
  const user = require("./userController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 중복 id 검사
  //app.get("/app/users:id", user.repeatId);

  //회원가입
  app.post("/app/users", imageUploader_profile.single("image"), user.postUsers);

  //로그인
  app.post("/app/login", user.login);

  // id 중복 확인
  app.get("/app/users/checkid/:id", user.repeatId);

  // 닉네임 중복 확인
  app.get("/app/users/checkname/:nickname", user.repeatName);

  // id 찾기
  app.post("/app/users/findId", user.findId); // 수정

  // 비밀번호 재설정
  app.patch("/app/users/pwReset", user.resetPw);

  //로그인 유지 방식(예시)
  app.get("/app/hi", jwtMiddleware, (req, res) => {
    res.send(req.verifiedToken.userId);
  });

  //모든 사용자 정보 가져오기
  app.get("/app/getAllUsers", user.alluser);

  app.post(
    "/upload",
    jwtMiddleware,
    imageUploader_board.array("images", 10),
    function (req, res, next) {
      //마지막 함수에 req에 이미지 파일과 userid 모두 넘어오는 거에요!!!
      for (i = 0; i < req.files.length; i++) {
        console.log(req.files[i].location);
      }
      res.send(req.verifiedToken.userId);
    }
  );

  app.get("/app/follow/:userId", jwtMiddleware, user.follow);

  app.get("/app/cancelFollow/:userId", jwtMiddleware, user.cancelfollow);

  app.get("/app/follow/:userId", jwtMiddleware, user.follow);

  app.get("/app/cancelFollow/:userId", jwtMiddleware, user.cancelfollow);
  // 회원 정보 수정
  app.patch(
    "/app/userchange",
    jwtMiddleware,
    imageUploader_profile.single("image"),
    user.userchange
  );
};
