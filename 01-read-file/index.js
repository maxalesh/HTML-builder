const fs = require('fs');
const path = require('path');
const stream = fs.ReadStream(path.join('01-read-file\\text.txt'), {
  encoding: 'utf-8',
});

stream.on('readable', () => {
  const data = stream.read();
  if (data) {
    console.log(data.toString());
  }
});

stream.on('error', (err) => {
  if (err.code == 'ENOENT') {
    console.log('Файл не найден');
  } else {
    console.error(err);
  }
});
