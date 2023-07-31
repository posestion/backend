const multer = require('multer');
const upload = multer();
const {imageUploader_board} = require("../../../config/imageUploader");
module.exports = function (app) {
  const board_class = require("./classController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  app.post("/app/class/postClass", jwtMiddleware, imageUploader_board.array("images", 10), board_class.createClass); 
  
  app.get("/app/class/detailPage/:id",jwtMiddleware, board_class.getClass); // 상세 페이지

  app.get("/app/class/dibs/:id",jwtMiddleware,board_class.addDibs); // 찜하기
  app.get("/app/class/cancelDibs/:id",jwtMiddleware,board_class.cancelDibs); // 찜 취소
  
  app.post("/app/class/postReview/:id",jwtMiddleware,board_class.postReview); // 리뷰 쓰기
  
  app.get("/app/class/deleteReview/:id",jwtMiddleware,board_class.deleteReview); // 리뷰 삭제 

  app.get("/app/class/hotClass",jwtMiddleware,board_class.getHotClass);// 요즘 핫한 강의 페이지

  app.get("/app/class/drawer",jwtMiddleware,board_class.getDrawer)// 기본 서랍 4개씩.

  app.get("/app/class/drawer/myClass",jwtMiddleware, board_class.getMyClass) // 기본 서랍 ->  내 강의실 전체 보기

  app.get("/app/class/drawer/myDibs",jwtMiddleware, board_class.getMyDibs) // 기본 서랍 ->  찜 한거 전체보기
  
  // 클래스 삭제 
  app.get("/app/class/deleteClass/:id",jwtMiddleware,board_class.deleteClass);


  // 클래스 전체 가져오기
  app.get("/app/class/getAllClass",board_class.getAllClass);
  
  // 전문가 인기순위 -> 여기 말고 다른 파일에 둘 것! 

  // 검색 



}