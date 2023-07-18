const classProvider = require("./classProvider");


// 클래스 생성 -> 간단하게 작성하기 위해 그냥 바로 class id 반환하게 작성
async function createClass(connection, title,content,user_id,date) {
  const Query = `
        INSERT INTO board_class(title,content,user_id,date)
        VALUES (?, ?, ?, ?);
    `;
  await connection.query(
    Query,
    [title,content,user_id,date]
  );
  const id = await connection.query(
    `SELECT id FROM board_class WHERE title = ? AND user_id = ? AND date = ?`,
    [title,user_id,date]
  )
  return id;
}

async function createImages(connection,class_id,images){
  for(i=0;i<images.length;i++){
    await connection.query(
      `INSERT INTO board_class_image(class_id,image_url,sequence) VALUES (?, ?, ?)`,
      [class_id,images[i],i]
    );
  }
}
async function createTag(connection,class_id,tags){
  for(i=0;i<tags.length;i++){
      await connection.query(
        `INSERT INTO board_class_tag(class_id,tag_name) VALUES (?,?)`,
        [class_id,tags[i]]
      )
  }
}

async function getClass(connection,id){
    const content = await connection.query( `SELECT c.id AS '클래스 id', c.title AS '제목', c.date AS '게시 날짜', c.content AS '내용', 
          u.nickname AS '게시한 사용자 id',u.profile_image AS '게시한 사용자 프로필 사진' , u.expert AS '게시한 사용자의 전문가 여부' 
          FROM board_class c,User u WHERE c.id= ? and c.user_id = u.id` , id );
    const images = await connection.query( `SELECT i.image_url AS '이미지url', i.sequence AS '이미지 순서 번호' FROM board_class_image i WHERE i.class_id= ?` , id );
    const tags = await connection.query( `SELECT t.tag_name AS '태그 이름' FROM board_class_tag t WHERE t.class_id= ?` , id );
    
    //리뷰에 대한 것도 추가해야함

    
    return { '게시물 ' : content[0] , '게시물 이미지' : images[0] , '게시물 태그' : tags[0] }
}

module.exports = {
  createClass, createImages, createTag, getClass
};
