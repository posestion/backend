const { deleteImageFromS3 } = require("../../../config/imageUploader");

// 이미지 지우기
async function deleteImages(images) {
  for (i = 0; i < images.length; i++) {
    await deleteImageFromS3(images[i].key);
  }
}
// 포즈상점 게시물 작성
async function poseWrite(connection, pose_info) {
  const Query = `
  INSERT INTO Pose_write(date,user_id,title,content,pose_image)
  VALUES (?,?,?,?,?);
  `;

  await connection.query(Query, pose_info);
  // Pose_write에서 자동생성 id 불러오기
  const id = await connection.query(
    `SELECT id FROM Pose_write WHERE title = ? AND user_id = ? AND date = ? AND pose_image=?`,
    [pose_info[2], pose_info[1], pose_info[0], pose_info[4]]
  );
  return id;
}

// 태그 저장
async function poseTag(connection, pose_id, tags) {
  for (i = 0; i < tags.length; i++) {
    await connection.query(
      `INSERT INTO Pose_tag(pose_id,tag_name) VALUES (?,?);`,
      [pose_id, tags[i]]
    );
  }
}

// 포즈 장바구니 저장
async function inputBasket(connection, px) {
  const query = `
  INSERT INTO Pose_basket(user_id,pose_id,input_date)
  VALUES (?,?,?);
  `;
  const [basket] = await connection.query(query, px);
  return basket;
}

// 이미 저장한 pose인지 확인
async function repeatPose(connection, user_idx, pose_id) {
  const query = `
  SELECT user_id,pose_id
  FROM Pose_basket
  WHERE user_id=? AND pose_id=?;
  `;
  const [check] = await connection.query(query, [user_idx, pose_id]);
  return check;
}

// 포즈 상세 게시글 보기
async function poseDetail(connection, id) {
  const query = `
  SELECT DATE_FORMAT(date, '%Y-%m-%d') as date,view,user_id,title,content,pose_image
  FROM Pose_write
  WHERE id=?
  `;
  const [detailWrite] = await connection.query(query, id);
  return detailWrite;
}

// 테이블에 있는 pose_id 인지 확인
async function pose_id_check(connection, pose_id) {
  const query = `
  SELECT *
  FROM Pose_write
  WHERE id=?
  `;
  const [result] = await connection.query(query, pose_id);
  return result;
}

async function Tag(connection, id) {
  const query = `
  SELECT tag_name
  FROM Pose_tag
  WHERE pose_id=?
  `;
  const [tags] = await connection.query(query, id);
  return tags;
}
// 조회수 +1
async function inputview(connection, id, view) {
  const query = `
  UPDATE Pose_write
  SET view=?
  WHERE id=?
  `;
  const [newView] = await connection.query(query, [view, id]);
  return newView;
}
// 장바구니 보기 위해 pose_id 조회
async function poseBasket(connection, user_id) {
  const [baskets] = await connection.query(
    `
  SELECT pose_id 
  FROM Pose_basket
  WHERE user_id=?
  `,
    user_id
  );

  return baskets;
}

// pose_id에 연결된 게시글들 가져오기
async function savedPose(connection, savedPose) {
  const query = `
    SELECT *,DATE_FORMAT(date, '%Y-%m-%d') as date
    FROM Pose_write
    WHERE id = ?;
  `;

  const results = [];
  for (let i = 0; i < savedPose.length; i++) {
    const [result] = await connection.query(query, savedPose[i]["pose_id"]);
    console.log(result);
    if (result.length > 0) {
      results.push(result[0]);
    }
  }
  return results;
}

// 포즈상점 전체 보기
async function storeAll(connection) {
  const [results] = await connection.query(`
    SELECT a.id,DATE_FORMAT(a.date, '%Y-%m-%d') as date,a.view,a.user_id,a.title,a.content,a.pose_image, JSON_ARRAYAGG(b.tag_name) as tag_name 
    FROM Pose_write a
    LEFT JOIN Pose_tag b ON a.id = b.pose_id
    GROUP BY a.id
  `); // JSON_ARRAYAGG:배열로 묶기, GROUP_CONCAT:쉼표로 구분되는 문자열로 묶기

  return results;
}

