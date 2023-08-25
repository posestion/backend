//getMyPageDrawer


async function getMyPageDrawer(connection, userIdx) {
  const wdyt = await connection.query(
    `SELECT
    w.id, w.title, i.image_url,
    CASE WHEN l.board_WhatDoYouThink_id IS NOT NULL THEN true ELSE false END AS 'like',
    (SELECT count(*) FROM board_WhatDoYouThink_like l WHERE l.board_WhatDoYouThink_id = w.id) AS 'Number_of_like'
    ,(SELECT count(*) FROM board_WhatDoYouThink_comment c WHERE c.board_WhatDoYouThink_id = w.id) 'Number_of_reply'
  FROM
     board_WhatDoYouThink w
  LEFT OUTER JOIN
     board_WhatDoYouThink_like l ON (w.id = l.board_WhatDoYouThink_id AND l.user_id = ? )
  LEFT OUTER JOIN
    board_WhatDoYouThink_images i ON (w.id = i.board_WhatDoYouThink_id AND i.sequence = 0)
  WHERE w.id in (select board_WhatDoYouThink_id from board_WhatDoYouThink_like where user_id = ? )
    order by date desc limit 4 ;` ,[userIdx,userIdx]
  );
  const pose = await connection.query(
    `SELECT
    p.id, p.title, p.pose_image,
    CASE WHEN l.pose_id IS NOT NULL THEN true ELSE false END AS 'like',
    (SELECT count(*) FROM Pose_fav l WHERE l.pose_id = p.id) AS 'Number_of_like'
  FROM
     Pose_write p
  LEFT OUTER JOIN
     Pose_fav l ON (p.id = l.pose_id AND l.user_id = ? )
  WHERE p.id in (select pose_id from Pose_fav where user_id = ? )
  order by id desc
  limit 4;` , [userIdx,userIdx]
  )
  return {"wdyt" : wdyt[0],"pose": pose[0]};
}

async function getLikeWdyt(connection, userIdx) {
  const wdyt = await connection.query(
    `SELECT
    w.id, w.title, i.image_url,
    CASE WHEN l.board_WhatDoYouThink_id IS NOT NULL THEN true ELSE false END AS 'like',
    (SELECT count(*) FROM board_WhatDoYouThink_like l WHERE l.board_WhatDoYouThink_id = w.id) AS 'Number_of_like'
    ,(SELECT count(*) FROM board_WhatDoYouThink_comment c WHERE c.board_WhatDoYouThink_id = w.id) 'Number_of_reply'
  FROM
     board_WhatDoYouThink w
  LEFT OUTER JOIN
     board_WhatDoYouThink_like l ON (w.id = l.board_WhatDoYouThink_id AND l.user_id = ? )
  LEFT OUTER JOIN
    board_WhatDoYouThink_images i ON (w.id = i.board_WhatDoYouThink_id AND i.sequence = 0)
  WHERE w.id in (select board_WhatDoYouThink_id from board_WhatDoYouThink_like where user_id = ? )
    order by date desc;` ,[userIdx,userIdx]
  );
  return wdyt[0];
}
async function getLikePose(connection, userIdx) {
  const pose = await connection.query(
    `SELECT
    p.id, p.title, p.pose_image,
    CASE WHEN l.pose_id IS NOT NULL THEN true ELSE false END AS 'like',
    (SELECT count(*) FROM Pose_fav l WHERE l.pose_id = p.id) AS 'Number_of_like'
  FROM
     Pose_write p
  LEFT OUTER JOIN
     Pose_fav l ON (p.id = l.pose_id AND l.user_id = ? )
  WHERE p.id in (select pose_id from Pose_fav where user_id = ? )
  order by id desc;` , [userIdx,userIdx]
  )
  return pose[0];
}
async function getMyClass(connection,userIdx){
  const myClass = await connection.query(
    `SELECT
    c.id, c.title, i.image_url, c.hits,
    CASE WHEN d.class_id IS NOT NULL THEN true ELSE false END AS 'dibs'
    FROM
    board_class c
    LEFT OUTER JOIN
    board_class_dibs d ON (c.id = d.class_id AND d.user_id = ?)
    LEFT OUTER JOIN
    board_class_image i ON (c.id = i.class_id AND i.sequence = 0) 
    where c.user_id = ? and c.public = true
    order by c.id desc`,
    [userIdx, userIdx]
  );
  return myClass[0];
}



