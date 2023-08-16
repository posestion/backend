// 클래스 생성 -> 간단하게 작성하기 위해 그냥 바로 class id 반환하게 작성
async function createWdyt(connection,title,content,userIdx,date) {
  const Query = `
        INSERT INTO board_WhatDoYouThink(title,content,user_id,date)
        VALUES (?, ?, ?, ?);
    `;
  await connection.query(Query, [title, content,userIdx, date]);
  const id = await connection.query(
    `SELECT id FROM board_WhatDoYouThink WHERE title = ? AND user_id = ? AND date = ?`,
    [title, userIdx, date]
  );
  return id;
}

async function createImages(connection, wdyt_id, images) {
  for (i = 0; i < images.length; i++) {
    await connection.query(
      `INSERT INTO board_WhatDoYouThink_images(board_WhatDoYouThink_id,image_url,sequence) VALUES (?, ?, ?)`,
      [wdyt_id, images[i], i]
    );
  }
}

async function getWdytIsExist(connection,id){
  const result = await connection.query(
    `SELECT * FROM board_WhatDoYouThink b WHERE b.id = ?`,
    id
  );
  return result[0];
}

async function checkAlreadyLike(connection,userIdx,id){
  const result = await connection.query(
    `SELECT * FROM board_WhatDoYouThink_like WHERE board_WhatDoYouThink_id = ? and user_id = ? `,
    [id, userIdx]
  );
  return result[0];
}

async function addLike(connection, userIdx,id) {
  await connection.query(
    `Insert INTO board_WhatDoYouThink_like(user_id,board_WhatDoYouThink_id) VALUES (? , ?)`,
    [userIdx, id]
  );
}
async function cancelLike(connection,userIdx,id) {
  await connection.query(
    `DELETE FROM board_WhatDoYouThink_like WHERE user_id = ? and board_WhatDoYouThink_id = ?`,
    [userIdx, id]
  );
}
async function getWdytCommentIsExists(connection,id){
  const result = await connection.query(
    `SELECT * FROM board_WhatDoYouThink_comment WHERE id = ?`,
    [id]
  );
  return result[0];
}
async function addComment(connection,userIdx,id,commentParentId,content,date){
  await connection.query(
    `Insert INTO board_WhatDoYouThink_comment(user_id,board_WhatDoYouThink_id,content,date,parent_comment_id) VALUES (? , ?,?,?,?)`,
    [userIdx,id,content,date,commentParentId]
  );
}

async function checkAlreadyCommentLike(connection,userIdx, id){
  const result = await connection.query(
    `SELECT * FROM board_WhatDoYouThink_comment_like WHERE comment_id = ? and user_id = ? `,
    [id, userIdx]
  );
  return result[0];
}

async function addCommentLike(connection,userIdx,id){
  await connection.query(
    `Insert INTO board_WhatDoYouThink_comment_like(user_id,comment_id) VALUES (? , ?)`,
    [userIdx, id]
  );
}

async function cancelCommentLike(connection,userIdx,id){
  await connection.query(
    `DELETE FROM board_WhatDoYouThink_comment_like WHERE user_id = ? and comment_id = ?`,
    [userIdx, id]
  );
}

async function getDetailPage(connection,useridx,id){
  const content = await connection.query(`	SELECT w.id ,  DATE_FORMAT(w.date, '%Y-%m-%d %H:%i') AS 'date', w.title, w.content,
  CASE WHEN l.board_WhatDoYouThink_id IS NOT NULL THEN true ELSE false END AS 'like', u.nickname , u.profile_image
  , (SELECT count(*) FROM board_WhatDoYouThink_like WHERE board_WhatDoYouThink_id = ?) AS 'Number_of_like'
  ,(SELECT count(*) FROM board_WhatDoYouThink_comment WHERE board_WhatDoYouThink_id = ?) AS 'Number_of_reply'
  FROM board_WhatDoYouThink w
  LEFT OUTER JOIN board_WhatDoYouThink_like l ON (w.id = l.board_WhatDoYouThink_id AND l.user_id = ? )
  LEFT OUTER JOIN User u ON (u.id = w.user_id)
  where w.id= ? ;` , [id,id,useridx,id]);
  const images = await connection.query(`select image_url,sequence from board_WhatDoYouThink_images where id =?` , [id]);

  const comment = await connection.query(`	SELECT c.id, content,  DATE_FORMAT(c.date, '%Y-%m-%d %H:%i') AS 'date',parent_comment_id,
	CASE WHEN l.comment_id IS NOT NULL THEN true ELSE false END AS 'like',u.nickname,u.profile_image,
  (select count(*)  from board_WhatDoYouThink_comment_like where comment_id = c.id) AS 'Number_of_like',
  (select count(*)  from board_WhatDoYouThink_comment where parent_comment_id = c.id) AS 'Number_of_reply'
	FROM  board_WhatDoYouThink_comment c
    LEFT OUTER JOIN
    board_WhatDoYouThink_comment_like l ON (c.id = l.comment_id AND l.user_id = ?)
    LEFT OUTER JOIN User u ON (u.id = c.user_id)
    where c.board_WhatDoYouThink_id=?;`,[useridx,id]);

  
  function buildCommentTree(data, parentCommentId = null) {
  const result = [];
  data.forEach(comment => {
    if (comment.parent_comment_id === parentCommentId) {
      const replies = buildCommentTree(data, comment.id);
      if (replies.length > 0) {
        comment.replies = replies;
      }
      result.push(comment);
    }
  });
  return result;
  }

  const commentTree = buildCommentTree(comment[0]);
  //await console.log(JSON.stringify(commentTree, null, 2));

  return {"wdytContent": content[0],"wdytImages":images[0],"wdytComments":commentTree};
}

