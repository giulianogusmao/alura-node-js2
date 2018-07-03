const fs = require('fs'),
    { path, img } = require('./imgPath')();

console.log('lendo imagem com fs.readFile');
fs.readFile(`${path}/${img}`, function(error, buffer) {
    if (error) {
        console.log('Erro ao ler arquivo com fs.readFile');
        console.log(error);
        return;
    }
    console.log('imagem carregada.');
    console.log('criando copia da imagem carregada...');

    fs.writeFile(`${path}/imagem_copy-fs_writeFile.jpg`, buffer, function (err) {
        if (err) {
            console.log('Erro ao gravar arquivo com fs.writeFile');
            return;
        }

        console.log('imagem gravada com fs.writeFile');
    });
});
