const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const { imageUploader } = require("../../../config/imageUploader");
const regexEmail = require("regex-email");
const { emit } = require("nodemon");
const multer = require("multer");
function validatePassword(password) {
  // 대문자, 소문자, 숫자, 특수 문자 포함 여부 확인
  var upperCaseRegex = /[A-Z]/;
  var lowerCaseRegex = /[a-z]/;
  var numberRegex = /[0-9]/;
  var specialCharRegex = /[\W_]/; // \W는 비문자(non-word) 문자, _는 언더스코어를 의미합니다.

  var isUpperCase = upperCaseRegex.test(password);
  var isLowerCase = lowerCaseRegex.test(password);
  var hasNumber = numberRegex.test(password);
  var hasSpecialChar = specialCharRegex.test(password);

  // 길이 확인
  var isValidLength = password.length >= 8 && password.length <= 30;

  // 결과 반환
  return (
    isUpperCase && isLowerCase && hasNumber && hasSpecialChar && isValidLength
  );
}

//회원가입
exports.postUsers = async function (req, res) {
  const {
    marketing_agreement,
    user_id,
    password,
    phone_num,
    birth,
    nickname,
    username, 
  } = await req.body;

  var imageURL;
  if(req.file){
    imageURL = req.file.location;
  }else{
    imageURL = null;
  }

  
  console.log(imageURL);
  //1. 모두 null이 아닌지
  if (
    !marketing_agreement ||
    !user_id ||
    !password ||
    !phone_num ||
    !birth ||
    !nickname ||
    !username
  ) {
    return res.send(baseResponse.USER_INFO_EMPTY);
  }


  //3.password
  if (!validatePassword(password)) {
    return res.send(SIGNUP_PASSWORD_ERROR);
  }

  const signUpResponse = await userService.createUser(
    marketing_agreement,
    user_id,
    password,
    phone_num,
    birth,
    nickname,
    username,
    imageURL //
  );

  return res.send(signUpResponse);
};

//로그인
exports.login = async function (req, res) {
  const { user_id, password } = req.body;

  const signInResponse = await userService.postSignIn(user_id, password);

  return res.send(signInResponse);
};

// id 중복  확인
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

//아이디 찾기
exports.findId = async function (req, res) {
  const { username, phone_num } = req.body;

  const result = await userProvider.findId(username, phone_num);

  if (!result) {
    return res.send(baseResponse.USER_USERID_AND_PHONENUM_NOT_EXIST);
  } else {
    return res.send(response(baseResponse.SUCCESS, result));
  }
};

// 비밀번호 재설정
exports.resetPw = async function (req, res) {
  const { user_id, username, phone_num, password } = req.body;
  const result = await userProvider.check_id_name_num(
    user_id,
    username,
    phone_num
  );
  if (!validatePassword(password)) {
    return res.send(baseResponse.PW_CONDITION_MISMATCH);
  }
  if (result < 1) {
    return res.send(baseResponse.USER_USERID_AND_PHONENUM_NOT_EXIST);
  }

  const reset_pw = await userService.reset_password(user_id, password);
  if (!password) {
    return res.send(baseResponse.SIGNIN_PASSWORD_EMPTY);
  } else {
    return res.send(reset_pw);
    // return res.send(response(baseResponse.SUCCESS, reset_pw));
  }
};