// 검색
async function search(connection, word) {
  // pose_id 불러오기
  const query = `
    SELECT DISTINCT pose_id
    FROM Pose_tag
    WHERE tag_name LIKE ?
  `;
  const searchTerm = `%${word}%`; // '%'는 와일드카드로서 어떤 문자열도 매칭되도록 해줍니다.
  const [poseid_result] = await connection.query(query, searchTerm);
  console.log(poseid_result);
  // 불러온 pose_id로 게시글 불러오기
  // Pose_tag,Pose_write join으로 묶기
  const Query = `
  SELECT a.*,DATE_FORMAT(date, '%Y-%m-%d') as date, JSON_ARRAYAGG(b.tag_name) as tag_name 
  FROM Pose_write a
  LEFT JOIN Pose_tag b ON a.id = b.pose_id
  WHERE a.id IN (?)
  GROUP BY a.id
  `;
  // const [result] = await connection.query(Query, poseid_result);
  const results = [];
  for (let i = 0; i < poseid_result.length; i++) {
    const [result] = await connection.query(Query, poseid_result[i]["pose_id"]);
    console.log(result);
    if (result.length > 0) {
      results.push(result[0]);
    }
  }
  return results;
}

// 장바구니 포즈 삭제
async function basketDel(connection, user_id, pose_id) {
  const query = `
  DELETE FROM Pose_basket
  WHERE user_id=? and pose_id=?
  `;
  const [result] = await connection.query(query, [user_id, pose_id]);
  return result;
}

// 즐겨찾기 추가
async function addFavorites(connection, user_id, pose_id) {
  const query = `
  INSERT INTO Pose_fav(user_id,pose_id)
  VALUES (?,?)
  `;
  const [result] = await connection.query(query, [user_id, pose_id]);
  return result;
}

// 즐겨찾기 삭제
async function delFavorites(connection, user_id, pose_id) {
  const query = `
  DELETE FROM Pose_fav
  WHERE user_id=? and pose_id=?
  `;
  const [result] = await connection.query(query, [user_id, pose_id]);
  return result;
}

// 즐겨찾기 조회(좋아요 게시판)
async function favoritesView(connection, user_id) {
  const query = `
  SELECT pose_id
  FROM Pose_fav
  WHERE user_id=?
  `;
  const [result] = await connection.query(query, user_id);
  console.log(result);
  const Query = `
  SELECT a.*,DATE_FORMAT(date, '%Y-%m-%d') as date, JSON_ARRAYAGG(b.tag_name) as tag_name 
  FROM Pose_write a
  LEFT JOIN Pose_tag b ON a.id = b.pose_id
  WHERE a.id IN (?)
  GROUP BY a.id
  `;

  const n_results = [];
  for (let i = 0; i < result.length; i++) {
    const [results] = await connection.query(Query, result[i]["pose_id"]);
    console.log(result);
    if (results.length > 0) {
      n_results.push(results[0]);
    }
  }

  return n_results;
}
// hot 게시판 조회
async function viewHotboard(connection) {
  const [result] = await connection.query(`
  SELECT pose_id,COUNT(*) as frequency
  FROM Pose_fav
  GROUP BY pose_id
  ORDER BY frequency DESC;
  `);
  const Query = `
  SELECT a.*,DATE_FORMAT(date, '%Y-%m-%d') as date , (SELECT count(*) FROM Pose_fav WHERE pose_id = a.id) AS "fav_count", JSON_ARRAYAGG(b.tag_name) as tag_name
  FROM Pose_write a
  LEFT JOIN Pose_tag b ON a.id = b.pose_id
  WHERE a.id IN (?)
  GROUP BY a.id
  `;

  const n_results = [];
  for (let i = 0; i < result.length; i++) {
    const [results] = await connection.query(Query, result[i]["pose_id"]);
    console.log(result);
    if (results.length > 0) {
      n_results.push(results[0]);
    }
  }
  return n_results;
}