async function getMyContent(connection,userIdx){
  //내가 올린 이사잘
  const wdyt = await connection.query(
    `SELECT
    '이사잘' AS 'category',w.id, w.title, i.image_url AS 'image',  substring(w.content,1,15) AS 'content',
    CASE WHEN l.board_WhatDoYouThink_id IS NOT NULL THEN true ELSE false END AS 'like',
    (SELECT count(*) FROM board_WhatDoYouThink_like l WHERE l.board_WhatDoYouThink_id = w.id) AS 'Number_of_like'
  ,(SELECT count(*) FROM board_WhatDoYouThink_comment c WHERE c.board_WhatDoYouThink_id = w.id) 'Number_of_reply'
  ,w.date
  FROM
     board_WhatDoYouThink w
  LEFT OUTER JOIN
     board_WhatDoYouThink_like l ON (w.id = l.board_WhatDoYouThink_id AND l.user_id = ?)
  LEFT OUTER JOIN
    board_WhatDoYouThink_images i ON (w.id = i.board_WhatDoYouThink_id AND i.sequence = 0)
  WHERE w.user_id = ? and w.public = true
    order by date desc
    limit 4;`,[userIdx,userIdx]
  )
  //내가 올린 10초 사진
  const photo= await connection.query(
    `SELECT p.id,p.title,p.expertTF,p.pose_image,p.date,p.profile_image
    FROM 10s_photo p
    where user_id = ? and public = true
    order by id desc limit 4;`,[userIdx]
  )

  return {'wdyt':wdyt[0],'10s_photo':photo[0]};
}
//getMyContentWdyt
async function getMyContentWdyt(connection,userIdx){
  const wdyt = await connection.query(
    `SELECT
    '이사잘' AS 'category',w.id, w.title, i.image_url AS 'image',  substring(w.content,1,15) AS 'content',
    CASE WHEN l.board_WhatDoYouThink_id IS NOT NULL THEN true ELSE false END AS 'like',
    (SELECT count(*) FROM board_WhatDoYouThink_like l WHERE l.board_WhatDoYouThink_id = w.id) AS 'Number_of_like'
  ,(SELECT count(*) FROM board_WhatDoYouThink_comment c WHERE c.board_WhatDoYouThink_id = w.id) 'Number_of_reply'
  ,w.date
  FROM
     board_WhatDoYouThink w
  LEFT OUTER JOIN
     board_WhatDoYouThink_like l ON (w.id = l.board_WhatDoYouThink_id AND l.user_id = ?)
  LEFT OUTER JOIN
    board_WhatDoYouThink_images i ON (w.id = i.board_WhatDoYouThink_id AND i.sequence = 0)
  WHERE w.user_id = ? and w.public = true
    order by date desc;`,[userIdx,userIdx]
  )
  return wdyt[0];
}
async function getMyContent10sPhoto(connection,userIdx){
  //내가 올린 10초 사진
  const photo= await connection.query(
    `SELECT p.id,p.title,p.expertTF,p.pose_image,p.date,p.profile_image
    FROM 10s_photo p
    where user_id = ? and public = true
    order by id desc;`,[userIdx]
  )

  return photo[0];
}
//getUserClass
async function getUserClass(connection,userIdx,profileIdx){
  const UserClass = await connection.query(
    `SELECT
    c.id, c.title, i.image_url, c.hits,
    CASE WHEN d.class_id IS NOT NULL THEN true ELSE false END AS 'dibs'
    FROM
    board_class c
    LEFT OUTER JOIN
    board_class_dibs d ON (c.id = d.class_id AND d.user_id = ?)
    LEFT OUTER JOIN
    board_class_image i ON (c.id = i.class_id AND i.sequence = 0) 
    where c.user_id = ? and c.public = true
    order by c.id desc`,
    [userIdx, profileIdx]
  );
  return UserClass[0];
}
//getUserContent
async function getUserContent(connection,userIdx,profileIdx){
  const wdyt = await connection.query(
    `SELECT
    '이사잘' AS 'category',w.id, w.title, i.image_url AS 'image',  substring(w.content,1,15) AS 'content',
    CASE WHEN l.board_WhatDoYouThink_id IS NOT NULL THEN true ELSE false END AS 'like',
    (SELECT count(*) FROM board_WhatDoYouThink_like l WHERE l.board_WhatDoYouThink_id = w.id) AS 'Number_of_like'
  ,(SELECT count(*) FROM board_WhatDoYouThink_comment c WHERE c.board_WhatDoYouThink_id = w.id) 'Number_of_reply'
  ,w.date
  FROM
     board_WhatDoYouThink w
  LEFT OUTER JOIN
     board_WhatDoYouThink_like l ON (w.id = l.board_WhatDoYouThink_id AND l.user_id = ?)
  LEFT OUTER JOIN
    board_WhatDoYouThink_images i ON (w.id = i.board_WhatDoYouThink_id AND i.sequence = 0)
  WHERE w.user_id = ? and w.public = true
    order by date desc limit 4;`,[userIdx,profileIdx]
  )
    //내가 올린 10초 사진
    const photo= await connection.query(
      `SELECT p.id,p.title,p.expertTF,p.pose_image,p.date,p.profile_image
      FROM 10s_photo p
      where user_id = ? and public = true
      order by id desc limit 4;`,[profileIdx]
    )
  
  return {'wdyt':wdyt[0],'10s_photo':photo[0]};

}
//getUserContent_wdyt
async function getUserContent_wdyt(connection,userIdx,profileIdx){
  const wdyt = await connection.query(
    `SELECT
    '이사잘' AS 'category',w.id, w.title, i.image_url AS 'image',  substring(w.content,1,15) AS 'content',
    CASE WHEN l.board_WhatDoYouThink_id IS NOT NULL THEN true ELSE false END AS 'like',
    (SELECT count(*) FROM board_WhatDoYouThink_like l WHERE l.board_WhatDoYouThink_id = w.id) AS 'Number_of_like'
  ,(SELECT count(*) FROM board_WhatDoYouThink_comment c WHERE c.board_WhatDoYouThink_id = w.id) 'Number_of_reply'
  ,w.date
  FROM
     board_WhatDoYouThink w
  LEFT OUTER JOIN
     board_WhatDoYouThink_like l ON (w.id = l.board_WhatDoYouThink_id AND l.user_id = ?)
  LEFT OUTER JOIN
    board_WhatDoYouThink_images i ON (w.id = i.board_WhatDoYouThink_id AND i.sequence = 0)
  WHERE w.user_id = ? and w.public = true
    order by date desc;`,[userIdx,profileIdx]
  )
  return wdyt[0];
}
//getUserContent_10sPhoto
async function getUserContent_10sPhoto(connection,userIdx,profileIdx){
    //내가 올린 10초 사진
    const photo= await connection.query(
      `SELECT p.id,p.title,p.expertTF,p.pose_image,p.date,p.profile_image
      FROM 10s_photo p
      where user_id = ? and public = true
      order by id desc;`,[profileIdx]
    )
  
  return photo[0];

}
//getMyPage_wdyt
async function getMyPage_wdyt(connection,userIdx){
  const wdyt = await connection.query(
    `SELECT
    w.id, w.title, i.image_url AS 'image',  substring(w.content,1,15) AS 'content',
    CASE WHEN l.board_WhatDoYouThink_id IS NOT NULL THEN true ELSE false END AS 'like',
    (SELECT count(*) FROM board_WhatDoYouThink_like l WHERE l.board_WhatDoYouThink_id = w.id) AS 'Number_of_like'
  ,(SELECT count(*) FROM board_WhatDoYouThink_comment c WHERE c.board_WhatDoYouThink_id = w.id) 'Number_of_reply'
  ,w.date
  FROM
     board_WhatDoYouThink w
  LEFT OUTER JOIN
     board_WhatDoYouThink_like l ON (w.id = l.board_WhatDoYouThink_id AND l.user_id = ?)
  LEFT OUTER JOIN
    board_WhatDoYouThink_images i ON (w.id = i.board_WhatDoYouThink_id AND i.sequence = 0)
  WHERE w.user_id = ? and w.public = false
    order by date desc;`,[userIdx,userIdx]
  )
  return wdyt[0];
}
async function getMyPage_10sPhoto(connection,userIdx){
  //내가 올린 10초 사진
  const photo= await connection.query(
    `SELECT p.id,p.title,p.expertTF,p.pose_image,p.date,p.profile_image
    FROM 10s_photo p
    where user_id = ? and public = false
    order by id desc;`,[userIdx]
  )
  return photo[0];
}
async function getMyPage_class(connection,userIdx){
  const UserClass = await connection.query(
    `SELECT
    c.id, c.title, i.image_url, c.hits,
    CASE WHEN d.class_id IS NOT NULL THEN true ELSE false END AS 'dibs'
    FROM
    board_class c
    LEFT OUTER JOIN
    board_class_dibs d ON (c.id = d.class_id AND d.user_id = ?)
    LEFT OUTER JOIN
    board_class_image i ON (c.id = i.class_id AND i.sequence = 0) 
    where c.user_id = ? and c.public = false
    order by c.id desc`,
    [userIdx, userIdx]
  );
  return UserClass[0];
}


