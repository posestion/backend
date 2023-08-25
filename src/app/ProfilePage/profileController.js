const userProvider = require("../User/userProvider");
const profileProvider = require("./profileProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
exports.getMyPageDrawer = async function (req, res){

   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
     return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }
  const result = await profileProvider.getMyPageDrawer(userIdx);
  return res.send(response(baseResponse.SUCCESS,result));

}

exports.getPoseDrawer = async function (req,res){
   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
     return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }
  const result = await profileProvider.getPoseDrawer(userIdx);
  return res.send(response(baseResponse.SUCCESS,result));
}
exports.getLikeWdyt = async function (req, res){
  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
     return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }
  const result = await profileProvider.getLikeWdyt(userIdx);
  return res.send(response(baseResponse.SUCCESS,result));
}
exports.getLikePose = async function (req, res){
   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
   if(!userIdx){
      return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
   }
   const result = await profileProvider.getLikePose(userIdx);
   return res.send(response(baseResponse.SUCCESS,result));
 }

exports.getMyClass = async function (req,res){
   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
   if(!userIdx){
      return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."}
   }
   const result = await profileProvider.getMyClass(userIdx);
   return res.send(response(baseResponse.SUCCESS,result));
}

exports.getMyContent = async function (req,res){
   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
   if(!userIdx){
      return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."}
   }
   const result = await profileProvider.getMyContent(userIdx);
   return res.send(response(baseResponse.SUCCESS,result));
}

exports.getMyContentWdyt = async function(req,res){
   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
   if(!userIdx){
      return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."}
   }
   const result = await profileProvider.getMyContentWdyt(userIdx);
   return res.send(response(baseResponse.SUCCESS,result));
}
//getMyContent10sPhoto
exports.getMyContent10sPhoto = async function(req,res){
   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
   if(!userIdx){
      return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."}
   }
   const result = await profileProvider.getMyContent10sPhoto(userIdx);
   return res.send(response(baseResponse.SUCCESS,result));
}

//getUserClass
exports.getUserClass = async function (req,res){
   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
   if(!userIdx){
      return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."}
   }
   const nickname = req.params.nickname;
   if(!nickname){
      return res.send(baseResponse.PROFILE_FIND_NICKNAME_ERROR);
   }
   // 닉네임으로 idx 가져오기
   const profileIdx = await userProvider.getIdx_by_nickname(nickname);
   if(!profileIdx){
      return res.send(baseResponse.PROFILE_FIND_NICKNAME_ERROR);  //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."}
   }
   const result = await profileProvider.getUserClass(userIdx,profileIdx);
   return res.send(response(baseResponse.SUCCESS,result));
}

//getUserContent
exports.getUserContent = async function (req,res){
   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
   if(!userIdx){
      return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."}
   }
   const nickname = req.params.nickname;
   if(!nickname){
      return res.send(baseResponse.PROFILE_FIND_NICKNAME_ERROR);
   }
   // 닉네임으로 idx 가져오기
   const profileIdx = await userProvider.getIdx_by_nickname(nickname);
   if(!profileIdx){
      return res.send(baseResponse.PROFILE_FIND_NICKNAME_ERROR);  //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."}
   }
   const result = await profileProvider.getUserContent(userIdx,profileIdx);
   return res.send(response(baseResponse.SUCCESS,result));
}

//getUserContent_wdyt
exports.getUserContent_wdyt = async function (req,res){
   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
   if(!userIdx){
      return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."}
   }
   const nickname = req.params.nickname;
   if(!nickname){
      return res.send(baseResponse.PROFILE_FIND_NICKNAME_ERROR);
   }
   // 닉네임으로 idx 가져오기
   const profileIdx = await userProvider.getIdx_by_nickname(nickname);
   if(!profileIdx){
      return res.send(baseResponse.PROFILE_FIND_NICKNAME_ERROR);  //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."}
   }
   const result = await profileProvider.getUserContent_wdyt(userIdx,profileIdx);
   return res.send(response(baseResponse.SUCCESS,result));
}
//getUserContent_10sPhoto
exports.getUserContent_10sPhoto = async function (req,res){
   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
   if(!userIdx){
      return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."}
   }
   const nickname = req.params.nickname;
   if(!nickname){
      return res.send(baseResponse.PROFILE_FIND_NICKNAME_ERROR);
   }
   // 닉네임으로 idx 가져오기
   const profileIdx = await userProvider.getIdx_by_nickname(nickname);
   if(!profileIdx){
      return res.send(baseResponse.PROFILE_FIND_NICKNAME_ERROR);  //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."}
   }
   const result = await profileProvider.getUserContent_10sPhoto(userIdx,profileIdx);
   return res.send(response(baseResponse.SUCCESS,result));
}

//getMyPage_wdyt
exports.getMyPage_wdyt = async function (req,res){
   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
   if(!userIdx){
      return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."}
   }

   const result = await profileProvider.getMyPage_wdyt(userIdx);
   return res.send(response(baseResponse.SUCCESS,result));
}
//getMyPage_10sPhoto
exports.getMyPage_10sPhoto = async function (req,res){
   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
   if(!userIdx){
      return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."}
   }

   const result = await profileProvider.getMyPage_10sPhoto(userIdx);
   return res.send(response(baseResponse.SUCCESS,result));
}
//getMyPage_class
exports.getMyPage_class = async function (req,res){
   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
   if(!userIdx){
      return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."}
   }

   const result = await profileProvider.getMyPage_class(userIdx);
   return res.send(response(baseResponse.SUCCESS,result));
}

//getUserProfile
exports.getUserProfile = async function (req,res){
   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
   if(!userIdx){
      return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."}
   }
   const nickname = req.params.nickname;
   if(!nickname){
      return res.send(baseResponse.PROFILE_FIND_NICKNAME_ERROR);
   }
   // 닉네임으로 idx 가져오기
   const profileIdx = await userProvider.getIdx_by_nickname(nickname);
   if(!profileIdx){
      return res.send(baseResponse.PROFILE_FIND_NICKNAME_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."}
   }
   const result = await profileProvider.getUserProfile(userIdx,profileIdx);
   return res.send(response(baseResponse.SUCCESS,result));
}

//getMyPage
exports.getMyPage = async function (req,res){
   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
   if(!userIdx){
      return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."}
   }

   const result = await profileProvider.getMyPage(userIdx);
   return res.send(response(baseResponse.SUCCESS,result));
}