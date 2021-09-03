const {
  SOURCE_FOLDER,
  BUILD_FILE,
  BUILD_FILE_COMPRESSED,
  BUILD_FILE_ADV_COMPRESSED,
  COMMIT_LOG_PATH
} = require("./constants");
const { execSync } = require("child_process");
const fs = require("fs");

function getFolderSize(path) {
  const stout = execSync(`ls -l ${path} | awk '{sum+=$5} END {printf sum}'`, {
    encoding: "utf8"
  });
  const bytes = parseInt(stout);
  const kbs = (bytes / 1024).toFixed(2);
  return [bytes, kbs];
}

function getFileSize(path) {
  const stout = execSync(`stat -f '%z' ${path}`, {
    encoding: "utf8"
  });
  const bytes = parseInt(stout);
  const kbs = (bytes / 1024).toFixed(2);
  return [kbs, bytes];
}

function getPercentageChange(a, b) {
  return `${a < b ? "-" : "+"}${Math.abs(Math.round((100 * (b - a)) / b))}%`;
}

function calculate() {
  let LOG_MESSAGE = "";

  // add the current date
  LOG_MESSAGE += `*${new Date().toUTCString()}*\n`;

  // add table header
  LOG_MESSAGE += `| Measure | Size (kb) | Size (bytes) | Reduction |\n`;
  LOG_MESSAGE += `| --- | --- | --- | --- |\n`;

  // source
  const [kb0, bytes0] = getFolderSize(SOURCE_FOLDER);
  LOG_MESSAGE += `| Raw Source Code | ${kb0} kb | ${bytes0} | NA |\n`;

  // build
  const [kb1, bytes1] = getFileSize(BUILD_FILE);
  LOG_MESSAGE += `| Build | ${kb1} kb | ${bytes1} | ${getPercentageChange(
    bytes1,
    bytes0
  )} |\n`;

  // build compressed
  const [kb2, bytes2] = getFileSize(BUILD_FILE_COMPRESSED);
  LOG_MESSAGE += `| Compressed Build | ${kb2} kb | ${bytes2} | ${getPercentageChange(
    bytes2,
    bytes1
  )} |\n`;

  // build adv zip
  const [kb3, bytes3] = getFileSize(BUILD_FILE_ADV_COMPRESSED);
  LOG_MESSAGE += `| Compressed Build (Adv Zip) | ${kb3} kb | ${bytes3} | ${getPercentageChange(
    bytes3,
    bytes2
  )} |\n`;

  // breaks for the next entry:
  LOG_MESSAGE += "\n\n";

  // update the log
  fs.open(COMMIT_LOG_PATH, "a+", (_, fd) => {
    fs.write(fd, LOG_MESSAGE, null, (err) => {
      if (err) throw err;
    });
  });
}

calculate();
