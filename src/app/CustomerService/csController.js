const jwtMiddleware = require("../../../config/jwtMiddleware");
const csProvider = require("../../app/CustomerService/csProvider");
const csService = require("../../app/CustomerService/csService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const { imageUploader } = require("../../../config/imageUploader");
const multer = require("multer");
const moment = require("moment");
const userProvider = require("../../app/User/userProvider");
const {deleteImageFromS3} = require("../../../config/imageUploader");

// 이미지 지우기
async function deleteImages(images){
  for(i=0;i<images.length;i++){ await (deleteImageFromS3(images[i].key));}
}

exports.createInquiry = async function (req, res){
  const {
    title,content
  } = await req.body;

  //이미지 파일 경로 -> 변수에 담음
  var files=[];
  for(i=0;i<req.files.length;i++){
    files[i]=req.files[i].location
  }
  
  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
    await deleteImages(req.files);
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }


  // 필수 정보가 누락된 경우
  if(!title){
    await deleteImages(req.files);
    return res.send(baseResponse.CLASS_POST_REQUIRED_INFO_MISSING_ERROR); //"필수 정보가 누락 되었습니다. 제목과 내용을 모두 입력해 주세요."
  }

  // 현재 날짜와 시간을 DATETIME 형식의 문자열로 생성 -> 변수에 담음
  const date = await moment().format('YYYY-MM-DD HH:mm:ss');
  
  const response = await csService.createInquiry(
    title,content,date,userIdx,files
  );
  return res.send(response);
};
//getInquiry
exports.getInquiry = async function (req, res){
  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
    await deleteImages(req.files);
     return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }
  const result = await csProvider.getInquiry(
    userIdx
  );
  return res.send(response(baseResponse.SUCCESS,result));
}