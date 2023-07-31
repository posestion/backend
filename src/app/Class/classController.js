const jwtMiddleware = require("../../../config/jwtMiddleware");
const classProvider = require("../../app/Class/classProvider");
const classService = require("../../app/Class/classService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const { imageUploader } = require("../../../config/imageUploader");
const multer = require("multer");
const moment = require('moment');
const userProvider = require("../../app/User/userProvider");
const {deleteImageFromS3} = require("../../../config/imageUploader");

// 이미지 지우기
async function deleteImages(images){
  for(i=0;i<images.length;i++){ await (deleteImageFromS3(images[i].key));}
}
exports.createClass = async function (req, res){
  const {
    title,
    content,
    tags 
  } = await req.body;

  //이미지 파일 경로 -> 변수에 담음
  var images=[];
  for(i=0;i<req.files.length;i++){
    images[i]=req.files[i].location
  }
  
  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
    await deleteImages(req.files);
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }

  //전문가 여부 확인 -> 전문가가 아니면 게시 불가.
  const userIsExpert = await userProvider.getIsExpert(userIdx);
  if(!userIsExpert){
    await deleteImages(req.files);
    return res.send(baseResponse.USER_IS_NOT_EXPERT); // "전문가가 아니기 때문에 클래스를 올릴 수 없습니다.",
  }

  // 필수 정보가 누락된 경우
  if(!title){
    await deleteImages(req.files);
    return res.send(baseResponse.CLASS_POST_REQUIRED_INFO_MISSING_ERROR); //"필수 정보가 누락 되었습니다. 제목과 내용을 모두 입력해 주세요."
  }

  // 현재 날짜와 시간을 DATETIME 형식의 문자열로 생성 -> 변수에 담음
  const date = await moment().format('YYYY-MM-DD HH:mm:ss');
  
  const response = await classService.createClass(
    title,content,userIdx,images,date,tags
  );
  return res.send(response);
}

exports.getClass  = async function (req, res){
  const id=req.params.id;
  
  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);

  if(!userIdx){
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }

  const isExist = await classProvider.getClassIsExist(id);
  if(isExist.length <=0){
    return res.send(baseResponse.CLASS_NOT_EXIST); //"해당 게시물이 없습니다."
  }

  const result = await classProvider.getClass(id,userIdx);
  return res.send(response(baseResponse.SUCCESS,result));
}

exports.addDibs = async function (req,res){
  const id=req.params.id;
  
  // 클래스가 있는지 확인
  const isExist = await classProvider.getClassIsExist(id);
  if(isExist.length <=0){
    return res.send(baseResponse.CLASS_NOT_EXIST);
  }

  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }

  // 이미 찜 한건지 확인
  const checkAlreadyDibs= await classProvider.checkAlreadyDibs(userIdx,id);
  if(checkAlreadyDibs.length>0){
    return res.send(baseResponse.CLASS_ALREADY_DIBS);//"이미 찜한 게시물 입니다."
  }

  // 작성자와 찜하려는 사람 같은지 확인 -> 같은면 찜 불가
  const writer_id = await classProvider.getClassWriterByClassId(id);
  if(writer_id[0].user_id == userIdx){
    return res.send(baseResponse.CLASS_WRITER_CANT_ADD_DIBS); // "작성자는 본인이 게시한 클래스를 찜할 수 없습니다."
  }
  // 찜 하기
  await classProvider.addDibs(userIdx,id);
  return res.send(baseResponse.SUCCESS);
}

exports.cancelDibs = async function (req,res){
  const id=req.params.id;
  
  // 클래스가 있는지 확인
  const isExist = await classProvider.getClassIsExist(id);
  if(isExist.length <=0){
    return res.send(baseResponse.CLASS_NOT_EXIST);
  }

  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }

  // 이미 찜하지 않았던건지 확인
  const checkAlreadyDibs= await classProvider.checkAlreadyDibs(userIdx,id);
  if(checkAlreadyDibs.length<=0){
    return res.send(baseResponse.CLASS_DIDNT_DIBS); // "찜 하지 않았던 게시물 입니다."
  }

  // 찜 취소하기
  await classProvider.cancelDibs(userIdx,id);
  return res.send(baseResponse.SUCCESS);

}

exports.postReview = async function (req,res){
  const class_id = req.params.id;
  const { score, text } = await req.body;
  if(!score || !text){
    res.send(baseResponse.CLASS_REVIEW_POST_REQUIRED_INFO_MISSING_ERROR);//"점수, 리뷰글 모두 작성해주세요."
  }

  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }

  // 클래스가 있는지 확인
  const isExist = await classProvider.getClassIsExist(class_id);
  if(isExist.length <= 0){
    return res.send(baseResponse.CLASS_NOT_EXIST);
  }

  // 작성자는 리뷰 못쓰도록
  const writer_id = await classProvider.getClassWriterByClassId(class_id); // class_id로 class 작성자 id 가져와서 비교
  if(userIdx == writer_id[0].user_id){
    return res.send(baseResponse.CLASS_WRITER_CANT_POST_REVIEW); //"작성자는 리뷰를 쓸 수 없습니다."
  }

  // 리뷰를 이미 쓴 적이 있는지 확인 !! 
  const x = await classProvider.getClassReviewByUserIdAndClassId(userIdx,class_id);
  if(x.length > 0){
    return res.send(baseResponse.CLASS_REVIEW_POST_ONLY_ONE_REVIEW_PER_CLASS);//"리뷰는 클래스당 하나씩만 작성 가능합니다."
  }

  // score이 1~5점인지 화인
  if(score <1 || score > 5){
    return res.send(baseResponse.CLASS_REVIEW_SCORE_BOUND_ERROR); //점수는 1~5점 사이로 입력해주세요.
  }

  // 날짜 생성
  const date = await moment().format('YYYY-MM-DD HH:mm:ss');

  const response = await classService.createClassReview(
    class_id , score, text, userIdx , date
  );

  return res.send(response);
}

