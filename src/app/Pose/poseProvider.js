const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const poseDao = require("./poseDao");

exports.readIds = async function (user_idx, pose_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await poseDao.repeatPose(connection, user_idx, pose_id);
  connection.release();
  return result;
};
