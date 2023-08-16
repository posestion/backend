const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const boardDao = require("./boardDao");

// 홈 화면 - 광고 배너
exports.getAd = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await boardDao.getAd(connection);
  connection.release();
  return result;
};

// 홈 화면 - 수강중인 강의
exports.taking_lecture = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await boardDao.takingLecture(connection, userIdx);
  connection.release();
  return result;
};

// hot한 강의 불러오기
exports.getHotLec = async function (user_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await boardDao.hotLecGet(connection, user_id);
  connection.release();
  return result;
};

// 게시판 - 이사잘
exports.getPhotoWell = async function (user_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await boardDao.getWellPhoto(connection, user_id);
  connection.release();
  return result;
};

// 게시판 - 클래스
exports.getClass = async function (user_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await boardDao.getClass(connection, user_id);
  return result;
};

// 클래스 - 요즘 HOT한 강의
exports.getHotClass = async function (user_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await boardDao.getHotClass(connection, user_id);
  connection.release();
  return result;
};

// 클래스 - 내가 찜한 강의
exports.getDibs = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await boardDao.getDibs(connection, userIdx);
  connection.release();
  return result;
};

// 10초 사진 - 프로필 사진 불러오기
exports.getProfileImg = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await boardDao.getProfileImg(connection, userIdx);
  connection.release();
  return result;
};

// 10초 사진 - 상세
exports.tensPhotoDetail = async function (id, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await boardDao.tensPhotoDetail(connection, id, userIdx);
  connection.release();
  return result;
};

// 10초 사진 - 게시판에 띄우기
exports.getAllTensPhoto = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await boardDao.getAllTensPhoto(connection);
  connection.release();
  return result;
};
