//
const jwtMiddleware = require("../../../config/jwtMiddleware");
const wdytProvider = require("../../app/WhatDoYouThink/wdytProvider");
const wdytService = require("../../app/WhatDoYouThink/wdytService");
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


exports.createWdyt = async function (req, res){
  const {
    title,
    content
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

  // 필수 정보가 누락된 경우
  if(!title){
    await deleteImages(req.files);
    return res.send(baseResponse.CLASS_POST_REQUIRED_INFO_MISSING_ERROR); //"필수 정보가 누락 되었습니다. 제목을 입력해 주세요."
  }

  // 현재 날짜와 시간을 DATETIME 형식의 문자열로 생성 -> 변수에 담음
  const date = await moment().format('YYYY-MM-DD HH:mm:ss');
  
  const response = await wdytService.createWdyt(
    title,content,userIdx,images,date
  );
  return res.send(response);
};

exports.addLike = async function (req, res){
  const id=req.params.id;
  
  // 게시물이 있는지 확인
  const isExist = await wdytProvider.getWdytIsExist(id);
  if(isExist.length <=0){
    return res.send(baseResponse.WDYT_NOT_EXISTS);
  }

  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }

  const publicAndWriter=await wdytProvider.getPublic(id);
  if(!publicAndWriter[0].public){
      return res.send(baseResponse.privateContentError);
  }

  // 이미 좋아요 한건지 확인
  const checkAlreadyLike= await wdytProvider.checkAlreadyLike(userIdx,id);
  if(checkAlreadyLike.length>0){
    return res.send(baseResponse.WDYT_LIKE_ERROR);//"이미 찜한 게시물 입니다."
  }

  

  // 보류!!
  // // 작성자와 찜하려는 사람 같은지 확인 -> 같은면 찜 불가
  // const writer_id = await classProvider.getClassWriterByClassId(id);
  // if(writer_id[0].user_id == userIdx){
  //   return res.send(baseResponse.CLASS_WRITER_CANT_ADD_DIBS); // "작성자는 본인이 게시한 클래스를 찜할 수 없습니다."
  // }


  // 찜 하기
  await wdytService.addLike(userIdx,id);
  return res.send(baseResponse.SUCCESS);
}

exports.cancelLike = async function (req,res){
  const id=req.params.id;
  
  // 게시글이 있는지 확인
  const isExist = await wdytProvider.getWdytIsExist(id);
  if(isExist.length <=0){
    return res.send(baseResponse.WDYT_NOT_EXISTS);
  }

  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }

  // 좋아요하지 않았던건지 확인
  const checkAlreadyDibs= await wdytProvider.checkAlreadyLike(userIdx,id);
  if(checkAlreadyDibs.length<=0){
    return res.send(baseResponse.WDYT_CANCEL_LIKE_ERROR);// 좋아요 하지 않았던 게시글입니다.
  }

  // 좋아요 취소하기
  await wdytService.cancelLike(userIdx,id);
  return res.send(baseResponse.SUCCESS);

}

// 댓글 달기
exports.addComment = async  function (req,res){
  const id=req.params.id; 
  const {commentParentId} = req.query;
  const {content} = req.body;

   // 게시글이 있는지 확인
   const isExist = await wdytProvider.getWdytIsExist(id);
   if(isExist.length <=0){
    return res.send(baseResponse.WDYT_NOT_EXISTS);
   }

  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }


  // 그냥 대댓글인 경우, commentParentId 댓글이 있는지 확인.
  if(commentParentId){
    const isCommentExist = await wdytProvider.getWdytCommentIsExists(commentParentId);
    // 게시글 id, 부모 아이디랑 일치하는 댓글 있는지 확인
    if(isCommentExist.length <=0 || isCommentExist[0].board_WhatDoYouThink_id != id){
      return res.send(baseResponse.WDYT_FIND_PARENTCOMMENT_ERROR);
    }

  }

  // 현재 날짜와 시간을 DATETIME 형식의 문자열로 생성 -> 변수에 담음
  const date = await moment().format('YYYY-MM-DD HH:mm:ss');

  const result = await wdytService.addComment(userIdx,id,commentParentId,content,date);
  return res.send(result);

}

exports.addCommentLike = async  function (req,res){
  const id=req.params.id; 


  // 댓글이 있는지 확인
  const isCommentExist = await wdytProvider.getWdytCommentIsExists(id);
  if(isCommentExist.length <=0){
      return res.send(baseResponse.WDYT_COMMENT_NOT_EXIST);// 좋아요할 댓글을 찾을 수 없습니다.
  }

  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }

  // 이미 좋아요 한건지 확인
  const checkAlreadyCommentLike= await wdytProvider.checkAlreadyCommentLike(userIdx,id);
  if(checkAlreadyCommentLike.length>0){
    return res.send(baseResponse.WDYT_COMMENT_LIKE_ERROR);//"이미 좋아요한 댓글 입니다."
  }

  const result = await wdytService.addCommentLike(userIdx,id);
  return res.send(result);

}

exports.cancelCommentLike = async  function (req,res){
  const id=req.params.id; 

  // 댓글이 있는지 확인
  const isCommentExist = await wdytProvider.getWdytCommentIsExists(id);
  if(isCommentExist.length <=0){
      return res.send(baseResponse.WDYT_COMMENT_NOT_EXIST);
  }

  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }

  // 좋아요하지 않았던건지 확인
  const checkAlreadyCommentLike= await wdytProvider.checkAlreadyCommentLike(userIdx,id);
  if(checkAlreadyCommentLike.length<=0){
    return res.send(baseResponse.WDYT_COMMENT_CANCEL_LIKE_ERROR); // "좋아요 하지 않았던 댓글입니다."
  }

  const result = await wdytService.cancelCommentLike(userIdx,id);
  return res.send(result);
}

