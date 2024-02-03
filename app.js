const express = require("express");
const multer  = require('multer')
const cookieParser = require('cookie-parser')

const postRoutes = require('./routes/posts')
const authRoutes = require('./routes/auth')

const app = express()

app.use(express.json())
app.use(cookieParser())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../client/public/upload")
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

  
app.post("/api/upload", upload.single('file'), function (req, res) {
    const file = req.file;
    res.status(200).json(file.filename)    
})

app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/auth", authRoutes);

app.listen(8000, () => {
    console.log('connected...');
})