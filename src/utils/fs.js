const fs = require("fs-extra");
const path = require("path");

function getRootDirectory() {
  let currentDir = __dirname; // Start from the directory of the current file
  // Traverse up the directory tree until a package.json file is found
  while (!fs.existsSync(path.join(currentDir, "package.json"))) {
    const parentDir = path.resolve(currentDir, "..");
    // Break the loop if we've reached the root directory
    if (parentDir === currentDir) {
      throw new Error("Root directory not found.");
    }
    currentDir = parentDir;
  }
  return currentDir;
}

async function copyDirectory(source, destination) {
  try {
    await fs.copy(source, destination);
  } catch (err) {
    console.error("Error copying directory:", err);
  }
}

function replaceEnvValue(filePath, key, newValue) {
  // Read the content of the .env file
  const content = fs.readFileSync(filePath, "utf8");

  // Replace the value of the specified key
  const regex = new RegExp(`^${key}=.*$`, "gm");
  const modifiedContent = content.replace(regex, `${key}=${newValue}`);

  // Write the modified content back to the .env file
  fs.writeFileSync(filePath, modifiedContent, "utf8");
}

async function getPackageJsonVersion() {
  const dir = getRootDirectory();
  const data = fs.readFileSync(`${dir}/package.json`, "utf8");
  const packageJson = JSON.parse(data);
  return packageJson.version;
}

module.exports = {
  getRootDirectory,
  copyDirectory,
  replaceEnvValue,
  getPackageJsonVersion,
};
