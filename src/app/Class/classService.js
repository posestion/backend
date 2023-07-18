const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const classProvider = require("./classProvider");
const classDao = require("./classDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");
const { imageUploader, allowedExtensions } = require("../../../config/imageUploader");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");


exports.createClass = async function (
  title,content,user_id,images,date,tags
) {
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    var class_id= await classDao.createClass(connection,title,content,user_id,date); // class 추가하고, 이미지 추가를 위해 class 고유 id를 받아옴.
    class_id = class_id[0][0].id;
    await console.log(class_id);
    console.log(images);
    await classDao.createImages(connection,class_id,images);
    await classDao.createTag(connection,class_id,tags);
    connection.release();
    return response(baseResponse.SUCCESS);
  }catch(err){
    logger.error(`App - createClass Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}