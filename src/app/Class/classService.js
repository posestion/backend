const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const classProvider = require("./classProvider");
const classDao = require("./classDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");
const { imageUploader, allowedExtensions } = require("../../../config/imageUploader");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");
const {deleteImageFromS3} = require("../../../config/imageUploader");


exports.createClass = async function (
  title,content,user_id,images,date,tags
) {
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    var class_id= await classDao.createClass(connection,title,content,user_id,date); // class 추가하고, 이미지 추가를 위해 class 고유 id를 받아옴.
    class_id = class_id[0][0].id;
    await classDao.createImages(connection,class_id,images);
    await classDao.createTag(connection,class_id,tags);
    connection.release();
    return response(baseResponse.SUCCESS);
  }catch(err){
    logger.error(`App - createClass Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

exports.createClassReview =async function(class_id , score, text, userIdx , date){
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    await classDao.createClassReview(connection, class_id , score, text, userIdx , date);
    connection.release();
    return response(baseResponse.SUCCESS);
  }catch(err){
    logger.error(`App - createClassReview Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

exports.deleteReview = async function(user_id, class_id){
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    await classDao.deleteReview(connection, user_id, class_id);
    connection.release();
    return response(baseResponse.SUCCESS);
  }catch(err){
    logger.error(`App - createClassReview Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

exports.deleteClass= async function(class_id,images){
  const separator = 'posestion-bucket.s3.us-east-1.amazonaws.com/';
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    await classDao.deleteClass(connection,class_id);
    connection.release();
    for(i=0;i<images.length;i++){
        // 문자열에서 구분자(separator)를 기준으로 자르기
        var index = (images[i].image_url).indexOf(separator);
        var result = (images[i].image_url).slice(index + separator.length);
        await deleteImageFromS3(result);
    }
    return response(baseResponse.SUCCESS);
  }catch(err){
    logger.error(`App - deleteClass Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}