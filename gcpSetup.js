// From 
// https://dilushadasanayaka.medium.com/a-better-way-to-authenticate-google-cloud-services-on-heroku-for-node-js-app-93a0751967dc
var fs=require('fs');

fs.writeFile(process.env.GCP_KEY_FILE, process.env.GCP_CRED, (err) => {});