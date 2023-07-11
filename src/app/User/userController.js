const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

// id 중복 확인
exports.repeatId = async function (req, res) {
  const user_id = req.params.id;
  const id_result = await userProvider.retrieveRepeatId(user_id);

  if (id_result < 1) {
    return res.send(response(baseResponse.SUCCESS, id_result));
  } else {
    return res.send(response(baseResponse.SIGNUP_REDUNDANT_ID, id_result));
  }
};

// 닉네임 중복 확인
exports.repeatName = async function (req, res) {
  const user_name = req.params.nickname;
  const name_result = await userProvider.retrieveRepeatName(user_name);

  if (name_result < 1) {
    return res.send(response(baseResponse.SUCCESS, name_result));
  } else {
    return res.send(
      response(baseResponse.SIGNUP_REDUNDANT_NICKNAME, name_result)
    );
  }
};
