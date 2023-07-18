const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const allowedExtensions = ['.png','.jpg','.jpeg','.bmp'];
const {region,accessKeyId,secretAccessKey} = require("./s3");
const s3 = new S3Client({
  region: region, 
  credentials: {
    accessKeyId: accessKeyId, 
    secretAccessKey: secretAccessKey, 
  },
});

const imageUploader_profile =  multer({
  storage: multerS3({
      s3: s3,
      bucket: "posestion-bucket",
      key: async function(req, file, callback){
        //const uploadDirectory = req.query.directory ?? "";

        const uploadDirectory="profile";
        const extension = path.extname(file.originalname);
        if (!allowedExtensions.includes(extension)) {
          return callback(new Error("wrong extension"));
        }
        const { user_id } = await req.body;
        callback(null, `${uploadDirectory}/${user_id}${extension}`); // 사진 이름를 user_id로 설정
      },
      acl: "public-read-write",
    }),
});

const imageUploader_board = multer({
  storage: multerS3({
    s3: s3,
    bucket: "posestion-bucket",
    key: async function (req, file, callback) {
      const uploadDirectory = "board";
      const extension = path.extname(file.originalname);
      if (!allowedExtensions.includes(extension)) {
        return callback(new Error("wrong extension"));
      }
      const user_id = await req.verifiedToken.userId;
      callback(null, `${uploadDirectory}/${user_id}_${Date.now()}${extension}`); // 각 이미지마다 고유한 이름을 생성
    },
    acl: "public-read-write",
  }),
});

module.exports = {imageUploader_profile:imageUploader_profile, imageUploader_board:imageUploader_board};