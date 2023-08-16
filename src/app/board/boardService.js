const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const boardDao = require("./boardDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");
const {
  imageUploader,
  allowedExtensions,
} = require("../../../config/imageUploader");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");
// 10초 사진 업로드
exports.createTensPhoto = async function (
  userIdx,
  title,
  expertTF,
  pose_image,
  date,
  profile
) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await boardDao.createTensPhoto(
      connection,
      userIdx,
      title,
      expertTF,
      pose_image,
      date,
      profile
    );
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - createTensPhoto Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
