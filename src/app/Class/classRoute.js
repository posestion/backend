const multer = require('multer');
const upload = multer();
const {imageUploader_board} = require("../../../config/imageUploader");
module.exports = function (app) {
  const board_class = require("./classController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  app.post("/class", jwtMiddleware, imageUploader_board.array("images", 10), board_class.createClass); 
  app.get("/class/:id",jwtMiddleware, board_class.getClass); // 상세 페이지

}