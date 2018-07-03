const fs = require('fs');

function UploadsController(app) {
    this._app = app;
}

UploadsController.prototype.cadastraImg = function (req, res) {
    const filename = req.headers.filename;
    console.log(`Carregando arquivo: ${filename}...`);

    req
        .pipe(fs.createWriteStream(`files/uploads/${filename}`))
        .on('error', (error) => {
            console.log(`Erro ao subir arquivo: ${filename}`);
            console.log(error);
            res.status(500).json({ error, 'upload': filename });
        })
        .on('finish', () => {
            console.log(`Upload ${filename} completo`);
            res.status(201).json({ 'upload': filename });
        });

}

module.exports = () => {
    return UploadsController;
}
