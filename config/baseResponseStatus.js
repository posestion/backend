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

  //노승아 - 팔로우 오류
  FOLLOW_FOLLOWING_USER_NOT_EXIST: {
    isSuccess: false,
    code: 404,
    message: "팔로우 하려는 사용자를 찾을 수 없습니다.",
  },
  FOLLOW_FOLLOWER_USER_NOT_EXIST: {
    isSuccess: false,
    code: 404,
    message: "현재 로그인 된 사용자 계정에 오류가 있습니다. 다시 시도해주세요.", //? ->
  },
  FOLLOW_ALREADY_FOLLOW: {
    isSuccess: false,
    code: 404,
    message: "이미 팔로우하고 있습니다.",
  },
  FOLLOW_WERE_NOT_FOLLOWING: {
    isSuccess: false,
    code: 404,
    message: "팔로우하고 있지 않았습니다.",
  },
  FOLLOW_CANT_FOLLOW_SELF: {
    isSuccess: false,
    code: 404,
    message: "본인은 팔로우 할 수 없습니다.",
  },

  //노승아 - Class
  CLASS_NOT_EXIST: {
    isSuccess: false,
    code: 404,
    message: "해당 게시물이 없습니다.",
  },
  USER_IS_NOT_EXPERT: {
    isSuccess: false,
    code: 404,
    message: "전문가가 아니기 때문에 클래스를 올릴 수 없습니다.",
  },
  FIND_USER_ERROR: {
    isSuccess: false,
    code: 404,
    message:
      "사용자 정보를 가져오는데 에러가 발생 하였습니다. 다시 시도해주세요.",
  },
  CLASS_POST_REQUIRED_INFO_MISSING_ERROR: {
    isSuccess: false,
    code: 404,
    message: "필수 정보가 누락 되었습니다. 제목을 입력해 주세요.",
  },
  CLASS_REVIEW_POST_REQUIRED_INFO_MISSING_ERROR: {
    isSuccess: false,
    code: 404,
    message:
      "필수 정보가 누락 되었습니다. 점수과 리뷰 글을 모두 입력해 주세요.",
  },
  CLASS_WRITER_CANT_POST_REVIEW: {
    isSuccess: false,
    code: 404,
    message: "클래스 작성자는 리뷰를 쓸 수 없습니다.",
  },
  CLASS_REVIEW_POST_ONLY_ONE_REVIEW_PER_CLASS: {
    isSuccess: false,
    code: 404,
    message: "리뷰는 클래스 하나 당 하나만 작성 할 수 있습니다.",
  },
  CLASS_REVIEW_SCORE_BOUND_ERROR: {
    isSuccess: false,
    code: 404,
    message: "점수는 1~5점 사이로 입력해주세요.",
  },
  CLASS_REVIEW_REVEIW_NOT_FOUND_ERROR: {
    isSuccess: false,
    code: 404,
    message: "삭제할 리뷰를 찾을 수 없습니다.",
  },
  CLASS_ALREADY_DIBS: {
    isSuccess: false,
    code: 404,
    message: "이미 찜한 게시물 입니다.",
  },
  CLASS_DIDNT_DIBS: {
    isSuccess: false,
    code: 404,
    message: "찜하지 않았던 게시물 입니다.",
  },
  CLASS_WRITER_CANT_ADD_DIBS: {
    isSuccess: false,
    code: 404,
    message: "작성자는 본인이 게시한 클래스를 찜할 수 없습니다.",
  },
  CLASS_DELETE_ONLY_WRITER: {
    isSuccess: false,
    code: 404,
    message: "작성자만 클래스를 삭제 할 수 있습니다.",
  },
  // 노승아 - 이사잘
  WDYT_NOT_EXISTS : {
    isSuccess: false,
    code: 404,
    message: "게시글이 존재하지 않습니다.",
  },
  WDYT_LIKE_ERROR:{
    isSuccess: false,
    code: 404,
    message: "이미 좋아요 한 게시글입니다.",
  },
  WDYT_CANCEL_LIKE_ERROR:{
    isSuccess: false,
    code: 404,
    message: "좋아요를 누르지 않았던 게시글입니다.",
  },
  WDYT_FIND_PARENTCOMMENT_ERROR:{
    isSuccess: false,
    code: 404,
    message: "부모 댓글을 찾을 수 없습니다.",
  },
  WDYT_COMMENT_NOT_EXIST:{
    isSuccess: false,
    code: 404,
    message: "댓글을 찾을 수 없습니다.",
  },
  //이미 좋아요를 누른 댓글입니다.
  WDYT_COMMENT_LIKE_ERROR:{
    isSuccess: false,
    code: 404,
    message: "이미 좋아요를 누른 댓글입니다.",
  },
    //이미 좋아요를 누른 댓글입니다.
  WDYT_COMMENT_CANCEL_LIKE_ERROR:{
    isSuccess: false,
    code: 404,
    message: "좋아요를 누르지 않았던 댓글입니다.",
  },
  //WDYT_COMMENT_DELETE_ERROR
  WDYT_COMMENT_DELETE_ERROR:{
    isSuccess: false,
    code: 404,
    message: "댓글을 삭제할 수 없습니다. 본인 댓글이 아닙니다.",
  },

  // 회원가입 자기소개 에러
  SIGNUP_INTRODUCTION_ERROR:{
    isSuccess: false,
    code: 404,
    message: "자기 소개는 20글자 이하로 써주세요.",
  },
  // 닉네임 자기소개 에러
  PROFILE_FIND_NICKNAME_ERROR:{
    isSuccess: false,
    code: 404,
    message: "해당 닉네임을 가진 사용자가 없습니다.",
  },
  POSE_DELETE_ONLY_WRITER: {
    isSuccess: false,
    code: 404,
    message: "작성자만 포즈를 삭제 할 수 있습니다.",
  },
  WDYT_DELETE_ONLY_WRITER: {
    isSuccess: false,
    code: 404,
    message: "작성자만 게시글을 삭제 할 수 있습니다.",
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
  // 즐겨찾기 중복 저장 - 박예인
  FAV_REPEAT: {
    isSuccess: false,
    code: 400,
    message: "즐겨찾기에 해당 포즈 이미 존재",
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
  POSE_ID_NULL: {
    isSuccess: false,
    code: 400,
    message: "존재하는 포즈가 아닙니다",
  },
  // tag 입력 안 함
  TAG_NULL: {
    isSuccess: false,
    code: 400,
    message: "태그 1개 이상 입력해주세요",
  },
  // 검색어 입력 안 함
  SEARCH_NULL: {
    isSuccess: false,
    code: 400,
    message: "검색어를 입력해주세요",
  },
  // 장바구니에 없는 pose_id
  BASKET_POSE_ID_NULL: {
    isSuccess: false,
    code: 400,
    message: "장바구니에 일치하는 포즈가 없습니다",
  },
  // 즐겨찾기에 없는 pose_id
  FAV_POSE_ID_NULL: {
    isSuccess: false,
    code: 400,
    message: "즐겨찾기에 일치하는 포즈가 없습니다",
  },
  //Connection, Transaction 등의 서버 오류
  DB_ERROR: { isSuccess: false, code: 500, message: "데이터 베이스 에러" },
  SERVER_ERROR: { isSuccess: false, code: 500, message: "서버 에러" },
};
