var soap = require('soap');

function CorreiosSOAPClient() {
    this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
};

CorreiosSOAPClient.prototype.calculaPrazo = function (args, callback) {
    console.log('Calculando prazo...');
    soap.createClient(this._url, function (error, client) {
        if (error) {
            callback(error);
            return;
        }

        client.CalcPrazo(args, callback);
    });
}

module.exports = function () {
    return CorreiosSOAPClient;
};
