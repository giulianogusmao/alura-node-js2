const http = require('http');

const urlConfig = {
    hostname: 'localhost',
    port: '3001',
    headers: {
        'Content-Type': 'application/json'
    },
};

function CartoesService() { }

function bufferToJson(buffer) {
    return JSON.parse(buffer.toString());
};

CartoesService.prototype.autoriza = (cartao, callback) => {
    // configura requisição
    const config = Object.assign({}, urlConfig, {
        method: 'post',
        path: '/cartoes/autoriza'
    });

    // cria requisição
    const req = http.request(config, (res) => {
        if (('' + res.statusCode).match(/^2\d\d$/)) {
            res.on('data', (body) => {
                callback(null, bufferToJson(body));
            });
            return;
        }

        res.on('data', (error) => {
            callback({ msgError: bufferToJson(error), statusCode: res.statusCode });
        });
    });

    // envia requisição
    req.end(JSON.stringify(cartao));
};


module.exports = () => {
    return CartoesService;
}
