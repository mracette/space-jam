const path = require("path");

const ROOT_FOLDER = path.join(__dirname, "..");
const BUILD_FOLDER = "build";
const BUILD_FILE_NAME_COMPRESSED = "build.zip";
const BUILD_FILE_NAME_ADV_COMPRESSED = "build-final.zip";

module.exports = {
  BUILD_FILE_NAME_COMPRESSED,
  BUILD_FOLDER,
  SOURCE_FOLDER: path.join(ROOT_FOLDER, "src"),
  BUILD_FILE: path.join(ROOT_FOLDER, BUILD_FOLDER, "index.html"),
  BUILD_FILE_COMPRESSED: path.join(ROOT_FOLDER, BUILD_FOLDER, BUILD_FILE_NAME_COMPRESSED),
  BUILD_FILE_ADV_COMPRESSED: path.join(
    ROOT_FOLDER,
    BUILD_FOLDER,
    BUILD_FILE_NAME_ADV_COMPRESSED
  ),
  COMMIT_LOG_PATH: path.join(ROOT_FOLDER, "commit-log.md")
};