// 검색 - hot 게시판
async function searchHot(connection, word) {
  // pose_id와 좋아요 수를 함께 불러오기
  const query = `
    SELECT a.id AS pose_id, COUNT(pf.pose_id) AS frequency
    FROM Pose_write a
    LEFT JOIN Pose_tag b ON a.id = b.pose_id
    LEFT JOIN Pose_fav pf ON a.id = pf.pose_id
    WHERE b.tag_name LIKE ?
    GROUP BY a.id
  `;
  const searchTerm = `%${word}%`;
  const [poseid_result] = await connection.query(query, searchTerm);

  const poseIds = poseid_result.map((result) => result.pose_id);

  if (poseIds.length === 0) {
    return [];
  }

  const Query = `
    SELECT a.*, DATE_FORMAT(a.date, '%Y-%m-%d') AS date, JSON_ARRAYAGG(b.tag_name) AS tag_name, COALESCE(p.frequency, 0) AS fav_count
    FROM Pose_write a
    LEFT JOIN Pose_tag b ON a.id = b.pose_id
    LEFT JOIN (
      SELECT pose_id, COUNT(*) AS frequency
      FROM Pose_fav
      GROUP BY pose_id
    ) p ON a.id = p.pose_id
    WHERE a.id IN (${poseIds.join(",")})
    GROUP BY a.id
    order by fav_count desc;
  `;

  const [results] = await connection.query(Query);

  return results;
}

// 필터(인기순) 조회
async function filpopular(connection) {
  const [result] = await connection.query(`
    SELECT *, 
           DATE_FORMAT(date, '%Y-%m-%d') AS date, 
           (SELECT COUNT(*) FROM Pose_fav WHERE pose_id = a.id) AS "fav_count", 
           GROUP_CONCAT(b.tag_name) AS tag_names
    FROM Pose_write a
    LEFT JOIN Pose_tag b ON a.id = b.pose_id
    GROUP BY a.id
    ORDER BY view DESC;
  `);

  return result.map((row) => ({
    ...row,
    tag_names: row.tag_names ? row.tag_names.split(",") : [],
  }));
}

// 필터(최신순) 조회
async function filterDate(connection) {
  const [result] = await connection.query(`
    SELECT *, 
           DATE_FORMAT(date, '%Y-%m-%d') AS date, 
           (SELECT COUNT(*) FROM Pose_fav WHERE pose_id = p.id) AS "fav_count", 
           GROUP_CONCAT(b.tag_name) AS tag_names
    FROM Pose_write p
    LEFT JOIN Pose_tag b ON p.id = b.pose_id
    GROUP BY p.id
    ORDER BY p.id DESC;
    `);

  return result.map((row) => ({
    ...row,
    tag_names: row.tag_names ? row.tag_names.split(",") : [],
  }));
}

// 입력한 pose_id 장바구니에 있는지 확인
async function basket_pose_check(connection, pose_id, user_id) {
  const query = `
  SELECT *
  FROM Pose_basket
  WHERE pose_id=? and user_id=?
  `;
  const [result] = await connection.query(query, [pose_id, user_id]);
  return result;
}

// 입력한 pose_id 즐겨찾기에 있는지 확인
async function fav_pose_check(connection, pose_id, user_id) {
  const query = `
  SELECT *
  FROM Pose_fav
  WHERE pose_id=? and user_id=?
  `;
  const [result] = await connection.query(query, [pose_id, user_id]);
  return result;
}
// 즐겨찾기에 같은 포즈 중복 저장하려고 하는지 확인
async function fav_repeatPose(connection, user_idx, pose_id) {
  const query = `
  SELECT user_id,pose_id
  FROM Pose_fav
  WHERE user_id=? AND pose_id=?;
  `;
  const [check] = await connection.query(query, [user_idx, pose_id]);
  return check;
}

async function getPoseWriterByPoseId(connection, id) {
  const result = await connection.query(
    `SELECT user_id FROM Pose_write WHERE id = ?`,
    id
  );
  return result[0];
}

