module.exports = {
  // Success
  SUCCESS: { isSuccess: true, code: 200, message: "성공" },

  // Common
  TOKEN_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "JWT 토큰을 입력해주세요.",
  },
  TOKEN_VERIFICATION_FAILURE: {
    isSuccess: false,
    code: 401,
    message: "JWT 토큰 검증 실패",
  },

  //Request error
  SIGNUP_EMAIL_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "이메일을 입력해주세요",
  },
  SIGNUP_EMAIL_LENGTH: {
    isSuccess: false,
    code: 400,
    message: "이메일은 30자리 미만으로 입력해주세요.",
  },
  SIGNUP_EMAIL_ERROR_TYPE: {
    isSuccess: false,
    code: 400,
    message: "이메일을 형식을 정확하게 입력해주세요.",
  },
  SIGNUP_PASSWORD_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "비밀번호를 입력 해주세요.",
  },
  SIGNUP_PASSWORD_LENGTH: {
    isSuccess: false,
    code: 400,
    message: "비밀번호는 6~20자리를 입력해주세요.",
  },
  SIGNUP_NICKNAME_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "닉네임을 입력 해주세요.",
  },
  SIGNUP_NICKNAME_LENGTH: {
    isSuccess: false,
    code: 400,
    message: "닉네임은 최대 20자리를 입력해주세요.",
  },

  SIGNIN_EMAIL_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "이메일을 입력해주세요",
  },
  SIGNIN_EMAIL_LENGTH: {
    isSuccess: false,
    code: 400,
    message: "이메일은 30자리 미만으로 입력해주세요.",
  },
  SIGNIN_EMAIL_ERROR_TYPE: {
    isSuccess: false,
    code: 400,
    message: "이메일을 형식을 정확하게 입력해주세요.",
  },
  SIGNIN_PASSWORD_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "비밀번호를 입력 해주세요.",
  },

  USER_USERID_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "userId를 입력해주세요.",
  },
  USER_USERID_NOT_EXIST: {
    isSuccess: false,
    code: 404,
    message: "해당 회원이 존재하지 않습니다.",
  },

  USER_USEREMAIL_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "이메일을 입력해주세요.",
  },
  USER_USEREMAIL_NOT_EXIST: {
    isSuccess: false,
    code: 404,
    message: "해당 이메일을 가진 회원이 존재하지 않습니다.",
  },
  USER_ID_NOT_MATCH: {
    isSuccess: false,
    code: 401,
    message: "유저 아이디 값을 확인해주세요",
  },
  USER_NICKNAME_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "변경할 닉네임 값을 입력해주세요",
  },

  USER_STATUS_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "회원 상태값을 입력해주세요",
  },

  // Response error
  SIGNUP_REDUNDANT_ID: {
    isSuccess: false,
    code: 400,
    message: "중복된 id입니다.",
  },
  SIGNUP_REDUNDANT_NICKNAME: {
    isSuccess: false,
    code: 400,
    message: "중복된 닉네임입니다.",
  },

  // 노승아
  SIGNUP_INFO_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "모든 항목을 입력해주세요.",
  }, // 회원가입 할 때, 빈 항목이 있을 때
  SIGNUP_PASSWORD_ERROR: {
    isSuccess: false,
    code: 400,
    message: "비밀번호 설정 조건을 확인해주세요.",
  }, // 회원가입 할 때, 비밀번호 형식 오류
  SIGNIN_USER_ID_ERROR: {
    isSuccess: false,
    code: 400,
    message: "일치하는 id가 없습니다.",
  },
  USER_USERID_AND_PHONENUM_NOT_EXIST: {
    isSuccess: false,
    code: 404,
    message: "입력하신 사용자 정보와 일치하는 회원이 없습니다.",
  },
  USER_INFO_EMPTY: {
    isSuccess: false,
    code: 400,
    message: "사용자 정보를 모두 입력해주세요.",
  },

  // Response error
  SIGNUP_REDUNDANT_EMAIL: {
    isSuccess: false,
    code: 400,
    message: "중복된 이메일입니다.",
  },
  SIGNUP_REDUNDANT_NICKNAME: {
    isSuccess: false,
    code: 400,
    message: "중복된 닉네임입니다.",
  },

  SIGNIN_EMAIL_WRONG: {
    isSuccess: false,
    code: 404,
    message: "아이디가 잘못 되었습니다.",
  },
  SIGNIN_PASSWORD_WRONG: {
    isSuccess: false,
    code: 404,
    message: "비밀번호가 잘못 되었습니다.",
  },
  SIGNIN_INACTIVE_ACCOUNT: {
    isSuccess: false,
    code: 400,
    message: "비활성화 된 계정입니다. 고객센터에 문의해주세요.",
  },
  SIGNIN_WITHDRAWAL_ACCOUNT: {
    isSuccess: false,
    code: 400,
    message: "탈퇴 된 계정입니다. 고객센터에 문의해주세요.",
  },
  PW_CONDITION_MISMATCH: {
    isSuccess: false,
    code: 400,
    message: "비밀번호 조건 불일치",
  },
  // 포즈 장바구니 중복 저장 - 박예인
  BASKET_REPEAT: {
    isSuccess: false,
    code: 400,
    message: "포즈 장바구니에 해당 포즈 이미 존재",
  },
  // 포즈 상점 이미지 업로드 안 함
  POSE_IMAGE_NULL: {
    isSuccess: false,
    code: 400,
    message: "이미지 null",
  },
  // 포즈 상점 게시글 제목 입력 안 함
  NO_TITLE: {
    isSuccess: false,
    code: 400,
    message: "title 입력 안 함",
  },
  // 포즈 상점 게시글 내용 입력 안 함
  NO_CONTENT: {
    isSuccess: false,
    code: 400,
    message: "내용 입력 안 함",
  },
  //Connection, Transaction 등의 서버 오류
  DB_ERROR: { isSuccess: false, code: 500, message: "데이터 베이스 에러" },
  SERVER_ERROR: { isSuccess: false, code: 500, message: "서버 에러" },
};
