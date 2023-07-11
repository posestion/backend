
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


module.exports = {
  insertUserInfo,
  selectUserId,
  selectUserPassword
};
