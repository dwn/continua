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
} catch (err) {
  console.error(err);
}
