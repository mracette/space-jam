const {
  BUILD_FOLDER,
  BUILD_FILE_NAME_COMPRESSED,
  BUILD_FILE_COMPRESSED
} = require("./constants");
const { execSync } = require("child_process");

execSync(`cd ${BUILD_FOLDER}; zip -r -j ${BUILD_FILE_NAME_COMPRESSED} ./*`);

console.log("zip complete: " + BUILD_FILE_COMPRESSED);