//getUserProfile
async function getUserProfile(connection,userIdx,profileIdx){
  const info = await connection.query(
    `SELECT
    (select expert from User where id = ? ) AS 'expert',
    (select profile_image from User where id = ? ) AS 'profile_image',
    (select nickname from User where id = ? ) AS 'nickname',
    (SELECT COUNT(*) FROM board_class WHERE user_id = ?) +
    (SELECT COUNT(*) FROM Pose_write WHERE user_id = ?) +
    (SELECT COUNT(*) FROM board_WhatDoYouThink WHERE user_id = ?) AS 'post_count',
    (select count(*) from follow where user_id = ? ) AS 'follower',
      (select count(*) from follow where follower_id = ? ) AS 'following',
      (select introduction from User where id = ? ) AS 'inroduction',
      (select  CASE WHEN Count(*) = 1  THEN true ELSE false END 
  from follow where user_id = ? and follower_id = ? ) AS 'follow'`
  ,[profileIdx,profileIdx,profileIdx,profileIdx ,profileIdx,profileIdx,profileIdx,profileIdx,profileIdx,profileIdx,userIdx]
  )
  //올린 컨텐츠
  const wdyt = await connection.query(
    `SELECT
    w.id, w.title, i.image_url AS 'image',  substring(w.content,1,15) AS 'content',
    CASE WHEN l.board_WhatDoYouThink_id IS NOT NULL THEN true ELSE false END AS 'like',
    (SELECT count(*) FROM board_WhatDoYouThink_like l WHERE l.board_WhatDoYouThink_id = w.id) AS 'Number_of_like'
  ,(SELECT count(*) FROM board_WhatDoYouThink_comment c WHERE c.board_WhatDoYouThink_id = w.id) 'Number_of_reply'
  ,w.date
  FROM
     board_WhatDoYouThink w
  LEFT OUTER JOIN
     board_WhatDoYouThink_like l ON (w.id = l.board_WhatDoYouThink_id AND l.user_id = ?)
  LEFT OUTER JOIN
    board_WhatDoYouThink_images i ON (w.id = i.board_WhatDoYouThink_id AND i.sequence = 0)
  WHERE w.user_id = ? and w.public = true
    order by date desc
    limit 3;`,[userIdx,profileIdx]
  )
  if (info[0][0].expert){
    const UserClass = await connection.query(
      `SELECT
      c.id, c.title, i.image_url, c.hits,
      CASE WHEN d.class_id IS NOT NULL THEN true ELSE false END AS 'dibs'
      FROM
      board_class c
      LEFT OUTER JOIN
      board_class_dibs d ON (c.id = d.class_id AND d.user_id = ?)
      LEFT OUTER JOIN
      board_class_image i ON (c.id = i.class_id AND i.sequence = 0) 
      where c.user_id = ? and c.public = true
      order by c.id desc
      limit 3`,
      [userIdx, profileIdx]
    );
    return [info[0][0],{'class':UserClass[0],'content':wdyt[0]}];
  }
  else{
    return [info[0][0],{'content':wdyt[0]}];
  }
  

}

