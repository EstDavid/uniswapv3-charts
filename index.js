// In order to be able to run Google Cloud Storage on React check out:
// https://javascript.plainenglish.io/upload-files-to-google-cloud-storage-from-react-cf839d7361a5

require('dotenv').config()
var { Storage } = require("@google-cloud/storage");
const express = require("express");
var cors = require("cors");
var { format }  = require("util");
var Multer = require( "multer");

const app = express();
const port = process.env.PORT || 5000;

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

app.use(cors());

const bucketName = process.env.BUCKET_NAME;
const credential = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const projectId = process.env.PROJECT_ID

const cloudStorage = new Storage({
  keyFilename: credential,
  projectId: projectId,
});

const bucket = cloudStorage.bucket(bucketName);

// DOWNLOAD FILE
app.get("/get-url/:timeframe/:symbol", (req, res) => {
    console.log('got a request')
    const file = bucket.file(`${req.params.timeframe}/${req.params.symbol}.json`);

    file.download((error, data) => {
        res.status(200).send(data)
    });
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Storage downloader listening at http://localhost:${port}`);
  });