async function getPage(connection,userIdx){
  const result = await connection.query(
    `SELECT
    w.id, w.title, i.image_url,
    CASE WHEN l.board_WhatDoYouThink_id IS NOT NULL THEN true ELSE false END AS 'like'
    ,(SELECT count(*) FROM board_WhatDoYouThink_like l WHERE l.board_WhatDoYouThink_id = w.id) AS 'Number_of_like'
    ,(SELECT count(*) FROM board_WhatDoYouThink_comment c WHERE c.board_WhatDoYouThink_id = w.id) 'Number_of_reply'
  FROM
    board_WhatDoYouThink w
  LEFT OUTER JOIN
  board_WhatDoYouThink_like l ON (w.id = l.board_WhatDoYouThink_id AND l.user_id = ? )
  LEFT OUTER JOIN
  board_WhatDoYouThink_images i ON (w.id = i.board_WhatDoYouThink_id AND i.sequence = 0)
  order by w.date desc`,[userIdx]
  )
  return result[0];
}

//getCommentWriterIdx
async function getCommentWriterIdx(connection,id){
  const result = await connection.query(
    `SELECT user_id FROM board_WhatDoYouThink_comment WHERE id = ?`,[id]
  )
  return result[0];
}

//getWdytWriterIdx
async function getWdytWriterIdx(connection,id){
  const result = await connection.query(
    `SELECT user_id FROM board_WhatDoYouThink WHERE id = ?`,[id]
  )
  return result[0];
}
//deleteComment
async function deleteComment(connection,id){
  const result = await connection.query(
    `DELETE FROM board_WhatDoYouThink_comment WHERE id = ?`,
    [id]
  )
  return result;
}

async function getSearchPage(connection,userIdx,content){
  const result = await connection.query(
    `SELECT
    w.id, w.title, i.image_url,
    CASE WHEN l.board_WhatDoYouThink_id IS NOT NULL THEN true ELSE false END AS 'like'
    ,(SELECT count(*) FROM board_WhatDoYouThink_like l WHERE l.board_WhatDoYouThink_id = w.id) AS 'Number_of_like'
    ,(SELECT count(*) FROM board_WhatDoYouThink_comment c WHERE c.board_WhatDoYouThink_id = w.id) 'Number_of_reply'
  FROM
    board_WhatDoYouThink w
  LEFT OUTER JOIN
  board_WhatDoYouThink_like l ON (w.id = l.board_WhatDoYouThink_id AND l.user_id = ? )
  LEFT OUTER JOIN
  board_WhatDoYouThink_images i ON (w.id = i.board_WhatDoYouThink_id AND i.sequence = 0)
  WHERE w.content LIKE ? OR w.title LIKE ?
  order by w.date desc`,
  [userIdx, `%${content}%`, `%${content}%`]
  )
  return result[0];
}

//getImagesUrlByWdytId
async function getImagesUrlByWdytId(connection,id){
  const result = await connection.query(`SELECT image_url FROM board_WhatDoYouThink_images WHERE board_WhatDoYouThink_id = ?`,id);
  return result[0];
}

//deleteWdyt
async function deleteWdyt(connection,id){
  await connection.query(
    `DELETE FROM board_WhatDoYouThink WHERE id = ?`,
    id
  );
}


module.exports = {
  createWdyt,
  createImages,
  getWdytIsExist,
  checkAlreadyLike,
  addLike,
  cancelLike,
  getWdytCommentIsExists,
  addComment,
  checkAlreadyCommentLike,
  addCommentLike,
  cancelCommentLike,
  getDetailPage,
  getPage,
  getCommentWriterIdx,
  deleteComment,
  getSearchPage,
  getWdytWriterIdx,
  getImagesUrlByWdytId,
  deleteWdyt
};