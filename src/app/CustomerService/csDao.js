//createInquiry

// 클래스 생성 -> 간단하게 작성하기 위해 그냥 바로 class id 반환하게 작성
async function createInquiry(connection, title, content, user_id, date) {
  const Query = `
        INSERT INTO inquiry(title,content,user_id,date)
        VALUES (?, ?, ?, ?);
    `;
  await connection.query(Query, [title, content, user_id, date]);
  const id = await connection.query(
    `SELECT id FROM inquiry WHERE title = ? AND user_id = ? AND date = ?`,
    [title, user_id, date]
  );
  return id;
}

async function createFiles(connection, inquiry_id, files) {
  for (i = 0; i < files.length; i++) {
    await connection.query(
      `INSERT INTO inquiry_files(inquiry_id,file_url) VALUES (?, ?)`,
      [inquiry_id, files[i]]
    );
  }
}

//getInquiry
//inquiry_files
async function getInquiry(connection, userIdx) {
  const ans_no = await connection.query(
    `
    SELECT i.title, i.content , i.date 
    FROM inquiry_answer f
    RIGHT OUTER JOIN inquiry i ON (i.id = f.inquiry_id)
    WHERE user_id = ? and f.name is null;`,
    [userIdx]
  );
  const ans_yes =await connection.query(
    `SELECT i.title, i.content , i.date ,
    f.name AS 'ans_name' , f.content AS 'ans_content'
    FROM inquiry i
    RIGHT OUTER JOIN inquiry_answer f ON (i.id = f.inquiry_id)
    WHERE user_id = ?`,
    [userIdx]
  );

  return {"answer_incomplete":ans_no[0],"answer_complete":ans_yes[0]};
}
module.exports = {
  createInquiry,
  createFiles,
  getInquiry
};
