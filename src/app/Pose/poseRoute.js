const multer = require("multer");
const upload = multer();
const { imageUploader_pose } = require("../../../config/imageUploader");
const jwtMiddleware = require("../../../config/jwtMiddleware");
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
  // 포즈 상세 게시글
  app.get("/pose/getpose/:id", jwtMiddleware, pose.getPose);
  // 포즈 장바구니 보기
  app.get("/pose/allBaskets", jwtMiddleware, pose.allBasket);
  // 포즈 상점 전체 보기
  app.get("/pose/allView", jwtMiddleware, pose.allView);
  // 검색
  app.get("/pose/search", jwtMiddleware, pose.poseSearch);
  // 장바구니 포즈 삭제
  app.get("/pose/posebasketDelete/:id", jwtMiddleware, pose.poseDelete);
  // 즐겨찾기 추가
  app.post("/pose/addfavorite/:id", jwtMiddleware, pose.addFavorite);
  // 즐겨찾기 제거
  app.get("/pose/delfavorite/:id", jwtMiddleware, pose.delFavorite);
  // 즐겨찾기 조회(좋아요 게시판)
  app.get("/pose/favoriteview", jwtMiddleware, pose.favoriteView);
  // hot 게시판(즐겨찾기 수 순) 조회
  app.get("/pose/hotboard", jwtMiddleware, pose.hotBoard);
  // 필터(인기순(조회순))
  app.get("/pose/filterpopular", jwtMiddleware, pose.filterpopular);
  // 필터(최신순)
  app.get("/pose/filterdate", jwtMiddleware, pose.filterdate);
  // 연령대별
  app.get("/pose/getAge", jwtMiddleware, pose.getAgeGroup);
  // 포즈 삭제
  app.get("/pose/delete/:id", jwtMiddleware, pose.delPose);
};