exports.getDetailPage =  async function (req,res){

  const id=req.params.id; 

  // 게시글이 있는지 확인
  const isExist = await wdytProvider.getWdytIsExist(id);
  if(isExist.length <=0){
    return res.send(baseResponse.WDYT_NOT_EXISTS);
  }

   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
   if(!userIdx){
     return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
   }

  // public이 아닌경우 본인만 액세스 가능 -> public 여부 가져오기
  const publicAndWriter=await wdytProvider.getPublic(id);
  if(!publicAndWriter[0].public){
    if(publicAndWriter[0].user_id != userIdx){
      return res.send(baseResponse.privateContentError);
    }
  }


  const result = await wdytProvider.getDetailPage(userIdx,id);
  return res.send(response(baseResponse.SUCCESS,result));

}

exports.getPage = async function (req,res){
  
  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }

  const result = await wdytProvider.getPage(userIdx);
  return res.send(response(baseResponse.SUCCESS,result));

}

exports.deleteComment= async function(req,res){
  const id= req.params.id;
  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }

  const publicAndWriter=await wdytProvider.getPublic(id);
  if(!publicAndWriter[0].public){
     return res.send(baseResponse.privateContentError);
  }

  // 댓글이 있는지 확인
  const isCommentExist = await wdytProvider.getWdytCommentIsExists(id);
  if(isCommentExist.length <=0){
      return res.send(baseResponse.WDYT_COMMENT_NOT_EXIST);
  }

  //내가 쓴 댓글인지 확인
  const writer = await wdytProvider.getCommentWriterIdx(id);
  console.log(writer[0].user_id);
  if(writer[0].user_id!=userIdx){
    return res.send(baseResponse.WDYT_COMMENT_DELETE_ERROR);
  }

  //삭제
  const result = await wdytService.deleteComment(id);
  return res.send(result);
}

exports.getSearchPage = async function(req,res){
  // 사용자 user_id 로 id 가져오기 -> 변수에 저장
  const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
  if(!userIdx){
    return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
  }

  //console.log(req.query.content.split(" "));
  const content = req.query.content;
  const result = await wdytProvider.getSearchPage(userIdx,content);
  return res.send(response(baseResponse.SUCCESS,[{"count":result.length},result]));
}

exports.deleteWdyt = async function(req,res){
  const id=req.params.id; 

  // 게시글이 있는지 확인
  const isExist = await wdytProvider.getWdytIsExist(id);
  if(isExist.length <=0){
    return res.send(baseResponse.WDYT_NOT_EXISTS);
  }

   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
   if(!userIdx){
     return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
   }

  // 게시글 작성자와 지우려는 사람의 아이디가 같은지 확인.
  const writer_id = await wdytProvider.getWdytWriterIdx(id); // class_id로 class 작성자 id 가져와서 비교
  if(userIdx != writer_id[0].user_id){
    return res.send(baseResponse.WDYT_DELETE_ONLY_WRITER); 
  }
  const images= await wdytProvider.getImagesUrlByWdytId(id);
  const result = await wdytService.deleteWdyt(id,images);
  return res.send(result);
}

//store
exports.store = async function(req,res){
  const id=req.params.id; 

  // 게시글이 있는지 확인
  const isExist = await wdytProvider.getWdytIsExist(id);
  if(isExist.length <=0){
    return res.send(baseResponse.WDYT_NOT_EXISTS);
  }

   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
   if(!userIdx){
     return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
   }

  // 본인 게시물인지
  const writer_id = await wdytProvider.getWdytWriterIdx(id); // class_id로 class 작성자 id 가져와서 비교
  if(userIdx != writer_id[0].user_id){
    return res.send(baseResponse.NotYourContent); 
  }
  // public이 아닌경우 본인만 액세스 가능 -> public 여부 가져오기
  const publicAndWriter=await wdytProvider.getPublic(id);
  if(!publicAndWriter[0].public){
    return res.send(baseResponse.AlreadyStore);
  }
  await wdytProvider.store(id);
  return res.send(baseResponse.SUCCESS);
}
//takeOut
exports.takeOut = async function(req,res){
  const id=req.params.id; 

  // 게시글이 있는지 확인
  const isExist = await wdytProvider.getWdytIsExist(id);
  if(isExist.length <=0){
    return res.send(baseResponse.WDYT_NOT_EXISTS);
  }

   // 사용자 user_id 로 id 가져오기 -> 변수에 저장
   const userIdx = await userProvider.getIdx_by_user_id(req.verifiedToken.userId);
   if(!userIdx){
     return res.send(baseResponse.FIND_USER_ERROR); //"사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요."
   }

  // 본인 게시물인지
  const writer_id = await wdytProvider.getWdytWriterIdx(id); // class_id로 class 작성자 id 가져와서 비교
  if(userIdx != writer_id[0].user_id){
    return res.send(baseResponse.NotYourContent); 
  }
  // public이 아닌경우 본인만 액세스 가능 -> public 여부 가져오기
  const publicAndWriter=await wdytProvider.getPublic(id);
  if(publicAndWriter[0].public){
    return res.send(baseResponse.NotStore);
  }
  await wdytProvider.takeOut(id);
  return res.send(baseResponse.SUCCESS);
}