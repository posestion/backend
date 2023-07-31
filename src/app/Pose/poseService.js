const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const poseProvider = require("./poseProvider");
const poseDao = require("./poseDao");
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

exports.createPose = async function (
  date,
  view,
  user_idx,
  title,
  content,
  tags,
  pose_image
) {
  try {
    // console.log(tags);
    console.log(tags.length);
    console.log(tags[0].length);

    const connection = await pool.getConnection(async (conn) => conn);
    // tag 뺀 나머지 등록 하고 -> pose 자동 생성 id 얻고(?) -> tag 등록
    const pose_info = [date, view, user_idx, title, content, pose_image];
    var pose = await poseDao.poseWrite(connection, pose_info);
    // pose 고유 생성 id 불러오기
    var pose_id = pose[0][0].id;

    // tag 저장
    await poseDao.poseTag(connection, pose_id, tags);
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - createPose Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 포즈 장바구니 저장
exports.saveBasket = async function (user_idx, pose_id, date) {
  try {
    console.log(date);
    console.log(user_idx);
    console.log(pose_id);

    const connection = await pool.getConnection(async (conn) => conn);
    const px = [user_idx, pose_id, date];
    const input_posebasket = await poseDao.inputBasket(connection, px);
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - saveBasket Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