//getUserProfile
async function getMyPage(connection,userIdx){
  //기본 정보
  const info = await connection.query(
    `SELECT
    (select expert from User where id = ? ) AS 'expert',
    (select profile_image from User where id = ? ) AS 'profile_image',
    (select nickname from User where id = ? ) AS 'nickname',
    (SELECT COUNT(*) FROM board_class WHERE user_id = ?) +
    (SELECT COUNT(*) FROM Pose_write WHERE user_id = ?) +
    (SELECT COUNT(*) FROM board_WhatDoYouThink WHERE user_id = ?) AS 'post_count',
    (select count(*) from follow where user_id = ? ) AS 'follower',
      (select count(*) from follow where follower_id = ? ) AS 'following',
      (select introduction from User where id = ? ) AS 'inroduction'`
  ,[userIdx,userIdx,userIdx,userIdx ,userIdx,userIdx,userIdx,userIdx,userIdx,userIdx]
  )
  // 내가 올린 컨텐츠(내가 올린 이사잘)
  const wdyt = await connection.query(
    `SELECT
    '이사잘' AS 'category',w.id, w.title, i.image_url AS 'image',  substring(w.content,1,15) AS 'content',
    CASE WHEN l.board_WhatDoYouThink_id IS NOT NULL THEN true ELSE false END AS 'like',
    (SELECT count(*) FROM board_WhatDoYouThink_like l WHERE l.board_WhatDoYouThink_id = w.id) AS 'Number_of_like'
  ,(SELECT count(*) FROM board_WhatDoYouThink_comment c WHERE c.board_WhatDoYouThink_id = w.id) 'Number_of_reply'
  ,w.date
  FROM
     board_WhatDoYouThink w
  LEFT OUTER JOIN
     board_WhatDoYouThink_like l ON (w.id = l.board_WhatDoYouThink_id AND l.user_id = ?)
  LEFT OUTER JOIN
    board_WhatDoYouThink_images i ON (w.id = i.board_WhatDoYouThink_id AND i.sequence = 0)
  WHERE w.user_id = ?
    order by date desc
    limit 4;`,[userIdx,userIdx]
  )
  //포즈서랍, 내가 올린 포즈
  const pose = await connection.query(
    `SELECT
    '포즈 상점' AS 'category',p.id, p.title, p.pose_image AS 'image',substring(p.content,1,15) AS 'content', 
    CASE WHEN l.pose_id IS NOT NULL THEN true ELSE false END AS 'like',
    (SELECT count(*) FROM Pose_fav l WHERE l.pose_id = p.id) AS 'Number_of_like'
    ,p.date
  FROM
     Pose_write p
  LEFT OUTER JOIN
     Pose_fav l ON (p.id = l.pose_id AND l.user_id = ?)
  WHERE p.user_id = ?
  order by id desc
  limit 5; `,[userIdx,userIdx]
  )

  if (info[0][0].expert){
    const UserClass = await connection.query(
      `SELECT
      c.id, c.title, i.image_url, c.hits,
      CASE WHEN d.class_id IS NOT NULL THEN true ELSE false END AS 'dibs'
      FROM
      board_class c
      LEFT OUTER JOIN
      board_class_dibs d ON (c.id = d.class_id AND d.user_id = ?)
      LEFT OUTER JOIN
      board_class_image i ON (c.id = i.class_id AND i.sequence = 0) 
      where c.user_id = ? and c.public = true
      order by c.id desc
      limit 3`,
      [userIdx, userIdx]
    );
    return [info[0][0],{'class':UserClass[0],'poseDrawer':pose[0],'myContent':wdyt[0]}];
  }
  else{
    return [info[0][0],{'poseDrawer':pose[0],'myContent':wdyt[0]}];
  }

}
//getPoseDrawer
async function getPoseDrawer(connection,userIdx){

  const poseDrawer = await connection.query(`SELECT
  p.id, p.title, p.pose_image AS 'image',
  CASE WHEN l.pose_id IS NOT NULL THEN true ELSE false END AS 'like',
  (SELECT count(*) FROM Pose_fav l WHERE l.pose_id = p.id) AS 'Number_of_like'
  ,p.date
FROM
   Pose_write p
LEFT OUTER JOIN
   Pose_fav l ON (p.id = l.pose_id AND l.user_id = ?)
WHERE p.user_id = ? 
order by id desc`,[userIdx,userIdx]);
  return poseDrawer[0];
}

module.exports = {
  getMyPageDrawer,
  getLikeWdyt,
  getLikePose,
  getMyClass,
  getMyContent,
  getUserClass,
  getUserContent,
  getUserProfile,
  getMyPage,
  getPoseDrawer,
  getMyContentWdyt,
  getMyContent10sPhoto,
  getUserContent_wdyt,
  getUserContent_10sPhoto,
  getMyPage_class,
  getMyPage_10sPhoto,
  getMyPage_wdyt
}