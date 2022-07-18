// In order to be able to run Google Cloud Storage on React check out:
// https://javascript.plainenglish.io/upload-files-to-google-cloud-storage-from-react-cf839d7361a5

require('dotenv').config()
var { Storage } = require("@google-cloud/storage");
const express = require("express");
var cors = require("cors");
var { format }  = require("util");
var Multer = require( "multer");
var path = require('path');

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
    const file = bucket.file(`${req.params.timeframe}/${req.params.symbol}.json`);

    // console.log(file)

    file.download((error, data) => {
        res.status(200).send(data)
    });
});

// DOWNLOAD ALL FILENAMES AND CLASSIFY PAIRS ACCORDING TO QUOTE TOKEN
app.get("/get-symbols/:timeframe/", (req, res) => {
  const options = {
    prefix: `${req.params.timeframe}/`,
  };

  bucket.getFiles(options).then((response) => {
    const [files] = response;
    const fileNames = [];

    files.map((file) => {
      // The file name returned by calling file.name is the complete path of the file:
      // e.g.: /30 seconds/WETHUSDC.json
      // The string.substring() function is used to get the symbol out of the file name
      let startCharacter = options.prefix.length;
      let endCharacter = file.name.length - '.json'.length;
      let symbol = file.name.substring(startCharacter, endCharacter);
      fileNames.push(symbol);
    });

    res.status(200).send(fileNames);      
  })
});

app.use(express.static(path.join(__dirname, process.env.HTML_FOLDER)));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.HTML_FOLDER, 'index.html'));
});

app.listen(port, () => {
    console.log(`Storage downloader listening at http://localhost:${port}`);
});