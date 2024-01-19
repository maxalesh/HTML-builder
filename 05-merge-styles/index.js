const fs = require('fs');
const path = require('path');
const fsPromises = require('node:fs/promises');

const bundlePath = path.resolve('05-merge-styles\\project-dist\\bundle.css');
const stylesPath = path.resolve('05-merge-styles\\styles');

function createEmptyBundle() {
  fs.open(bundlePath, 'w', (err) => {
    if (err) {
      fs.truncate(bundlePath, (err1) => {
        if (err) {
          console.log(err1);
        }
      });
    }
  });
}

async function mergeStyles(mergePath) {
  const styleFiles = await fsPromises.readdir(path.join(mergePath), {
    withFileTypes: true,
  });

  for (const styleFile of styleFiles) {
    const extName = path.extname(styleFile.name);
    const styleFilePath = path.resolve(`${mergePath}\\${styleFile.name}`);

    if (extName === '.css') {
      fs.readFile(styleFilePath, 'utf-8', (err, data) => {
        fs.appendFile(bundlePath, data, (err1) => {
          if (err1) {
            console.log(err1);
          }
        });
      });
    } else if (!styleFile.isFile()) {
      const nestedStylesFold = path.resolve(`${stylesPath}\\${styleFile.name}`);
      mergeStyles(nestedStylesFold);
    }
  }
}

createEmptyBundle();
mergeStyles(stylesPath);
