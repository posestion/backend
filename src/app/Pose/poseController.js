const jwtMiddleware = require("../../../config/jwtMiddleware");
const poseProvider = require("../../app/Pose/poseProvider");
const userProvider = require("../../app/User/userProvider");
const poseService = require("../../app/Pose/poseService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const { imageUploader } = require("../../../config/imageUploader");
const multer = require("multer");
const moment = require("moment");

exports.postPose = async function (req, res) {
  const { title, content, tag } = await req.body;
  console.log(tag);
  console.log(tag.length);
  console.log(Array.isArray(tag));
  const tags = [];
  const checkArr = Array.isArray(tag); // tag 1개 입력인지, 여러개 입력인지 확인(여러개 입력일 경우 자동으로 리스트 안에 tag들 저장되어 2차원리스트 됨)

  if (!checkArr) {
    // tag 1개일 때
    tags.push(tag);
  } else {
    // tag 여러개일 때
    for (i = 0; i < tag.length; i++) {
      tags.push(tag[i]);
    }
  }

  // title 입력 안했을 때
  if (!title) {
    return res.send(baseResponse.NO_TITLE);
  }
  // content 입력 안했을 때
  if (!content) {
    return res.send(baseResponse.NO_CONTENT);
  }

  console.log(tags);

  // 로그인한 user_id로 회원가입할 때 자동생성된 id 불러오기
  const user_idx = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );

  const date = await moment().format("YYYY-MM-DD"); // string 처리?

  var pose_image;
  if (req.file) {
    pose_image = req.file.location;
  } else {
    pose_image = null;
    return res.send(baseResponse.POSE_IMAGE_NULL);
  }

  const update = await poseService.createPose(
    date,
    // view,
    user_idx,
    title,
    content,
    tags,
    pose_image
  );
  return res.send(baseResponse.SUCCESS);
};

// 포즈 장바구니 저장
exports.poseBasket = async function (req, res) {
  const { pose_id } = await req.body;

  // 당일 날짜
  const date = await moment().format("YYYY-MM-DD");

  // 로그인한 id로 회원가입할 때 자동생성된 id 불러오기
  const user_idx = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );

  // db에서 이미 저장된 {user_idx, pose_id}인지 확인
  const dbRead = await poseProvider.readIds(user_idx, pose_id);
  console.log(dbRead);
  if (dbRead.length > 0) {
    return res.send(baseResponse.BASKET_REPEAT);
  } else {
    const basket1 = await poseService.saveBasket(user_idx, pose_id, date);
    return res.send(basket1);
  }
};

// 포즈 상세 게시글 보기
exports.getPose = async function (req, res) {
  const id = req.params.id;
  const response = await poseProvider.getDetailpose(id);
  const response_view = await poseService.viewUp(id, response[0]["view"]);
  console.log(response[0]["view"]);
  const Nresponse = await poseProvider.getDetailpose(id);

  return res.send(Nresponse);
};
