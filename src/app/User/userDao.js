
// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(marketing_agreement,user_id,password,phone_num,birth,nickname)
        VALUES (?, ?, ?, ?, ?, ?);
    `;

  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );
  console.log(insertUserInfoRow);
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

module.exports = {
  selectRepeatId,
  selectRepeatName,
  insertUserInfo,
  selectUserId,
  selectUserPassword
};
