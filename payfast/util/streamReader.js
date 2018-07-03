const fs = require('fs'),
    { path, img } = require('./imgPath')();

console.log('lendo imagem com fs.createReadStream');
fs
    .createReadStream(`${path}/${img}`)
    .pipe(fs.createWriteStream(`${path}/imagem_copy-fs_createWriteStream.jpg`))
    .on('error', (err) => {
        console.log('Erro ao gravar arquivo com fs.createWriteStream');
        console.log(err);
    })
    .on('finish', (err) => {
        console.log('imagem gravada com fs.createWriteStream');
    });
