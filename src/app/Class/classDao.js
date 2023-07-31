const classProvider = require("./classProvider");

// 클래스 생성 -> 간단하게 작성하기 위해 그냥 바로 class id 반환하게 작성
async function createClass(connection, title, content, user_id, date) {
  const Query = `
        INSERT INTO board_class(title,content,user_id,date)
        VALUES (?, ?, ?, ?);
    `;
  await connection.query(Query, [title, content, user_id, date]);
  const id = await connection.query(
    `SELECT id FROM board_class WHERE title = ? AND user_id = ? AND date = ?`,
    [title, user_id, date]
  );
  return id;
}

async function createImages(connection, class_id, images) {
  for (i = 0; i < images.length; i++) {
    await connection.query(
      `INSERT INTO board_class_image(class_id,image_url,sequence) VALUES (?, ?, ?)`,
      [class_id, images[i], i]
    );
  }
}
async function createTag(connection, class_id, tags) {
  for (i = 0; i < tags.length; i++) {
    await connection.query(
      `INSERT INTO board_class_tag(class_id,tag_name) VALUES (?,?)`,
      [class_id, tags[i]]
    );
  }
}
// 상세정보 - 클래스 가져오기
async function getClass(connection, id, user_id) {
  const content = await connection.query(
    `SELECT c.id AS 'classId', c.title AS 'title', DATE_FORMAT(c.date, '%Y-%m-%d') AS 'date', c.content AS 'content', c.hits AS 'hits',
          u.nickname AS 'nickname',u.profile_image AS 'userProfile' , u.expert AS 'isExpert' 
          FROM board_class c,User u WHERE c.id= ? and c.user_id = u.id`,
    id
  );
  const images = await connection.query(
    `SELECT i.image_url AS 'imageUrl', i.sequence AS 'sequence' FROM board_class_image i WHERE i.class_id= ?`,
    id
  );
  const tags = await connection.query(
    `SELECT t.tag_name AS 'tagName' FROM board_class_tag t WHERE t.class_id= ?`,
    id
  );
  const reviews = await connection.query(
    `SELECT u.nickname, u.profile_image , r.date , r.text, r.score FROM board_class_review r , User u WHERE r.class_id= ? and r.user_id = u.id`,
    id
  );

  const Dibs = await connection.query(
    `SELECT
      CASE WHEN d.class_id IS NOT NULL THEN true ELSE false END AS 'dibs'
    FROM
      board_class c
    LEFT OUTER JOIN
      board_class_dibs d ON (c.id = d.class_id AND d.user_id = ?)
    WHERE
      c.id = ?;`,
    [user_id, id]
  );
  await connection.query(
    `UPDATE board_class SET hits = hits + 1 WHERE id = ?;`,
    id
  ); // 조회수 +1
  return [
    {
      classContent: content[0],
      classImages: images[0],
      classTags: tags[0],
      reviews: reviews[0],
      Dibs: Dibs[0],
    },
  ];
}

async function getClassIsExist(connection, id) {
  const result = await connection.query(
    `SELECT * FROM board_class c WHERE c.id = ?`,
    id
  );
  return result[0];
}

async function checkAlreadyLike(connection, userId, id) {
  const result = await connection.query(
    `SELECT * FROM board_class_like c WHERE class_id = ? and user_id = ? `,
    [id, userId]
  );
  return result[0];
}

async function checkAlreadyDibs(connection, userId, id) {
  const result = await connection.query(
    `SELECT * FROM board_class_dibs d WHERE class_id = ? and user_id = ? `,
    [id, userId]
  );
  return result[0];
}

async function addLike(connection, userId, id) {
  await connection.query(
    `Insert INTO board_class_like(user_id,class_id) VALUES (? , ?)`,
    [userId, id]
  );
}

async function cancelLike(connection, userId, id) {
  await connection.query(
    `DELETE FROM board_class_like WHERE user_id = ? and class_id = ?`,
    [userId, id]
  );
}

async function addDibs(connection, userId, id) {
  await connection.query(
    `Insert INTO board_class_dibs(user_id,class_id) VALUES (? , ?)`,
    [userId, id]
  );
}

async function cancelDibs(connection, userId, id) {
  await connection.query(
    `DELETE FROM board_class_dibs WHERE user_id = ? and class_id = ?`,
    [userId, id]
  );
}

async function getClassWriterByClassId(connection, class_id) {
  const result = await connection.query(
    `SELECT user_id FROM board_class WHERE id = ?`,
    class_id
  );
  return result[0];
}

async function createClassReview(
  connection,
  class_id,
  score,
  text,
  userIdx,
  date
) {
  await connection.query(
    `Insert INTO board_class_review(class_id , score, text, user_id , date) VALUES (? , ? , ? , ? ,?)`,
    [class_id, score, text, userIdx, date]
  );
}

