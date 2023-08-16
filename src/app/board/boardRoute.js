const multer = require("multer");
const upload = multer();
const { imageUploader_tensPhoto } = require("../../../config/imageUploader");

module.exports = function (app) {
  const board = require("./boardController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");
  // 홈 - 광고 배너
  app.get("/board/getAd", jwtMiddleware, board.getAd);
  // 홈 - 수강 중인 강의 - 수정 필요
  app.get("/board/getTakingLec", jwtMiddleware, board.takinglec);
  // 홈 - HOT한 강의
  app.get("/board/getHotLec", jwtMiddleware, board.hotlec);
  // 게시판 - 10초 사진 업로드
  app.post(
    "/board/tensPhoto/write",
    jwtMiddleware,
    imageUploader_tensPhoto.single("image"),
    board.createTensPhoto
  );
  // 게시판 - 10초 사진 상세
  app.get(
    "/board/getTensPhotoDetail/:id",
    jwtMiddleware,
    board.tensPhotoDetail
  );
  // 게시판 - 10초 사진 게시판에 띄우기
  app.get("/board/getAllTensPhoto", jwtMiddleware, board.getAllTensPhoto);
  // 게시판 - 이사잘
  app.get("/board/getPhotowell", jwtMiddleware, board.photowell);
  // 게시판 - 클래스
  app.get("/board/getClass", jwtMiddleware, board.getClass);
  // 클래스 - 요즘 hot한 강의
  app.get("/board/getHotClass", jwtMiddleware, board.getHotClass);
  // 클래스 - 내가 찜한 강의
  app.get("/board/getDibs", jwtMiddleware, board.getDibs);
};
