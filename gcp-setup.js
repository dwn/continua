////////////////////////////////////////////
// Dan Nielsen
////////////////////////////////////////////
const fs = require('fs');
try {
  if (process.env.GCP_CRED!==undefined) {
    fs.writeFile('gcp.json', process.env.GCP_CRED, (err) => {});
  }
  if(fs.existsSync('gcp.json')) {
    console.log('GCP credential file created successfully');
  } else {
    console.log('ERROR: GCP credential file could not be created');
  }
  // if (process.env.HTTPS_KEY!==undefined) {
    // fs.writeFile('malkachi-key.pem', process.env.HTTPS_KEY, (err) => {});
  // }
  // if(fs.existsSync('malkachi-key.pem')) {
    // console.log('HTTPS key file created successfully');
  // } else {
    // console.log('ERROR: HTTPS key file could not be created');
  // }
  // if (process.env.HTTPS_CERT!==undefined) {
    // fs.writeFile('malkachi-cert.pem', process.env.HTTPS_CERT, (err) => {});
  // }
  // if(fs.existsSync('malkachi-cert.pem')) {
    // console.log('HTTPS cert file created successfully');
  // } else {
    // console.log('ERROR: HTTPS cert file could not be created');
  // }
} catch (err) {
  console.error(err);
}
