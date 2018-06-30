const http = require('http');

function CartoesService() {
    this._config = {
        hostname: 'http://localhost',
        port: '3001',
        headers: {
            // 'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    };
}

function bufferToJson(buffer) {
    return JSON.parse(buffer.toString());
};

CartoesService.prototype.autoriza = (cartao, callback) => {
    // configura requisição
    const config = {
        hostname: 'localhost',
        port: '3001',
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        path: '/cartoes/autoriza'
    };

    // cria requisição
    const req = http.request(config, (res) => {
        if (('' + res.statusCode).match(/^2\d\d$/)) {
            res.on('data', (body) => {
                callback(null, bufferToJson(body));
            });
        } else {
            res.on('data', (body) => {
                callback({ msgError: bufferToJson(body), statusCode: res.statusCode });
            });
        }
    });

    // envia requisição
    req.end(JSON.stringify(cartao));
};


module.exports = () => {
    return CartoesService;
}
