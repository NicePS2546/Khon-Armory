const fs = require("fs");
const path = require("path");

function isValidString(str) {
  return /^[^\/][a-zA-Z0-9_.-]*$/.test(str);
}

function test1(text) {
  return text;
}
function test2(text) {
  return text + " Hi";
}
const modules = {};

fs.readdirSync(__dirname).forEach((file) => {
  if (file === "index.js" || !file.endsWith(".js")) return;
  const moduleName = path.basename(file, ".js");
  modules[moduleName] = require(`./${file}`);
});

modules.isValidString = isValidString;
modules.test1 = test1;
modules.test2 = test2;

module.exports = modules;
