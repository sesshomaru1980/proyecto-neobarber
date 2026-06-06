const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");



const uploadDir =
  path.join(
    __dirname,
    "../../../uploads"
  );

if (
  !fs.existsSync(
    uploadDir
  )
) {
  fs.mkdirSync(
    uploadDir,
    { recursive: true }
  );
}

const storage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        uploadDir
      );
    },

    filename: (
      req,
      file,
      cb
    ) => {

      const uniqueName =

        Date.now()

        +

        path.extname(
          file.originalname
        );

      cb(
        null,
        uniqueName
      );
    }
  });

const upload =
  multer({
    storage
  });

router.post(
  "/image",
  upload.single("image"),
  (
    req,
    res
  ) => {

    console.log(
      "📸 Imagen recibida"
    );

    if (!req.file) {

      return res
        .status(400)
        .json({
          error:
            "Archivo requerido"
        });
    }

    return res.json({

      imageUrl:

        `http://localhost:3000/uploads/${req.file.filename}`
    });
  }
);

module.exports =
  router;