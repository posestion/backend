const multer = require("multer");
const upload = multer();
const { imageUploader_pose } = require("../../../config/imageUploader");
module.exports = function (app) {
  const pose = require("./poseController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 포즈상점 게시글 작성
  app.post(
    "/pose/write",
    jwtMiddleware,
    imageUploader_pose.single("image"),
    pose.postPose
  );
  // 포즈 장바구니 저장
  app.post("/pose/basket", jwtMiddleware, pose.poseBasket);
};
