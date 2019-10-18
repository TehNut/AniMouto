#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const DEST_DIR = path.join(__dirname, '../dist');

function deleteFolderRecursive(path) {
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = path + "/" + file;

      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });

    console.log(`Deleting directory "${path}"...`);
    fs.rmdirSync(path);
  }
}

deleteFolderRecursive(DEST_DIR);
