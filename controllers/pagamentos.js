module.exports = function(app) {
    var route = '/pagamentos';

    app.get(route, function (request, response) {
        response.send(JSON.stringify({ pagamentos: "Fulano" }));
    });

    app.post(route + '/pagamento', function(req, res) {
        var pagamento = req.body;
        console.log('Processando uma requisicao de um novo pagamento');

        pagamento.status = 'criado';
        pagamento.data = new Date();

        res.send(pagamento);
    });
}