const fs = require("fs");
const { getRootDirectory, copyDirectory } = require("../utils/fs");
const ROOT_DIR = getRootDirectory();

function getApps() {
  const appIds = fs.readdirSync(`${ROOT_DIR}/apps`)
    .filter(id => !id.startsWith('.')); // Filter out hidden files like .DS_Store
    
  const categorizedApps = {
    Boilerplates: [],
    Templates: []
  };

  appIds.forEach((id) => {
    const app = require(`${ROOT_DIR}/apps/${id}/voltage-create-app-script.js`);
    const appInfo = {
      id,
      name: app.name,
      script: async (opts) => {
        const src = `${ROOT_DIR}/apps/${id}/app`;
        const dest = `${process.cwd()}/${opts.name}`;
        await copyDirectory(src, dest);
        app.script({ ...opts, src, dest });
      },
    };

    if (app.name.includes('Voltage Tipper') || app.name.includes('Kitchen Sink') || app.name.includes('Countdown')) {
      categorizedApps.Templates.push(appInfo);
    } else {
      categorizedApps.Boilerplates.push(appInfo);
    }
  });

  return categorizedApps;
}

module.exports = getApps();
