const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const poseDao = require("./poseDao");
const poseService = require("./poseService");

// 테이블에 pose_id 있나 확인
exports.check_pose_id = async function (pose_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await poseDao.pose_id_check(connection, pose_id);
  connection.release();
  return result;
};
// 장바구니 중복 저장하려고 하는지
exports.readIds = async function (user_idx, pose_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await poseDao.repeatPose(connection, user_idx, pose_id);
  connection.release();
  return result;
};

// 즐겨찾기 중복 저장하려고 하는지
exports.fav_readIds = async function (user_idx, pose_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await poseDao.fav_repeatPose(connection, user_idx, pose_id);
  connection.release();
  return result;
};

// 포즈 상세페이지
exports.getDetailpose = async function (id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const detail = await poseDao.poseDetail(connection, id);
  // tag 조회
  const tags = await poseDao.Tag(connection, id);
  // 조회수(view) 조회
  console.log(detail[0]["view"]);

  console.log(tags);

  connection.release();
  return [detail, tags];
};

// 포즈 장바구니
exports.basketAll = async function (user_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  // Pose_basket에서 장바구니에 저장된 pose_id 불러오기
  const pose_id = await poseDao.poseBasket(connection, user_id);
  console.log(pose_id);
  // 불러온 pose_id로 Pose_write에서 게시글 정보 가져오기
  const write_result = await poseDao.savedPose(connection, pose_id);
  connection.release();
  return write_result;
};

// 포즈상점 전체 보기
exports.allStore = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await poseDao.storeAll(connection);
  connection.release();
  return result;
};

// 검색
exports.searchWord = async function (word) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await poseDao.search(connection, word);
  connection.release();
  return result;
};

// 즐겨찾기 조회(좋아요 게시판)
exports.favView = async function (user_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await poseDao.favoritesView(connection, user_id);
  connection.release();
  return result;
};

// hot 게시판 조회
exports.viewHot = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await poseDao.viewHotboard(connection);
  connection.release();
  return result;
};

// 필터(인기순) 조회
exports.filpop = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await poseDao.filpopular(connection);
  connection.release();
  return result;
};

// 필터(최신순) 조회
exports.fildate = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await poseDao.filterDate(connection);
  connection.release();
  return result;
};

// 장바구니에 입력한 pose_id 있나 확인
exports.check_basket_pose = async function (pose_id, user_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await poseDao.basket_pose_check(connection, pose_id, user_id);
  connection.release();
  return result;
};

// 즐겨찾기에 입력한 pose_id 있나 확인
exports.check_fav_pose = async function (pose_id, user_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await poseDao.fav_pose_check(connection, pose_id, user_id);
  connection.release();
  return result;
};
