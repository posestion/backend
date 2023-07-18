const jwtMiddleware = require("../../../config/jwtMiddleware");
const classProvider = require("../../app/Class/classProvider");
const classService = require("../../app/Class/classService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const { imageUploader } = require("../../../config/imageUploader");
const multer = require("multer");
const moment = require('moment');
const userProvider = require("../../app/User/userProvider");

exports.createClass = async function (req, res){
  const {
    title,
    content,
    tags 
  } = await req.body;
  
  
  const user_idx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId); //


  var images=[];
  for(i=0;i<req.files.length;i++){
    images[i]=req.files[i].location
  }

  // 현재 날짜와 시간을 DATETIME 형식의 문자열로 생성
  const date = await moment().format('YYYY-MM-DD HH:mm:ss');

  // 필수 정보가 누락된 경우
  if(!title || !content || !user_idx ){
    return res.send("필수 정보가 누락 되었습니다."); // 이건 나중에 수정할 예정
  }

  const response = await classService.createClass(
   title,content,user_idx,images,date,tags
  );

  return res.send(response);
}

exports.getClass  = async function (req, res){
  const id=req.params.id;
  const response = await classProvider.getClass(id);
  return res.send(response);
}