const fsPromises = require('node:fs/promises');
const path = require('path');

async function printInfoFiles(pathDir) {
  const files = await fsPromises.readdir(path.join(pathDir), {
    withFileTypes: true,
  });
  for (const file of files) {
    if (file.isFile()) {
      const extName = path.extname(file.name);
      const pathFile = path.resolve(`${pathDir}\\${file.name}`);
      const fileStat = await fsPromises.stat(pathFile);
      const fileName = path.basename(file.name, extName);

      console.log(`${fileName} - ${extName.slice(1)} - ${fileStat.size}b`);
    }
  }
}

printInfoFiles('03-files-in-folder\\secret-folder');
