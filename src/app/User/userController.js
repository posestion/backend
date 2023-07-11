
const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");


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
  return isUpperCase && isLowerCase && hasNumber && hasSpecialChar && isValidLength;
}

//회원가입
exports.postUsers = async function (req, res) {

  const {marketing_agreement,user_id,password,phone_num,birth,nickname} = req.body;

  //1. 모두 null이 아닌지
  if(!marketing_agreement && !user_id && !password && !phone_num && !birth && !nickname)
  {
    return res.send(baseResponse.USER_INFO_EMPTY);
  }
  // 중복된 user id 가 있는지.

  //3.password
  if(!validatePassword(password)){
      res.send(SIGNUP_PASSWORD_ERROR);
  }

  const signUpResponse = await userService.createUser(
      marketing_agreement,user_id,password,phone_num,birth,nickname
  );

  return res.send(signUpResponse);
};


//로그인
exports.login = async function (req, res) {

  const {user_id, password} = req.body;

  const signInResponse = await userService.postSignIn(user_id, password);

  return res.send(signInResponse);
};
