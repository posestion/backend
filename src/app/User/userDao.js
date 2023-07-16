// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(marketing_agreement,user_id,password,phone_num,birth,nickname,username,profile_image)
        VALUES (?, ?, ?, ?, ?, ?,?,?);
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

module.exports = {
  selectRepeatId,
  selectRepeatName,
  insertUserInfo,
  selectUserId,
  selectUserPassword,
  selectUserId_UsernameAndPhone,
  selectIdNameNum,
  passwordReset,
};
