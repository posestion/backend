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
//getUserProfile
exports.getUserProfile = async function(userIdx,profileIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await profileDao.getUserProfile(connection,userIdx,profileIdx);
  connection.release();
  return result;
}