// 포즈상점 게시물 작성
async function poseWrite(connection, pose_info) {
  const Query = `
  INSERT INTO Pose_write(date,view,user_id,title,content,pose_image)
  VALUES (?,?,?,?,?,?);
  `;

  await connection.query(Query, pose_info);
  // Pose_write에서 자동생성 id 불러오기
  const id = await connection.query(
    `SELECT id FROM Pose_write WHERE title = ? AND user_id = ? AND date = ? AND pose_image=?`,
    [pose_info[3], pose_info[2], pose_info[0], pose_info[5]]
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
module.exports = {
  poseWrite,
  poseTag,
  inputBasket,
  repeatPose,
};
