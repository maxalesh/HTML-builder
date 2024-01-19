const fs = require('fs');
const path = require('path');
const fsPromises = require('node:fs/promises');
const copyFilesPath = path.resolve('04-copy-directory\\files-copy');
const filesPath = path.resolve('04-copy-directory\\files');

async function clearDirectory(pathToDir) {
  let files;
  try {
    files = await fsPromises.readdir(path.join(pathToDir));
    for (const file of files) {
      const filePath = path.resolve(`04-copy-directory\\files-copy\\${file}`);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  } catch (e) {
    /* empty */
  }
}

function createDir(pathToDir) {
  fs.open(pathToDir, 'r', (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.mkdir(pathToDir, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  });
}

async function copyDir(dir, newDir) {
  const files = await fsPromises.readdir(path.join(dir));

  for (const file of files) {
    const pathFile = path.resolve(`${dir}\\${file}`);
    const newPathFile = path.resolve(`${newDir}\\${file}`);
    fs.copyFile(pathFile, newPathFile, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
}

clearDirectory(copyFilesPath);
createDir(copyFilesPath);
copyDir(filesPath, copyFilesPath);
