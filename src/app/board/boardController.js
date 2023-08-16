const jwtMiddleware = require("../../../config/jwtMiddleware");
const boardProvider = require("../../app/board/boardProvider");
const boardService = require("../../app/board/boardService");
const userProvider = require("../../app/User/userProvider");

const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const { imageUploader } = require("../../../config/imageUploader");
const multer = require("multer");
const moment = require("moment");

// 홈 화면 - 광고 배너
exports.getAd = async function (req, res) {
  const result = await boardProvider.getAd();
  return res.send(response(baseResponse.SUCCESS, result));
};

// 홈 화면 - 수강 중인 강의
exports.takinglec = async function (req, res) {
  const userIdx = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );
  if (!userIdx) {
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }

  const result = await boardProvider.taking_lecture(userIdx);
  return res.send(response(baseResponse.SUCCESS, result));
};

// 홈 화면 - hot한 강의
exports.hotlec = async function (req, res) {
  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );
  if (!userIdx) {
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }
  const result = await boardProvider.getHotLec(userIdx);
  return res.send(response(baseResponse.SUCCESS, result));
};

// 게시판 - 이사잘
exports.photowell = async function (req, res) {
  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );
  if (!userIdx) {
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }
  const result = await boardProvider.getPhotoWell(userIdx);
  return res.send(response(baseResponse.SUCCESS, result));
};

// 게시판 - 클래스
exports.getClass = async function (req, res) {
  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );
  if (!userIdx) {
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }
  const result = await boardProvider.getClass(userIdx);
  return res.send(response(baseResponse.SUCCESS, result));
};

// 클래스 - 요즘 HOT한 강의
exports.getHotClass = async function (req, res) {
  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );
  if (!userIdx) {
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }
  const result = await boardProvider.getHotClass(userIdx);
  return res.send(response(baseResponse.SUCCESS, result));
};

// 클래스 - 내가 찜한 강의
exports.getDibs = async function (req, res) {
  const userIdx = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );
  if (!userIdx) {
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }

  const result = await boardProvider.getDibs(userIdx);
  return res.send(response(baseResponse.SUCCESS, result));
};

// 10초 사진 업로드
exports.createTensPhoto = async function (req, res) {
  const { title } = await req.body;
  if (!title) {
    return res.send(baseResponse.NO_TITLE);
  }
  const userIdx = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );
  if (!userIdx) {
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }
  console.log(userIdx);
  //전문가 여부 확인 -> 전문가면 뱃지 추가, 전문가 아니면 뱃지 추가 x
  const userIsExpert = await userProvider.getIsExpert(userIdx);
  const expertTF = true;
  if (!userIsExpert) {
    // 전문가가 아닐 경우
    expertTF = false;
  }
  console.log(expertTF);

  // 이미지
  var pose_image;
  if (req.file) {
    pose_image = req.file.location;
  } else {
    pose_image = null;
    return res.send(baseResponse.POSE_IMAGE_NULL);
  }
  console.log(pose_image);
  // 현재 날짜
  const date = await moment().format("YYYY-MM-DD"); // string 처리?
  console.log(date);
  // 프로필 이미지 불러오기
  const profile = await boardProvider.getProfileImg(userIdx);
  console.log(profile[0]["profile_image"]);
  const result = await boardService.createTensPhoto(
    userIdx,
    title,
    expertTF,
    pose_image,
    date,
    profile[0]["profile_image"]
  );
  return res.send(response(baseResponse.SUCCESS, result));
};

// 10초 사진 - 상세
exports.tensPhotoDetail = async function (req, res) {
  // 10초 상점 id
  const id = req.params.id;
  if (!id) {
    return res.send(baseResponse.TENsPhoto_ID_NOT_EXIST);
  }

  const userIdx = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );
  if (!userIdx) {
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }

  const result = await boardProvider.tensPhotoDetail(id, userIdx);
  return res.send(response(baseResponse.SUCCESS, result));
};

// 10초 상점 - 게시판에 띄우기
exports.getAllTensPhoto = async function (req, res) {
  const result = await boardProvider.getAllTensPhoto();
  return res.send(response(baseResponse.SUCCESS, result));
};
