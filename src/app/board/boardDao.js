// 홈 - 광고 배너
async function getAd(connection, user_id) {
  const [result] = await connection.query(
    `
    SELECT *
    FROM ad_banner
    `
  );
  return result;
}
//  홈 - 수강중인 강좌
async function takingLecture(connection, user_id) {
  const result = await connection.query(
    `SELECT
    c.id, c.title, i.image_url, c.hits,
    CASE WHEN d.class_id IS NOT NULL THEN true ELSE false END AS 'dibs'
    FROM
    board_class c
    LEFT OUTER JOIN
    board_class_register r ON (c.id = r.class_id AND r.user_id = ?)
    LEFT OUTER JOIN
    board_class_dibs d ON (c.id = d.class_id AND d.user_id = ?)
    LEFT OUTER JOIN
    board_class_image i ON (c.id = i.class_id AND i.sequence = 0) 
    where r.user_id = ?
    order by c.id desc
    LIMIT 2;`,
    [user_id, user_id, user_id]
  );

  return result[0];
}
// 홈 - hot 한 강의 불러오기
async function hotLecGet(connection, user_id) {
  const result = await connection.query(
    `SELECT
  c.id, i.image_url, c.hits,
  CASE WHEN d.class_id IS NOT NULL THEN true ELSE false END AS 'dibs'
FROM
  board_class c
LEFT OUTER JOIN
  board_class_dibs d ON (c.id = d.class_id AND d.user_id = ? )
LEFT OUTER JOIN
  board_class_image i ON (c.id = i.class_id AND i.sequence = 0)
ORDER BY hits desc
LIMIT 6;`,
    [user_id, user_id]
  );
  return result[0];
}
// 게시판 - 이사잘
async function getWellPhoto(connection, userIdx) {
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
  order by w.date desc
  LIMIT 3`,
    [userIdx]
  );
  return result[0];
}
// 게시판 - 클래스 - 찜도 반환해야 되는지?
async function getClass(connection, user_id) {
  const result = await connection.query(
    `SELECT
    c.id, c.title, i.image_url, c.date
    FROM
    board_class c
    LEFT OUTER JOIN
    board_class_image i ON (c.id = i.class_id AND i.sequence = 0)
    ORDER BY c.date DESC
    LIMIT 4;`,
    [user_id, user_id]
  );
  return result[0];
}

// 클래스 - 요즘 hot한 강의
async function getHotClass(connection, user_id) {
  const result = await connection.query(
    `SELECT
  c.id, i.image_url, c.hits,
  CASE WHEN d.class_id IS NOT NULL THEN true ELSE false END AS 'dibs'
FROM
  board_class c
LEFT OUTER JOIN
  board_class_dibs d ON (c.id = d.class_id AND d.user_id = ? )
LEFT OUTER JOIN
  board_class_image i ON (c.id = i.class_id AND i.sequence = 0)
ORDER BY hits desc
LIMIT 2;`,
    [user_id, user_id]
  );
  return result[0];
}

// 클래스 - 내가 찜한 강의
async function getDibs(connection, user_id) {
  const result = await connection.query(
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
  return result[0];
}

// 10초 사진 - 프로필 사진 불러오기
async function getProfileImg(connection, user_id) {
  const result = await connection.query(
    `
    SELECT profile_image
    FROM User
    WHERE id=?
    `,
    user_id
  );
  return result[0];
}
// 10초 사진 업로드
async function createTensPhoto(
  connection,
  userIdx,
  title,
  expertTF,
  pose_image,
  date,
  public,
  profile
) {
  const query = `
  INSERT INTO 10s_photo(user_id,title,expertTF,pose_image,date,profile_image,public)
  VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  const [result] = await connection.query(query, [
    userIdx,
    title,
    expertTF,
    pose_image,
    date,
    profile,
    public,
  ]);
  return result;
}

// 10초 사진 - 상세
async function tensPhotoDetail(connection, id, user_id) {
  const [result] = await connection.query(
    `
    SELECT a.*,DATE_FORMAT(a.date, '%Y-%m-%d') as date,b.nickname
    FROM 10s_photo a
    LEFT JOIN User b ON a.user_id=b.id
    WHERE a.id=? 
    `,
    id
  );
  return result;
}

// 10초 사진 - 게시판에 띄우기
async function getAllTensPhoto(connection) {
  const [result] = await connection.query(
    `
    SELECT a.id,a.title,a.pose_image, DATE_FORMAT(a.date, '%Y-%m-%d') as date,b.nickname
    FROM 10s_photo a
    LEFT JOIN User b ON a.user_id=b.id
    where a.public=1
    order by date desc; 
    `
  );
  return result;
}

// 10초 사진 계정 확인
async function checkId(connection, id) {
  const [result] = await connection.query(
    `
    SELECT user_id
    FROM 10s_photo
    WHERE id=?;
    `,
    id
  );
  return result;
}

// 10초 사진 public 확인(공개, 비공개)
async function public_TF(connection, id) {
  const [result] = await connection.query(
    `
    SELECT public
    FROM 10s_photo
    WHERE id=?;
    `,
    id
  );
  return result;
}
module.exports = {
  takingLecture,
  hotLecGet,
  getWellPhoto,
  getClass,
  getHotClass,
  getDibs,
  getProfileImg,
  createTensPhoto,
  tensPhotoDetail,
  getAllTensPhoto,
  getAd,
  checkId,
  public_TF,
};
