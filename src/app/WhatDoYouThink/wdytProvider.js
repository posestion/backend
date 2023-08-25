const { ExpressionType } = require("@aws-sdk/client-s3");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const wdytDao = require("./wdytDao");

exports.getWdytIsExist = async function (id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await wdytDao.getWdytIsExist(connection, id);
  connection.release();
  return result;
}

exports.checkAlreadyLike = async function(userIdx,id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await wdytDao.checkAlreadyLike(connection, userIdx,id);
  connection.release();
  return result;
}

exports.getWdytCommentIsExists = async function(id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await wdytDao.getWdytCommentIsExists(connection, id);
  connection.release();
  return result;
}

exports.checkAlreadyCommentLike = async function(userIdx,id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await wdytDao.checkAlreadyCommentLike(connection,userIdx, id);
  connection.release();
  return result;
}

exports.getDetailPage = async function(userIdx,id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await wdytDao.getDetailPage(connection,userIdx, id);
  connection.release();
  return result;
}

exports.getPage = async function(userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await wdytDao.getPage(connection,userIdx);
  connection.release();
  return result;
}
//getCommentWriterIdx
exports.getCommentWriterIdx = async function(id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await wdytDao.getCommentWriterIdx(connection,id);
  connection.release();
  return result;
}

exports.getWdytWriterIdx = async function(id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await wdytDao.getWdytWriterIdx(connection,id);
  connection.release();
  return result;
}

exports.getImagesUrlByWdytId = async function(id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await wdytDao.getImagesUrlByWdytId(connection,id);
  connection.release();
  return result;
}

exports.getSearchPage = async function(useridx,content){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await wdytDao.getSearchPage(connection,useridx,content);
  connection.release();
  return result;
}

//getPublic
exports.getPublic = async function(id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await wdytDao.getPublic(connection,id);
  connection.release();
  return result;
}

//store
exports.store = async function(id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await wdytDao.store(connection,id);
  connection.release();
  return result;
}

//takeOut
exports.takeOut = async function(id){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await wdytDao.takeOut(connection,id);
  connection.release();
  return result;
}