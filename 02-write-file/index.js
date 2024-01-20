const readline = require('readline');
const fs = require('fs');
const path = require('path');

const outputPath = path.resolve('02-write-file\\output.txt');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('SIGINT', function () {
  console.log('\nУже уходишь...?');
  process.exit(1);
});

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

function writeAnswer(question) {
  rl.question(question, (answer) => {
    if (answer === 'exit') {
      rl.write('Уже уходишь...?');
      process.exit(1);
    }

    fs.open(path.join(outputPath), 'a', (err) => {
      if (err) console.error(err);
      fs.appendFile(
        path.resolve(path.join(outputPath)),
        `${answer}\n`,
        'utf-8',
        (err) => {
          if (err) console.log(err);
        },
      );
    });

    writeAnswer(question);
  });
}

console.log('Hello!');
createEmptyFile(outputPath);
writeAnswer('Почему RSSchool?: ');
