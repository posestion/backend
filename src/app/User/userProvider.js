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
