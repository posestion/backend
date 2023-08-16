const multer = require('multer');
const upload = multer();
const {fileUploader_inquiry} = require("../../../config/imageUploader");
module.exports = function (app) {
  const csController = require("./csController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  //문의 올리기
  app.post("/app/cs/inquiry", jwtMiddleware, fileUploader_inquiry.array("files", 5), csController.createInquiry); 
  
  //내 문의 확인
  app.get("/app/cs/inquiry",jwtMiddleware, csController.getInquiry); // 상세 페이지

}