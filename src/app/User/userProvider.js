const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

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
