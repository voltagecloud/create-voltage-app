const {
  getRootDirectory,
  copyDirectory,
  replaceEnvValue,
} = require("../utils/fs");
const fs = require("fs");
const ROOT_DIR = getRootDirectory();

function getApps() {
  // Get list of folders inside apps directory
  const appIds = fs.readdirSync(`${ROOT_DIR}/apps`);
  return appIds.map((id) => {
    const app = require(`${ROOT_DIR}/apps/${id}/voltage-create-app-script.js`);
    return {
      id,
      name: app.name,
      script: async (opts) => {
        const src = `${ROOT_DIR}/apps/${id}/app`;
        const dest = `${process.cwd()}/${opts.name}`;
        await copyDirectory(src, dest);
        app.script({ ...opts, src, dest });
      },
    };
  });
}

module.exports = getApps();