// 포즈 삭제
async function deletePoseWrite(connection, id) {
  const separator = "posestion-bucket.s3.us-east-1.amazonaws.com/";
  var image_url = await connection.query(
    `SELECT pose_image FROM Pose_write WHERE id = ?`,
    id
  );
  console.log(image_url[0][0].pose_image);
  image_url = image_url[0][0].pose_image;
  var index = image_url.indexOf(separator);
  var result = image_url.slice(index + separator.length);
  await deleteImageFromS3(result);
  await connection.query(`DELETE FROM Pose_write WHERE id = ?`, id);
}

// 나이
async function getBirthday(connection, user_id) {
  const [result] = await connection.query(
    `
    SELECT ROUND((TO_DAYS(NOW()) - TO_DAYS(birth.date)) / 365) AS age
    FROM (  
      SELECT DATE_FORMAT(birth, '%Y-%m-%d') AS date
      FROM User
      WHERE id=?
    ) AS birth
    `,
    user_id
  );

  return result;
}

// 연령대별
async function getPoseData(
  connection,
  birth,
  orderByDate = false,
  orderByView = false
) {
  const ageQuery = `
    SELECT 
        CASE
            WHEN ${birth} BETWEEN 0 AND 9 THEN CONCAT('BETWEEN ''2014-01-01'' AND ''2023-12-31''')
            WHEN ${birth} BETWEEN 10 AND 19 THEN CONCAT('BETWEEN ''2004-01-01'' AND ''2013-12-31''')
            WHEN ${birth} BETWEEN 20 AND 29 THEN CONCAT('BETWEEN ''1994-01-01'' AND ''2003-12-31''')
            WHEN ${birth} BETWEEN 30 AND 39 THEN CONCAT('BETWEEN ''1984-01-01'' AND ''1993-12-31''')
            WHEN ${birth} BETWEEN 40 AND 49 THEN CONCAT('BETWEEN ''1974-01-01'' AND ''1983-12-31''')
            ELSE '생일 입력 안 함'
        END AS age_group
  `;

  const [ageResult] = await connection.query(ageQuery);
  const ageRange = ageResult[0].age_group;

  let secondQuery = `
    SELECT a.*, 
           DATE_FORMAT(date, '%Y-%m-%d') AS date, 
           GROUP_CONCAT(b.tag_name) AS tag_names
    FROM Pose_write a
    JOIN User u ON a.user_id = u.id
    LEFT JOIN Pose_tag b ON a.id = b.pose_id
    WHERE 
      u.birth ${ageRange}
    GROUP BY a.id
  `;

  if (orderByDate) {
    secondQuery += "ORDER BY a.id DESC;";
  } else if (orderByView) {
    secondQuery += "ORDER BY a.view desc;";
  }

  const [poseResult] = await connection.query(secondQuery);

  return poseResult.map((row) => ({
    ...row,
    tag_names: row.tag_names ? row.tag_names.split(",") : [],
  }));
}

// 연령대별
async function ageGroupGet(connection, birth) {
  return await getPoseData(connection, birth);
}

// 연령대별 - 최신 순
async function ageNewest(connection, birth) {
  return await getPoseData(connection, birth, true, false);
}

// 연령대별 - 인기 순
async function agePopular(connection, birth) {
  return await getPoseData(connection, birth, false, true);
}

module.exports = {
  poseWrite,
  poseTag,
  inputBasket,
  repeatPose,
  poseDetail,
  inputview,
  poseBasket,
  savedPose,
  storeAll,
  Tag,
  search,
  basketDel,
  addFavorites,
  delFavorites,
  favoritesView,
  viewHotboard,
  filpopular,
  filterDate,
  pose_id_check,
  basket_pose_check,
  fav_pose_check,
  fav_repeatPose,
  getPoseWriterByPoseId,
  deletePoseWrite,
  getBirthday,
  ageGroupGet,
  ageNewest,
  agePopular,
  searchHot,
};
