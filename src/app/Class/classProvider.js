const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const classDao = require("./classDao");

exports.getClass = async function (id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await classDao.getClass(connection, id);
  connection.release();
  return result;
};
