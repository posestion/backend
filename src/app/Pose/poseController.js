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

  if (!tag) {
    return res.send(baseResponse.TAG_NULL);
  }
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
  // 포즈상점에 없는 포즈일 경우
  const poseid_TF = await poseProvider.check_pose_id(pose_id);
  if (poseid_TF.length == 0) {
    return res.send(baseResponse.POSE_ID_NULL);
  }
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
  // 해당되는 pose_id 없을 시
  const poseid_TF = await poseProvider.check_pose_id(id);
  if (poseid_TF.length == 0) {
    return res.send(baseResponse.POSE_ID_NULL);
  }
  // 상세 게시글 조회(태그 포함)
  const result = await poseProvider.getDetailpose(id);
  console.log(result);
  // 조회수 +1
  const response_view = await poseService.viewUp(id, result[0][0]["view"]);
  console.log(result[0]["view"]);
  // 조회수 +1 된 후 조회
  const Nresponse = await poseProvider.getDetailpose(id);
  // return res.send(Nresponse);
  return res.send(response(baseResponse.SUCCESS, Nresponse));
};

// 포즈 장바구니 보기
exports.allBasket = async function (req, res) {
  const user_id = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );
  const basket = await poseProvider.basketAll(user_id);
  return res.send(response(baseResponse.SUCCESS, basket));
};

// 포즈상점 전체 보기
exports.allView = async function (req, res) {
  const result = await poseProvider.allStore();
  return res.send(response(baseResponse.SUCCESS, result));
};
// 검색
exports.poseSearch = async function (req, res) {
  const { word } = await req.body;
  if (!word) {
    // 띄어쓰기만 한 것도 에러메시지에 포함?
    return res.send(baseResponse.SEARCH_NULL);
  }
  const result = await poseProvider.searchWord(word);
  return res.send(response(baseResponse.SUCCESS, result));
};

// 포즈 삭제
exports.poseDelete = async function (req, res) {
  const user_id = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );
  const pose_id = req.params.id; // pose_id
  // 입력한 pose_id가 포즈상점에 없을 때
  const poseid_TF = await poseProvider.check_pose_id(pose_id);
  if (poseid_TF.length == 0) {
    return res.send(baseResponse.POSE_ID_NULL);
  }
  // 입력한 pose_id가 장바구니에 없을 때
  const basket_poseid_TF = await poseProvider.check_basket_pose(
    pose_id,
    user_id
  );
  if (basket_poseid_TF.length == 0) {
    return res.send(baseResponse.BASKET_POSE_ID_NULL);
  }

  const result = await poseService.deletePose(user_id, pose_id);
  return res.send(response(baseResponse.SUCCESS, result));
};

// 즐겨찾기 추가
exports.addFavorite = async function (req, res) {
  const user_id = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );
  const pose_id = req.params.id;
  // 입력한 pose_id가 없을 때
  const poseid_TF = await poseProvider.check_pose_id(pose_id);
  if (poseid_TF.length == 0) {
    return res.send(baseResponse.POSE_ID_NULL);
  }
  // 에러메시지 - 중복된 포즈 즐겨찾기에 넣으려고 할 때
  // db에서 이미 저장된 {user_idx, pose_id}인지 확인
  const dbRead = await poseProvider.fav_readIds(user_id, pose_id);
  console.log(dbRead);
  if (dbRead.length > 0) {
    return res.send(baseResponse.FAV_REPEAT);
  } else {
    const result = await poseService.addFav(user_id, pose_id);
    return res.send(response(baseResponse.SUCCESS, result));
  }
};

// 즐겨찾기 제거
exports.delFavorite = async function (req, res) {
  const user_id = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );
  const pose_id = req.params.id;
  // 입력한 pose_id가 없을 때
  const poseid_TF = await poseProvider.check_pose_id(pose_id);
  if (poseid_TF.length == 0) {
    return res.send(baseResponse.POSE_ID_NULL);
  }
  // 입력한 pose_id가 즐겨찾기에 없을 때
  const fav_poseid_TF = await poseProvider.check_fav_pose(pose_id, user_id);
  if (fav_poseid_TF.length == 0) {
    return res.send(baseResponse.FAV_POSE_ID_NULL);
  }

  const response = await poseService.delFav(user_id, pose_id);
  return res.send(response);
};

// 즐겨찾기 조회(좋아요)
exports.favoriteView = async function (req, res) {
  const user_id = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );
  const result = await poseProvider.favView(user_id);
  return res.send(response(baseResponse.SUCCESS, result));
};

// hot 조회
exports.hotBoard = async function (req, res) {
  const result = await poseProvider.viewHot();
  return res.send(response(baseResponse.SUCCESS, result));
};

// 필터(인기순) 조회
exports.filterpopular = async function (req, res) {
  const result = await poseProvider.filpop();
  return res.send(response(baseResponse.SUCCESS, result));
};

// 필터(최신순) 조회
exports.filterdate = async function (req, res) {
  const result = await poseProvider.fildate();
  return res.send(response(baseResponse.SUCCESS, result));
};

// 연령대별 조회
exports.getAgeGroup = async function (req, res) {
  const user_id = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );
  if (!user_id) {
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }
  const result = await poseProvider.getAge(user_id);
  return res.send(response(baseResponse.SUCCESS, result));
};

// 포즈 삭제
exports.delPose = async function (req, res) {
  // 포즈가 있는지 확인
  const pose_id = req.params.id;
  // 입력한 pose_id가 없을 때
  const poseid_TF = await poseProvider.check_pose_id(pose_id);
  if (poseid_TF.length == 0) {
    return res.send(baseResponse.POSE_ID_NULL);
  }

  const userIdx = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );
  if (!userIdx) {
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }

  // 클래스 작성자와 지우려는 사람의 아이디가 같은지 확인.
  // const writer_id = await classProvider.getClassWriterByClassId(id); // class_id로 class 작성자 id 가져와서 비교
  // if(userIdx != writer_id[0].user_id){
  //   return res.send(baseResponse.CLASS_DELETE_ONLY_WRITER);
  // }
  // 포즈 작성자와 지우려는 사람의 아이디가 같은지 확인
  const writer_id = await poseProvider.getPoseWriterByPoseId(pose_id);
  if (userIdx != writer_id[0].user_id) {
    return res.send(baseResponse.POSE_DELETE_ONLY_WRITER);
  }

  //const images= await classProvider.getImagesUrlByClassId(id);
  const result = await poseService.deletePoseWrite(pose_id);
  return res.send(result);
};

// 연령대별 - 최신 순
exports.ageNewest = async function (req, res) {
  const user_id = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );
  if (!user_id) {
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }
  const result = await poseProvider.ageNewest(user_id);
  return res.send(response(baseResponse.SUCCESS, result));
};

// 연령대별 - 인기 순
exports.agePopular = async function (req, res) {
  const user_id = await userProvider.getIdx_by_user_id(
    req.verifiedToken.userId
  );
  if (!user_id) {
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }
  const result = await poseProvider.agePopular(user_id);
  return res.send(response(baseResponse.SUCCESS, result));
};
