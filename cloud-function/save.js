//Google Cloud function that copies the JSON in the desription field of an SVG doc into the NoSQL (Realtime Firestore) database
//Set trigger to 'file created' in Cloud Storage
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.applicationDefault() });
var db = admin.firestore();
const storage = require('@google-cloud/storage');
const bucket = admin.storage().bucket('continua-bucket');

exports.save = (obj, context) => {
  const ext = obj.name.split('.')[1];
  if (ext==='svg') {
    const file = bucket.file(obj.name).createReadStream();
    var buff = '';
    file.on('data', function(d) {
      buff += d;
    }).on('end', function() {
      db.collection('docs').doc(obj.name).set(JSON.parse(buff.split('<desc>')[1].split('</desc>')[0]));
    });
  }
}
