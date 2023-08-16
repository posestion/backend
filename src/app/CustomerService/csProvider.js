
//getInquiry
const { ExpressionType } = require("@aws-sdk/client-s3");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const csDao = require("./csDao");

// 상세정보
exports.getInquiry = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await csDao.getInquiry(connection,userIdx);
  connection.release();
  return result;
};