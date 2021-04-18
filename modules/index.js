const path = require('path');
const fs = require('fs');

const obj = { ctrl: {}, mdw: {} };

// Import des controlleurs
fs.readdirSync(path.join(__dirname, './controller'))
  .filter((file) => {
    return file.indexOf('.') !== 0 && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    obj.ctrl[file] = require(path.join(__dirname, './controller/', file));
  });

// Import Middleware
fs.readdirSync(path.join(__dirname, './middleware'))
  .filter((file) => {
    return file.indexOf('.') !== 0 && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    obj.ctrl[file] = require(path.join(__dirname, './middleware/', file));
  });

module.exports = obj;