exports.deleteReview = async function (req,res){
  const class_id = req.params.id;
  
  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }
  
  // 클래스가 있는지 확인
  const isExist = await classProvider.getClassIsExist(class_id);
  if(isExist.length <= 0){
    return res.send(baseResponse.CLASS_NOT_EXIST);
  }


  // // 해당 리뷰를 내가 쓴게 맞는지 확인
  // const x= await classProvider.getReviewWriterIdByReviewId(review_id);
  // //console.log()
  // if(x[0].user_id != userIdx){
  //   return res.send("너가 쓴게 아님.");
  // }

  // 내가 해당 클래스에 리뷰를 쓴 적이 있는지 확인
  const x= await classProvider.getClassReviewByUserIdAndClassId(userIdx,class_id);
  if(x.length <= 0){
    return res.send(baseResponse.CLASS_REVIEW_REVEIW_NOT_FOUND_ERROR);//"리뷰가 찾을 수 없습니다."
  }

  // 내가 쓴 리뷰 삭제
  const result=  await classService.deleteReview(userIdx,class_id);
  return res.send(result);

}


exports.getHotClass = async function (req,res){
    // 사용자 user_id 로 id 가져오기 -> 변수에 저장
    const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
    if(!userIdx){
      return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
    }
    const result = await classProvider.getHotClass(userIdx);
    return res.send(response(baseResponse.SUCCESS,result));
}

exports.getDrawer = async function (req,res){
  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }
  const result = await classProvider.getDrawer(userIdx);
  return res.send(response(baseResponse.SUCCESS,result));

}

exports.getMyClass = async function (req,res){

  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }

  const result = await classProvider.getMyClass(userIdx);
  return res.send(response(baseResponse.SUCCESS,result));
}

exports.getMyDibs = async function(req,res){
    // 사용자 user_id 로 id 가져오기 -> 변수에 저장
    const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
    if(!userIdx){
      return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
    }
    const result = await classProvider.getMyDibs(userIdx);
    return res.send(response(baseResponse.SUCCESS,result));
}


exports.deleteClass = async function(req,res){
  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const id= req.params.id;

    // 클래스가 있는지 확인
    const isExist = await classProvider.getClassIsExist(id);
    if(isExist.length <=0){
      return res.send(baseResponse.CLASS_NOT_EXIST);
    }

  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }



  // 클래스 작성자와 지우려는 사람의 아이디가 같은지 확인.
  const writer_id = await classProvider.getClassWriterByClassId(id); // class_id로 class 작성자 id 가져와서 비교
  if(userIdx != writer_id[0].user_id){
    return res.send(baseResponse.CLASS_DELETE_ONLY_WRITER); 
  }

  const images= await classProvider.getImagesUrlByClassId(id);
  const result = await classService.deleteClass(id,images);
  return res.send(result);
}





// // 좋아요 하기
// exports.addLike = async function (req,res){
//   const id=req.params.id;
  
//   // 클래스가 있는지 확인
//   const isExist = await classProvider.getClassIsExist(id);
//   if(isExist.length <=0){
//     return res.send(baseResponse.CLASS_NOT_EXIST);
//   }

//   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
//   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
//   if(!userIdx){
//     return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
//   }

//   // 이미 좋아요 한건지 확인
//   const checkAlreadyLike= await classProvider.checkAlreadyLike(userIdx,id);
//   if(checkAlreadyLike.length>0){
//     return res.send("이미 좋아요 함");
//   }

//   // 좋아요 하기
//   await classProvider.addLike(userIdx,id);
//   return res.send("좋아요 !");
// }

// exports.cancelLike =  async function (req,res){
//   const id=req.params.id;
  
//   // 클래스가 있는지 확인
//   const isExist = await classProvider.getClassIsExist(id);
//   if(isExist.length <=0){
//     return res.send(baseResponse.CLASS_NOT_EXIST);
//   }

//   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
//   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);

//   // 이미 좋아요 한건지 확인
//   const checkAlreadyLike= await classProvider.checkAlreadyLike(userIdx,id);
//   if(checkAlreadyLike.length<=0){
//     return res.send("좋아요 하지 않았었음");
//   }

//   // 좋아요 취소 하기
//   await classProvider.cancelLike(userIdx,id);
//   return res.send("좋아요 취소");

// }