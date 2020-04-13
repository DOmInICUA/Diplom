let sequelize = require("./../plugins/sequelizeConfig");
const DataTypes = require("sequelize");
const glob = require("glob");
const path = require("path");

const dirs = async dirPath => {
  let dirs = [];
  for (const file of await readdir(dirPath)) {
    if ((await stat(path.join(dirPath, file))).isDirectory()) {
      dirs = [...dirs, path.join(dirPath, file)];
    }
  }
  return dirs;
};

let models = {};
let arr = [];
glob.sync(process.env.ROOT_DIR + "app/models/**/*.js").forEach(function(file) {
  arr.push({
    file: file.replace(/^.*[\\\/]/, "").split(".")[0],
    path: path.resolve(file)
  });
});

arr.map(item => {
  models[item.file] = item.path;
});

for (let model in models) {
  models[model] = require(models[model]).init(sequelize, DataTypes);
}

const associateModels = async models => {
  for (let model in models) {
    if (typeof models[model].associate === "function") {
      models[model].associate(models);
    }
    if (typeof models[model].registerHooks === "function") {
      models[model].registerHooks();
    }
    models[model].sync();
  }

  return models;
};

module.exports = {
  seq: sequelize,
  models: associateModels(models)
};
