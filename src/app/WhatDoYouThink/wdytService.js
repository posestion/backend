const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const wdytProvider = require("./wdytProvider");
const wdytDao = require("./wdytDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");
const { imageUploader, allowedExtensions } = require("../../../config/imageUploader");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");
const {deleteImageFromS3} = require("../../../config/imageUploader");

exports.createWdyt = async function (
  title,content,userIdx,images,date
) {
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    var wdyt_id= await wdytDao.createWdyt(connection,title,content,userIdx,date); // 게시글 추가하고, 고유 id 받아옴.
    wdyt_id = wdyt_id[0][0].id;
    console.log("이사잘 id : "+wdyt_id);
    await wdytDao.createImages(connection,wdyt_id,images);
    //await wdytDao.createTag(connection,class_id,tags);
    connection.release();
    return response(baseResponse.SUCCESS);
  }catch(err){
    logger.error(`App - createWdyt Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}
exports.addLike = async function(userIdx,id){
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await wdytDao.addLike(connection,userIdx,id);
    connection.release();
    //return result;
    return response(baseResponse.SUCCESS);
  }catch(err){
    logger.error(`App - addLike Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}
exports.cancelLike = async function(userIdx,id){
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await wdytDao.cancelLike(connection,userIdx,id);
    connection.release();
    //return result;
    return response(baseResponse.SUCCESS);
  }catch(err){
    logger.error(`App - cancelLike Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

exports.addComment = async function(userIdx,id,commentParentId,content,date){
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await wdytDao.addComment(connection,userIdx,id,commentParentId,content,date);
    connection.release();
    return response(baseResponse.SUCCESS);
  }catch(err){
    logger.error(`App - addComment Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

exports.addCommentLike = async function (userIdx,id){
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await wdytDao.addCommentLike(connection,userIdx,id);
    connection.release();
    return response(baseResponse.SUCCESS);
  }catch(err){
    logger.error(`App - addCommentLike Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

exports.cancelCommentLike = async function(userIdx,id){
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await wdytDao.cancelCommentLike(connection,userIdx,id);
    connection.release();
    return response(baseResponse.SUCCESS);
  }catch(err){
    logger.error(`App -  cancelCommentLike error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}

exports.deleteComment = async function (id){
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await wdytDao.deleteComment(connection,id);
    connection.release();
    return response(baseResponse.SUCCESS);
  }catch(err){
    logger.error(`App -  deleteComment error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}
 