// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(marketing_agreement,user_id,password,phone_num,birth,nickname,username,profile_image,introduction)
        VALUES (?, ?, ?, ?, ?, ?, ?, ? , ?);
    `;

  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );
  return insertUserInfoRow;
}

async function selectUserId(connection, user_id) {
  const selectUserIdQuery = `
                SELECT user_id
                FROM User 
                WHERE user_id = ?;
                `;
  const [Rows] = await connection.query(selectUserIdQuery, user_id);
  return Rows;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT user_id, nickname, password
        FROM User 
        WHERE user_id = ? AND password = ?;`;
  const selectUserPasswordRow = await connection.query(
    selectUserPasswordQuery,
    selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 중복 id 확인
async function selectRepeatId(connection, id) {
  const selectUserRepeatId = `
    SELECT user_id
    FROM User
    WHERE user_id=?;
    `;
  const [repeatId] = await connection.query(selectUserRepeatId, id);
  return repeatId;
}

// 중복 닉네임 확인
async function selectRepeatName(connection, name) {
  const selectUserRepeatName = `
    SELECT nickname
    FROM User
    WHERE nickname=?;
    `;
  const [repeatName] = await connection.query(selectUserRepeatName, name);
  return repeatName;
}

// 아이디 찾기 _ 전화번호와 아이디로
async function selectUserId_UsernameAndPhone(connection, nameAndPhone) {
  const query = `
  SELECT user_id
  FROM User
  where username=? and phone_num=?
  `;
  const [userid] = await connection.query(query, nameAndPhone);
  console.log("dao : ");
  console.log(userid);
  return userid;
}

// 비밀번호 재설정 - id, 이름, 전화번호 확인
async function selectIdNameNum(connection, id_name_num) {
  const query = `
    SELECT user_id,username,phone_num
    FROM User
    WHERE user_id=? AND username=? AND phone_num=?;
    `;

  const [userid] = await connection.query(query, id_name_num);
  return userid;
}
// 비밀번호 재설정 - password 변경
async function passwordReset(connection, newPw) {
  const query = `
    UPDATE User
    SET password=?
    WHERE user_id=?;
    `;

  const [newpw] = await connection.query(query, newPw);
  return newpw;
}

//모든 유저 반환
async function alluser(connection) {
  const [users] = await connection.query("SELECT * FROM User");
  return users;
}

//아이디로 고유번호 가져오기 -> 게시물에서 사용
async function selectUserIdx_by_user_id(connection, user_id) {
  const [users] = await connection.query(
    "SELECT id FROM User WHERE user_id = ? ",
    user_id
  );
  return users;
}

//getIdx_by_nickname
async function getIdx_by_nickname(connection, nickname) {
  const [users] = await connection.query(
    "SELECT id FROM User WHERE nickname = ? ",
    nickname
  );
  return users;
}

//selectFollow
async function selectFollow(connection, param) {
  const [row] = await connection.query(
    "SELECT * FROM follow WHERE  follower_id = ? AND user_id = ?",
    param
  );
  //console.log("dao row: "+ row);
  return row;
}

// 팔로우 추가하기
async function addFollower(connection, followerIdx, userIdx) {
  const row = await connection.query(
    "INSERT INTO follow(user_id,follower_id) VALUES (?  ,?)",
    [userIdx, followerIdx]
  );
  return row;
}

//팔로우 취소하기
async function cancelFollower(connection, followerIdx, userIdx) {
  const row = await connection.query(
    "DELETE FROM follow where user_id= ? and follower_id=?",
    [userIdx, followerIdx]
  );
  return row;
}

async function countFollower(connection, userIdx) {
  const count = await connection.query(
    `SELECT COUNT(*) AS 'count' FROM follow WHERE user_id= ?`,
    userIdx
  );
  return count;
}

async function updateUserExpertToTrue(connection, userIdx) {
  await connection.query(
    `UPDATE User
  SET expert = true
  WHERE id= ? ; `,
    userIdx
  );
}

async function updateUserExpertToFalse(connection, userIdx) {
  await connection.query(
    `UPDATE User
  SET expert = false
  WHERE id= ? ; `,
    userIdx
  );
}

async function getIsExpert(connection, userIdx) {
  const [expert] = await connection.query(
    `SELECT expert FROM User Where id= ?`,
    userIdx
  );
  return expert;
}

// // 회원 정보 수정
// async function infoChange(
//   connection,
//   user_id,
//   nickname,
//   hashedPassword,
//   birth,
//   introduction,
//   imageURL
// ) {

//   // 프로필 사진 변경 안 할 때
//   if (!imageURL) {
//     const query = `
//     UPDATE User
//     SET nickname=? , password=? , birth=? , introduction=?
//     WHERE id=?
//     `;
//     // 닉네임 안바뀌면 밑에것도 안바뀜?
//     const [result] = await connection.query(query, [
//       nickname,
//       hashedPassword,
//       birth,
//       introduction,
//       user_id,
//     ]);
//   } else {
//     const query = `
//     UPDATE User
//     SET nickname=? , password=? , birth=? , profile_image=? , introduction=?
//     WHERE id=?
//     `;
//     // 닉네임 안바뀌면 밑에것도 안바뀜?
//     const [result] = await connection.query(query, [
//       nickname,
//       hashedPassword,
//       birth,
//       imageURL,
//       introduction,
//       user_id,
//     ]);
//   }

//   return result;
// }

// async function infoChange(
//   connection,
//   user_id,
//   nickname,
//   hashedPassword,
//   birth,
//   introduction,
//   imageURL
// ) {
//   let result;
//   // 프로필 사진 안바꿀 때
//   if (!imageURL) {
//     const query = `
//     UPDATE User
//     SET nickname=?, password=?, birth=?, introduction=?
//     WHERE id=?
//     `;
//     const [queryResult] = await connection.query(query, [
//       nickname,
//       hashedPassword,
//       birth,
//       introduction,
//       user_id,
//     ]);
//     result = queryResult;
//   } else {
//     // 프로필 사진 바꿀 때
//     const query = `
//     UPDATE User
//     SET nickname=?, password=?, birth=?, profile_image=?, introduction=?
//     WHERE id=?
//     `;
//     const [queryResult] = await connection.query(query, [
//       nickname,
//       hashedPassword,
//       birth,
//       imageURL,
//       introduction,
//       user_id,
//     ]);
//     result = queryResult;
//   }
//   // 한줄소개 안바꿀 때?

//   return result;
// }

async function infoChange(
  connection,
  user_id,
  nickname,
  hashedPassword,
  birth,
  introduction,
  imageURL
) {
  // 프로필 사진 바꿀 때
  const query = `
UPDATE User
SET 
  nickname = ?,
  password = ?,
  ${birth ? "birth = ?," : " "}   
  ${imageURL ? "profile_image = ?," : " "}       
  ${introduction ? "introduction = ?," : " "}
WHERE id = ?;
`;

  const queryParams = [nickname, hashedPassword];

  if (birth) {
    queryParams.push(birth); //-- birth 값을 배열에 추가
  }

  if (imageURL) {
    queryParams.push(imageURL); // -- imageURL 값을 배열에 추가
  }

  if (introduction) {
    queryParams.push(introduction); // -- introduction 값을 배열에 추가
  }

  queryParams.push(user_id); // -- user_id 값을 배열에 추가
  console.log(queryParams);

  const [queryResult] = await connection.query(query, queryParams);

  return queryResult;
}

module.exports = {
  selectRepeatId,
  selectRepeatName,
  insertUserInfo,
  selectUserId,
  selectUserPassword,
  selectUserId_UsernameAndPhone,
  selectIdNameNum,
  passwordReset,
  alluser,
  selectUserIdx_by_user_id,
  selectFollow,
  addFollower,
  countFollower,
  updateUserExpertToFalse,
  updateUserExpertToTrue,
  cancelFollower,
  getIsExpert,
  getIdx_by_nickname,
  infoChange,
};
