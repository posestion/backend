
// 마이페이지 -> 내가 올린 강의 , 기본 서랍(좋아요한 이사잘, 좋아요한 포즈(장바구니한 포즈랑 다름)) , 내가 올린 컨텐츠(이사잘 ,포즈)
// 전문가 페이지 -> 올린 강의 ,올린 컨텐츠(이사잘, 포즈)
// 일반 사용자 페이지 -> 올린 컨텐츠(이사잘, 포즈)


module.exports = function (app) {
  const profileController = require("./profileController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 마이페이지 -> 기본 서랍( 좋아요한 이사잘 , 좋아요한 포즈 )
  //app.get("/app/mypage/drawer",jwtMiddleware,profileController.getMyPageDrawer);

  // 기본서랍 -> 좋아요한 이사잘
  //app.get("/app/mypage/drawer/wdyt",jwtMiddleware,profileController.getLikeWdyt);

  // 기본 서랍 -> 좋아요한 포즈
  //app.get("/app/mypage/drawer/pose",jwtMiddleware,profileController.getLikePose);

  // 마이페이지
  app.get("/app/myPage",jwtMiddleware,profileController.getMyPage);

  // 마이페이지 -> 내가 올린 강의 -> 수정완료
  app.get("/app/mypage/myClass",jwtMiddleware,profileController.getMyClass);

  // 마이페이지 -> 포즈 서랍
  app.get("/app/mypage/poseDrawer",jwtMiddleware,profileController.getPoseDrawer);

  // 마이페이지 -> 내가 올린 컨텐츠(이사잘,10초사진 4개씩)
  app.get("/app/mypage/myContent",jwtMiddleware,profileController.getMyContent);

  // 마이페이지 -> 내가 올린 컨텐츠 -> 이사잘 전체보기 ***********
  app.get("/app/mypage/myContent/wdyt",jwtMiddleware,profileController.getMyContentWdyt);

  // 마이페이지 -> 내가 올린 컨텐츠 -> 10초사진 전체보기 ***************
  app.get("/app/mypage/myContent/10sPhoto",jwtMiddleware,profileController.getMyContent10sPhoto);



  // 프로필 페이지 -> 올린 강의
  app.get("/app/profile/:nickname/class",jwtMiddleware,profileController.getUserClass); // 수정완료

  //프로필 페이지 -> 올린 컨텐츠
  app.get("/app/profile/:nickname/content",jwtMiddleware,profileController.getUserContent); // 수정완료

  // 프로필 페이지 -> 올린 컨텐츠 -> 이사잘 **************************************
  app.get("/app/profile/:nickname/content/wdyt",jwtMiddleware,profileController.getUserContent_wdyt);

  // 프로필 페이지 -> 올린 컨텐츠 -> 10초사진
  app.get("/app/profile/:nickname/content/10sPhoto",jwtMiddleware,profileController.getUserContent_10sPhoto);

  // 전문가, 일반인 페이지
  app.get("/app/profile/:nickname",jwtMiddleware,profileController.getUserProfile);// 수정완료

  // 보관함

  // 게시글 보관함
  app.get("/app/myPage/store/wdyt",jwtMiddleware,profileController.getMyPage_wdyt);
  
  // 10초 사진 보관함
  app.get("/app/myPage/store/10sPhoto",jwtMiddleware,profileController.getMyPage_10sPhoto);

  // 강의 보관함
  app.get("/app/myPage/store/class",jwtMiddleware,profileController.getMyPage_class);

}