async function getClassReviewByUserIdAndClassId(connection, user_id, class_id) {
  const result = await connection.query(
    `SELECT * FROM board_class_review WHERE user_id = ? and class_id = ?`,
    [user_id, class_id]
  );
  return result[0];
}

async function deleteReview(connection, user_id, class_id) {
  await connection.query(
    `DELETE FROM board_class_review WHERE user_id = ? and class_id = ?`,
    [user_id, class_id]
  );
}

async function getHotClass(connection, user_id) {
  const result = await connection.query(
    `SELECT
  c.id, c.title, i.image_url, c.hits,
  CASE WHEN d.class_id IS NOT NULL THEN true ELSE false END AS 'dibs'
FROM
  board_class c
LEFT OUTER JOIN
  board_class_dibs d ON (c.id = d.class_id AND d.user_id = ? )
LEFT OUTER JOIN
  board_class_image i ON (c.id = i.class_id AND i.sequence = 0)
ORDER BY hits desc;`,
    [user_id, user_id]
  );
  return result[0];
}

async function getDrawer(connection, user_id) {
  const dibs = await connection.query(
    `SELECT
  c.id, c.title, i.image_url, c.hits,
  CASE WHEN d.class_id IS NOT NULL THEN 'true' ELSE 'false' END AS 'dibs'
FROM
  board_class c
LEFT OUTER JOIN
  board_class_dibs d ON (c.id = d.class_id AND d.user_id = ?)
LEFT OUTER JOIN
  board_class_image i ON (c.id = i.class_id AND i.sequence = 0) 
where d.user_id = ?
order by c.id desc
LIMIT 4;`,
    [user_id, user_id]
  );

  const myClass = await connection.query(
    `SELECT
    c.id, c.title, i.image_url, c.hits,
    CASE WHEN d.class_id IS NOT NULL THEN 'true' ELSE 'false' END AS 'dibs'
    FROM
    board_class c
    LEFT OUTER JOIN
    board_class_dibs d ON (c.id = d.class_id AND d.user_id = ?)
    LEFT OUTER JOIN
    board_class_image i ON (c.id = i.class_id AND i.sequence = 0) 
    where c.user_id = ?
    order by c.id desc
    LIMIT 4;`,
    [user_id, user_id]
  );
  return [{"myclass" : myClass[0]} ,{"dibs" : dibs[0]}];
}

async function getMyClass(connection, user_id) {
  const myClass = await connection.query(
    `SELECT
    c.id, c.title, i.image_url, c.hits,
    CASE WHEN d.class_id IS NOT NULL THEN 'true' ELSE 'false' END AS 'dibs'
    FROM
    board_class c
    LEFT OUTER JOIN
    board_class_dibs d ON (c.id = d.class_id AND d.user_id = ?)
    LEFT OUTER JOIN
    board_class_image i ON (c.id = i.class_id AND i.sequence = 0) 
    where c.user_id = ?
    order by c.id desc`,
    [user_id, user_id]
  );
  return myClass[0];
}

async function getMyDibs(connection,user_id){
  const dibs = await connection.query(
    `SELECT
  c.id, c.title, i.image_url, c.hits,
  CASE WHEN d.class_id IS NOT NULL THEN 'true' ELSE 'false' END AS 'dibs'
FROM
  board_class c
LEFT OUTER JOIN
  board_class_dibs d ON (c.id = d.class_id AND d.user_id = ?)
LEFT OUTER JOIN
  board_class_image i ON (c.id = i.class_id AND i.sequence = 0) 
where d.user_id = ?
order by c.id desc;`,
    [user_id, user_id]
  );
  return dibs[0];
}

async function getReviewWriterIdByReviewId(connection,review_id){
  const result = await connection.query(`SELECT user_id FROM board_class_review WHERE id = ?`,review_id);
  return result[0];
}

async function getImagesUrlByClassId(connection,class_id){
  const result = await connection.query(`SELECT image_url FROM board_class_image WHERE class_id = ?`,class_id);
  return result[0];
}

async function deleteClass(connection,class_id){
  await connection.query(
    `DELETE FROM board_class WHERE id = ?`,
    class_id
  );
}

module.exports = {
  createClass,
  createImages,
  createTag,
  getClass,
  getClassIsExist,
  checkAlreadyLike,
  addLike,
  cancelLike,
  checkAlreadyDibs,
  addDibs,
  cancelDibs,
  getClassWriterByClassId,
  createClassReview,
  getClassReviewByUserIdAndClassId,
  deleteReview,
  getHotClass,
  getDrawer,
  getMyClass,
  getMyDibs,
  getReviewWriterIdByReviewId,
  getImagesUrlByClassId,
  deleteClass
};
