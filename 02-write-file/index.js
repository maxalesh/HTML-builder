const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('SIGINT', function () {
  console.log('\nУже уходишь...?');
  process.exit(1);
});

function writeAnswer(question) {
  rl.question(question, (answer) => {
    if (answer === 'exit') {
      rl.write('Уже уходишь...?');
      process.exit(1);
    }

    fs.open('output.txt', 'w', (err) => {
      if (err) throw err;
      fs.appendFile(
        path.join('02-write-file\\output.txt'),
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
writeAnswer('Почему RSSchool?: ');
