////////////////////////////////////////////
// Dan Nielsen
////////////////////////////////////////////
'use strict';
const nconf = (module.exports = require('nconf'));
const path = require('path');
nconf.file({file: path.join(__dirname, './cfg.json')});
// Check for required settings
checkConfig('CLOUD_BUCKET');
checkConfig('SVG_TO_OTF_SERVICE_URL');
checkConfig('PORT');
function checkConfig(setting) {
  if (!nconf.get(setting)) {
    throw new Error(
      `You must set ${setting} in the config file!`
    );
  }
}
