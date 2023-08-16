const { ExpressionType } = require("@aws-sdk/client-s3");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const classDao = require("./classDao");

// 상세정보
exports.getClass = async function (id,userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.getClass(connection, id,userIdx);
  connection.release();
  return result;
};

exports.getClassIsExist = async function (id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.getClassIsExist(connection, id);
  connection.release();
  return result;
}

// 좋아요 되어 있는건지 
exports.checkAlreadyLike = async function (userIdx, id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.checkAlreadyLike(connection,userIdx,id);
  connection.release();
  return result;
}

// 찜 되어 있는지
exports.checkAlreadyDibs = async function (userIdx, id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.checkAlreadyDibs(connection,userIdx,id);
  connection.release();
  return result;
}

// 이미 수강중인 건지
exports.checkAlreadyRegister = async function (userIdx, id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.checkAlreadyRegister(connection,userIdx,id);
  connection.release();
  return result;
}
exports.addLike = async function(userIdx,id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.addLike(connection,userIdx,id);
  connection.release();
  return result;
}

exports.cancelLike = async function(userIdx,id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.cancelLike(connection,userIdx,id);
  connection.release();
  return result;
}


exports.addDibs = async function(userIdx,id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.addDibs(connection,userIdx,id);
  connection.release();
  return result;
}

exports.cancelDibs = async function(userIdx,id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.cancelDibs(connection,userIdx,id);
  connection.release();
  return result;
}

exports.addRegister = async function(userIdx,id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.addRegister(connection,userIdx,id);
  connection.release();
  return result;
}



exports.getClassWriterByClassId = async function(class_id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.getClassWriterByClassId(connection,class_id);
  connection.release();
  return result;
}

exports.getClassReviewByUserIdAndClassId = async function(user_id,clss_id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.getClassReviewByUserIdAndClassId(connection,user_id,clss_id);
  connection.release();
  return result;
}

exports.getHotClass = async function(userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.getHotClass(connection,userIdx);
  connection.release();
  return result;
}

exports.getDrawer = async function (userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.getDrawer(connection,userIdx);
  connection.release();
  return result;
}

exports.getMyClass = async function(userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.getMyClass(connection,userIdx);
  connection.release();
  return result;
}

exports.getMyDibs = async function(userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.getMyDibs(connection,userIdx);
  connection.release();
  return result;
}


exports.getReviewWriterIdByReviewId= async function(review_id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.getReviewWriterIdByReviewId(connection,review_id);
  connection.release();
  return result;
}

exports.getImagesUrlByClassId = async function(class_id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.getImagesUrlByClassId(connection,class_id);
  connection.release();
  return result;
}

exports.getAllClass = async function(){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.getAllClass(connection);
  connection.release();
  return result;
}

exports.getSearchPage = async function(userIdx,content){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.getSearchPage(connection,userIdx,content);
  connection.release();
  return result;
}
