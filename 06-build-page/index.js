const fs = require('fs');
const path = require('path');
const fsPromises = require('node:fs/promises');

const currDirPath = path.resolve('06-build-page');
const distPath = path.join('06-build-page\\project-dist');
const stylePath = path.join(distPath, 'style.css');
const stylesPath = path.resolve('06-build-page\\styles');

function createEmptyFile(pathFile) {
  fs.open(pathFile, 'w', (err) => {
    if (err) {
      fs.truncate(pathFile, (err1) => {
        if (err1) {
          console.error(err1);
        }
      });
    }
  });
}

function createDist() {
  const indexPath = path.join(distPath, 'index.html');

  fs.mkdir(path.join(currDirPath, 'project-dist'), (err) => {
    if (err && err.code !== 'EEXIST') {
      console.error(err);
    }
  });

  fs.mkdir(path.join(distPath, 'assets'), (err) => {
    if (err && err.code !== 'EEXIST') {
      console.error(err);
    }
  });

  createEmptyFile(indexPath);
  createEmptyFile(stylePath);
}

function createDir(pathToDir) {
  fs.open(pathToDir, 'r', (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.mkdir(pathToDir, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    }
  });
}

async function copyDir(dir, newDir) {
  const files = await fsPromises.readdir(dir, {
    withFileTypes: true,
  });
  for (const file of files) {
    if (file.isFile()) {
      const pathFile = path.resolve(`${dir}\\${file.name}`);
      const newPathFile = path.resolve(`${newDir}\\${file.name}`);
      fs.copyFile(pathFile, newPathFile, (err) => {
        if (err) {
          console.error(err);
        }
      });
    } else if (file.isDirectory()) {
      const nestedDir = path.join(dir, file.name);
      const nestedNewDir = path.join(newDir, file.name);
      createDir(nestedNewDir);
      copyDir(nestedDir, nestedNewDir);
    }
  }
}

function getContentFile(file) {
  const templatePath = path.resolve(
    '06-build-page\\components',
    `${file}.html`,
  );

  let res = fsPromises.readFile(templatePath, 'utf8');
  return res;
}

async function replaceTemplateTags(template) {
  let res = template;
  const regExp = /{{[a-z]+}}/gi;
  const regExp2 = /[{}]/g;
  const tagTemplates = template.match(regExp);

  for (let i = 0; i < tagTemplates.length; i += 1) {
    const tagName = tagTemplates[i].replace(regExp2, '');
    const tag = tagTemplates[i];
    await getContentFile(tagName)
      .then((currTemplate) => {
        res = res.replace(tag, currTemplate);
      })
      .catch((error) => {
        if (error) {
          console.error(error);
        }
      });
  }
  return res;
}

async function getStartTemplate() {
  const templatePath = path.resolve('06-build-page', 'template.html');

  const fileContent = await fsPromises.readFile(templatePath, 'utf8');

  return fileContent;
}

function addTemplate(temp) {
  const indexPath = path.resolve(distPath, 'index.html');
  fs.writeFile(indexPath, temp, (err) => {
    if (err) {
      console.error(err);
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
        fs.appendFile(stylePath, data, (err1) => {
          if (err1) {
            console.error(err1);
          }
        });
      });
    } else if (!styleFile.isFile() && styleFile.name !== 'project-dist') {
      const nestedStylesFold = path.resolve(`${mergePath}\\${styleFile.name}`);
      mergeStyles(nestedStylesFold);
    }
  }
}

createDist();
copyDir(path.join(currDirPath, 'assets'), path.join(distPath, 'assets'));

mergeStyles(stylesPath);

getStartTemplate()
  .then((fileContent) => {
    return replaceTemplateTags(fileContent);
  })
  .then((newTemplate) => {
    return addTemplate(newTemplate);
  });
