const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const userProvider = require("../src/app/User/userProvider");
const allowedExtensions = [
  ".png",
  ".jpg",
  ".jpeg",
  ".bmp",
  ".PNG",
  ".JPG",
  ".JPEG",
  ".BMP",
];
const file_allowedExtensions = [
  ".png",
  ".jpg",
  ".jpeg",
  ".bmp",
  ".PNG",
  ".JPG",
  ".JPEG",
  ".BMP",
  ".pdf",
  ".PDF"
];
const { region, accessKeyId, secretAccessKey } = require("./s3");
const s3 = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

const imageUploader_profile = multer({
  storage: multerS3({
    s3: s3,
    bucket: "posestion-bucket",
    key: async function (req, file, callback) {
      //const uploadDirectory = req.query.directory ?? "";

      const uploadDirectory = "profile";
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

const imageUploader_wdyt = multer({
  storage: multerS3({
    s3: s3,
    bucket: "posestion-bucket",
    key: async function (req, file, callback) {
      const uploadDirectory = "wdyt";
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

const imageUploader_pose = multer({
  storage: multerS3({
    s3: s3,
    bucket: "posestion-bucket",
    key: async function (req, file, callback) {
      //const uploadDirectory = req.query.directory ?? "";

      const uploadDirectory = "pose_store";
      const extension = path.extname(file.originalname);
      if (!allowedExtensions.includes(extension)) {
        return callback(new Error("wrong extension"));
      }
      // 사진 이름 pose 자동 생성 id_date~~ 형식으로 변경하기
      const user_id = await userProvider.getIdx_by_user_id(
        req.verifiedToken.userId
      );
      callback(null, `${uploadDirectory}/${user_id}_${Date.now()}${extension}`); // 사진 이름를 user_id로 설정
    },
    acl: "public-read-write",
  }),
});


const fileUploader_inquiry = multer({
  storage: multerS3({
    s3: s3,
    bucket: "posestion-bucket",
    key: async function (req, file, callback) {
      //const uploadDirectory = req.query.directory ?? "";

      const uploadDirectory = "inquiry";
      const extension = path.extname(file.originalname);
      if (!file_allowedExtensions.includes(extension)) {
        return callback(new Error("wrong extension"));
      }
      // 사진 이름 pose 자동 생성 id_date~~ 형식으로 변경하기
      const user_id = await userProvider.getIdx_by_user_id(
        req.verifiedToken.userId
      );
      callback(null, `${uploadDirectory}/${user_id}_${Date.now()}${extension}`); // 사진 이름를 user_id로 설정
    },
    acl: "public-read-write",
  }),
});

async function deleteImageFromS3(key) {
  const params = {
    Bucket: "posestion-bucket", // 해당하는 S3 버킷 이름으로 바꿔야 합니다.
    Key: key, // 삭제할 이미지의 키 (파일 이름)입니다.
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    console.log(`Image with key: ${key} deleted successfully from S3.`);
  } catch (err) {
    console.error("Error deleting image from S3:", err);
    throw err; // 이미지 삭제에 실패하면 에러를 다시 던집니다.
  }
};


module.exports = {imageUploader_profile:imageUploader_profile,   imageUploader_pose: imageUploader_pose,
  imageUploader_board:imageUploader_board , deleteImageFromS3 : deleteImageFromS3 , imageUploader_wdyt : imageUploader_wdyt , fileUploader_inquiry : fileUploader_inquiry};