const multer = require('multer');
const upload = multer();
const {imageUploader_board} = require("../../../config/imageUploader");
module.exports = function (app) {
  const board_class = require("./classController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  app.post("/app/class/postClass", jwtMiddleware, imageUploader_board.array("images", 10), board_class.createClass); 
  
  app.get("/app/class/detailPage/:id",jwtMiddleware, board_class.getClass); // 상세 페이지 -> 수정 완료

  app.get("/app/class/dibs/:id",jwtMiddleware,board_class.addDibs); // 찜하기
  app.get("/app/class/cancelDibs/:id",jwtMiddleware,board_class.cancelDibs); // 찜 취소
  
  app.post("/app/class/postReview/:id",jwtMiddleware,board_class.postReview); // 리뷰 쓰기
  
  app.get("/app/class/deleteReview/:id",jwtMiddleware,board_class.deleteReview); // 리뷰 삭제 

  app.get("/app/class/hotClass",jwtMiddleware,board_class.getHotClass);// 요즘 핫한 강의 페이지 -> 수정 완료

  app.get("/app/class/drawer",jwtMiddleware,board_class.getDrawer)// 기본 서랍 4개씩. -> 수정 완료

  app.get("/app/class/drawer/myClass",jwtMiddleware, board_class.getMyClass) // 기본 서랍 ->  내 강의실 전체 보기 -> 수정완료

  app.get("/app/class/drawer/myDibs",jwtMiddleware, board_class.getMyDibs) // 기본 서랍 ->  찜 한거 전체보기  -> 수정완료

  // 클래스 삭제 
  app.get("/app/class/deleteClass/:id",jwtMiddleware,board_class.deleteClass);

  // 클래스 전체 가져오기 
  app.get("/app/class/getAllClass",board_class.getAllClass);

  // 검색 
  app.get("/app/class/search",jwtMiddleware,board_class.getSearchPage); // 수정완료

  // 수강하기
  app.get("/app/class/register/:id",jwtMiddleware,board_class.addRegister); // 수정완료

  //보관하기
  app.get("/app/class/store/:id",jwtMiddleware,board_class.store);

  // 꺼내기
  app.get("/app/class/takeOut/:id",jwtMiddleware,board_class.takeOut);

}