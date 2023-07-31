const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const poseDao = require("./poseDao");
const poseService = require("./poseService");

exports.readIds = async function (user_idx, pose_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await poseDao.repeatPose(connection, user_idx, pose_id);
  connection.release();
  return result;
};

exports.getDetailpose = async function (id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const detail = await poseDao.poseDetail(connection, id);
  // 조회수(view) 조회
  console.log(detail[0]["view"]);
  connection.release();
  return detail;
};
