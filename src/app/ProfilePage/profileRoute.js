
// 마이페이지 -> 내가 올린 강의 , 기본 서랍(좋아요한 이사잘, 좋아요한 포즈(장바구니한 포즈랑 다름)) , 내가 올린 컨텐츠(이사잘 ,포즈)
// 전문가 페이지 -> 올린 강의 ,올린 컨텐츠(이사잘, 포즈)
// 일반 사용자 페이지 -> 올린 컨텐츠(이사잘, 포즈)


module.exports = function (app) {
  const profileController = require("./profileController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 마이페이지 -> 기본 서랍( 좋아요한 이사잘 , 좋아요한 포즈 )
  app.get("/app/mypage/drawer",jwtMiddleware,profileController.getMyPageDrawer);

  // 기본서랍 -> 좋아요한 이사잘
  app.get("/app/mypage/drawer/wdyt",jwtMiddleware,profileController.getLikeWdyt);

  // 기본 서랍 -> 좋아요한 포즈
  app.get("/app/mypage/drawer/pose",jwtMiddleware,profileController.getLikePose);

  // 마이페이지 -> 내가 올린 강의
  app.get("/app/mypage/myClass",jwtMiddleware,profileController.getMyClass);

  // 마이페이지 -> 내가 올린 컨텐츠
  app.get("/app/mypage/myContent",jwtMiddleware,profileController.getMyContent);

  // 프로필 페이지 -> 올린 강의
  app.get("/app/profile/:nickname/class",jwtMiddleware,profileController.getUserClass);

  //프로필 페이지 -> 올린 컨텐츠
  app.get("/app/profile/:nickname/content",jwtMiddleware,profileController.getUserContent);

  // 마이페이지
  //app.get("/app/myPage/:nickname/content",jwtMiddleware,profileController.getUserContent);

  // 전문가, 일반인 페이지
  app.get("/app/profile/:nickname",jwtMiddleware,profileController.getUserProfile);


}

