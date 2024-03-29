const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
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

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (
  marketing_agreement,
  user_id,
  password,
  phone_num,
  birth,
  nickname,
  username,
  imageURL,
  introduction
) {
  try {
    //id 중복 확인
    const id_result = await userProvider.retrieveRepeatId(user_id);

    if (id_result.length > 0) {
      return baseResponse.SIGNUP_REDUNDANT_ID;
    }
    const nickname_result = await userProvider.retrieveRepeatName(nickname);
    if(nickname_result.length >0 ){
      return baseResponse.SIGNUP_REDUNDANT_NICKNAME;
    }


    // 비밀번호 암호화
    const hashedPassword = await crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");

    const insertUserInfoParams = [
      marketing_agreement,
      user_id,
      hashedPassword,
      phone_num,
      birth,
      nickname,
      username,
      imageURL,
      introduction,
    ];

    const connection = await pool.getConnection(async (conn) => conn);

    const userIdResult = await userDao.insertUserInfo(
      connection,
      insertUserInfoParams
    );

    //console.log(`추가된 회원 : ${userIdResult[0].insertId}`);
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - createUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 로그인 인증 방법 (JWT)
exports.postSignIn = async function (user_id, password) {
  try {
    const user_id_rows = await userProvider.user_id_check(user_id);
    if (user_id_rows.length < 1)
      return errResponse(baseResponse.SIGNIN_USER_ID_ERROR);

    const selectUserId = user_id_rows[0].user_id;

    // 비밀번호 확인
    const hashedPassword = await crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");
    console.log(hashedPassword);
    const selectUserPasswordParams = [selectUserId, hashedPassword];
    const passwordRows = await userProvider.passwordCheck(
      selectUserPasswordParams
    );

    if (!passwordRows[0] || passwordRows[0].password !== hashedPassword) {
      // 수정
      return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
    }

    console.log(user_id_rows[0].user_id); // DB의 userId

    //토큰 생성 Service
    let token = await jwt.sign(
      {
        userId: user_id_rows[0].user_id,
      }, // 토큰의 내용(payload)
      secret_config.jwtsecret, // 비밀키
      {
        expiresIn: "365d",
        subject: "userInfo",
      } // 유효 기간 365일
    );

    return response(baseResponse.SUCCESS, {
      userId: user_id_rows[0].user_id,
      jwt: token,
    });
  } catch (err) {
    logger.error(
      `App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(
        err
      )}`
    );
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 비밀번호 재설정
exports.reset_password = async function (user_id, password) {
  try {
    // 비밀번호 암호화
    const hashedPassword = await crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");

    const newPw = [hashedPassword, user_id];
    const connection = await pool.getConnection(async (conn) => conn);

    const resetPw = await userDao.passwordReset(connection, newPw);

    connection.release();

    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - createUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

//팔로워 추가하기 + 사용자에 대해서 expert 여부 변경해주기
exports.addFollower = async function (followerIdx, userIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await userDao.addFollower(connection, followerIdx, userIdx);
    connection.release();
    return result;
  } catch (err) {
    logger.error(`App - addFollower Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

//팔로우 취소하기
exports.cancelFollower = async function (followerIdx, userIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await userDao.cancelFollower(
      connection,
      followerIdx,
      userIdx
    );
    connection.release();
    return result;
  } catch (err) {
    logger.error(`App - addFollower Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

//전문가 여부 update 하기
exports.updateUserExpert = async function (userIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const count = await userProvider.countFollower(userIdx);
    if (count[0].count >= 2) {
      // 2명
      await userDao.updateUserExpertToTrue(connection, userIdx);
    }
    // else{
    //   await userDao.updateUserExpertToFalse(connection,userIdx);
    // }
    connection.release();
  } catch (err) {
    logger.error(`App - updateUserExpert Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 회원 정보 수정
exports.changeuser = async function (
  user_id,
  nickname,
  password,
  birth,
  phone_num,
  introduction,
  imageURL
) {
  try {
    //닉네임 중복 확인
    // const nickname_result = await userProvider.retrieveRepeatName(nickname);

    // if (nickname_result.length > 0) {
    //   return baseResponse.SIGNUP_REDUNDANT_NICKNAME;
    // }

    // 비밀번호 암호화
    const hashedPassword = await crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");

    const connection = await pool.getConnection(async (conn) => conn);
    const result = await userDao.infoChange(
      connection,
      user_id,
      nickname,
      hashedPassword,
      birth,
      introduction,
      imageURL
    );
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - changeuser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

//change
exports.change = async function (
  userIdx,nickname,birth,phone_num,introduction,hashedPassword,imageURL
) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    await userDao.change(connection,userIdx,nickname,birth,phone_num,introduction,hashedPassword,imageURL);
    connection.release();
    return baseResponse.SUCCESS;
  } catch (err) {
    logger.error(`App - change Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
}