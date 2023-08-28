const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.user_id_check = async function (user_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await userDao.selectUserId(connection, user_id);
  connection.release();
  return result;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
    connection,
    selectUserPasswordParams
  );
  connection.release();
  await console.log("db");
  await console.log(passwordCheckResult[0]);
  return passwordCheckResult[0];
};
// 중복 id 확인
exports.retrieveRepeatId = async function (id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userIdResult = await userDao.selectRepeatId(connection, id);

  connection.release();

  return userIdResult;
};

// 중복 닉네임 확인
exports.retrieveRepeatName = async function (name) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userNameResult = await userDao.selectRepeatName(connection, name);

  connection.release();

  return userNameResult;
};

// id 찾기
exports.findId = async function (username, phone_num) {
  const connection = await pool.getConnection(async (conn) => conn);
  const UsernameAndPhone = [username, phone_num];

  const userId = await userDao.selectUserId_UsernameAndPhone(
    connection,
    UsernameAndPhone
  );
  connection.release();

  return userId[0];
};

// 비밀번호 재설정 - id, 이름, 전화번호 확인
exports.check_id_name_num = async function (user_id, username, phone_num) {
  const connection = await pool.getConnection(async (conn) => conn);
  const id_name_num = [user_id, username, phone_num];

  const idNameNum = await userDao.selectIdNameNum(connection, id_name_num);
  connection.release();

  return idNameNum;
};

// 모든 사용자 반환
exports.alluser = async function () {
  const connection = await pool.getConnection(async (conn) => conn);

  const alluser = await userDao.alluser(connection);

  connection.release();

  return alluser;
};

// user_id 로 id 가져오기
exports.getIdx_by_user_id = async function (user_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const id = await userDao.selectUserIdx_by_user_id(connection, user_id);

  //만약 해당하는 사용자가 없다면 -> 새로 추가한거!
  if (!id[0]) {
    connection.release();
    return null;
  }

  connection.release();
  return id[0].id;
};

// user_id 로 id 가져오기
exports.getIdx_by_nickname = async function (nickname){
  const connection = await pool.getConnection(async (conn) => conn);
  const id = await userDao.getIdx_by_nickname(connection,nickname );
  
  //만약 해당하는 사용자가 없다면 -> 새로 추가한거!
  if(!id[0]){
    connection.release();
    return null;
  }

  connection.release();
  return id[0].id;
}

// 팔로우 , 팔로잉 한 관계인지 확인하기.
exports.selectFollow = async function (followerIdx, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await userDao.selectFollow(connection, [followerIdx, userIdx]);
  connection.release();
  return result;
};

exports.countFollower = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const count = await userDao.countFollower(connection, userIdx);
  connection.release();
  return count[0];
};

//getIsExpert
exports.getIsExpert = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const isExpert = await userDao.getIsExpert(connection, userIdx);
  connection.release();
  return isExpert[0].expert;
};

// info
exports.info = async function (userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await userDao.info(connection, userIdx);
  connection.release();
  return result;
}
