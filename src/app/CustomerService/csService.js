//createInquiry
const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const csDao = require("./csDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");
const {deleteImageFromS3} = require("../../../config/imageUploader");


exports.createInquiry = async function (
  title,content,date,userIdx,files
) {
  try{
    const connection = await pool.getConnection(async (conn) => conn);
    var id= await csDao.createInquiry(connection, title,content,userIdx,date); // class 추가하고, 이미지 추가를 위해 class 고유 id를 받아옴.
    id = id[0][0].id;
    console.log(id);
    await csDao.createFiles(connection,id,files);
    connection.release();
    return response(baseResponse.SUCCESS);
  }catch(err){
    logger.error(`App - createInquiry Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}