//getMyPageDrawer
const { pool } = require("../../../config/database");
const profileDao = require("./profileDao");

exports.getMyPageDrawer = async function (userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await profileDao.getMyPageDrawer(connection,userIdx);
  connection.release();
  return result;
}

exports.getLikeWdyt = async function (userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await profileDao.getLikeWdyt(connection,userIdx);
  connection.release();
  return result;
}

exports.getLikePose = async function (userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await profileDao.getLikePose(connection,userIdx);
  connection.release();
  return result;
}

exports.getMyClass= async function (userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await profileDao.getMyClass(connection,userIdx);
  connection.release();
  return result;
}

exports.getMyContent = async function(userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await profileDao.getMyContent(connection,userIdx);
  connection.release();
  return result;
}
//getMyContentWdyt
exports.getMyContentWdyt = async function(userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await profileDao.getMyContentWdyt(connection,userIdx);
  connection.release();
  return result;
}
exports.getMyContent10sPhoto = async function(userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await profileDao.getMyContent10sPhoto(connection,userIdx);
  connection.release();
  return result;
}

//getUserClass
exports.getUserClass = async function(userIdx,profileIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await profileDao.getUserClass(connection,userIdx,profileIdx);
  connection.release();
  return result;
}
//getUserContent
exports.getUserContent = async function(userIdx,profileIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await profileDao.getUserContent(connection,userIdx,profileIdx);
  connection.release();
  return result;
}
//getUserContent_wdyt
exports.getUserContent_wdyt = async function(userIdx,profileIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await profileDao.getUserContent_wdyt(connection,userIdx,profileIdx);
  connection.release();
  return result;
}
//getUserContent_10sPhoto
exports.getUserContent_10sPhoto = async function(userIdx,profileIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await profileDao.getUserContent_10sPhoto(connection,userIdx,profileIdx);
  connection.release();
  return result;
}
//getUserProfile
exports.getUserProfile = async function(userIdx,profileIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await profileDao.getUserProfile(connection,userIdx,profileIdx);
  connection.release();
  return result;
}
exports.getMyPage_wdyt = async function(userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await profileDao.getMyPage_wdyt(connection,userIdx);
  connection.release();
  return result;
}
//getMyPage_10sPhoto
exports.getMyPage_10sPhoto = async function(userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await profileDao.getMyPage_10sPhoto(connection,userIdx);
  connection.release();
  return result;
}
//getMyPage_class
exports.getMyPage_class = async function(userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await profileDao.getMyPage_class(connection,userIdx);
  connection.release();
  return result;
}
exports.getMyPage = async function(userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await profileDao.getMyPage(connection,userIdx);
  connection.release();
  return result;
}
exports.getPoseDrawer = async function(userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await profileDao.getPoseDrawer(connection,userIdx);
  connection.release();
  return result;
}