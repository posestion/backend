const multer = require('multer');
const upload = multer();
const {imageUploader_wdyt} = require("../../../config/imageUploader");
module.exports = function (app) {
  const wdytController = require("./wdytController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 이사잘 업로드
  app.post("/app/wdyt/upload", jwtMiddleware, imageUploader_wdyt.array("images", 10), wdytController.createWdyt); 

  // 좋아요 하기
  app.get("/app/wdyt/like/:id",jwtMiddleware, wdytController.addLike);

  // 좋아요 취소
  app.get("/app/wdyt/cancelLike/:id",jwtMiddleware, wdytController.cancelLike);

  // 댓글 달기
  app.post("/app/wdyt/comment/:id",jwtMiddleware, wdytController.addComment); //app/wdyt/comment/1?commentid=

  // 댓글 삭제
  app.get("/app/wdyt/deleteComment/:id",jwtMiddleware,wdytController.deleteComment);

  // 댓글에 좋아요 하기 -> 본인도 할 수 있는건지..?
  app.get("/app/wdyt/comment/addLike/:id",jwtMiddleware,wdytController.addCommentLike);

  // 댓글에 좋아요 취소 하기
  app.get("/app/wdyt/comment/cancelLike/:id",jwtMiddleware,wdytController.cancelCommentLike);

  // 이사잘 상세 페이지 
  app.get("/app/wdyt/detailPage/:id",jwtMiddleware,wdytController.getDetailPage);

  // 이사잘 게시판 페이지 -> 그냥 나열( 좋아요 수, 댓글 수)
  app.get("/app/wdyt",jwtMiddleware,wdytController.getPage);

  //이사잘 검색 페이지
  app.get("/app/wdty/search",jwtMiddleware,wdytController.getSearchPage);

  // 이사잘 삭제
  

}