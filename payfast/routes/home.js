module.exports = (app) => {
    app.post('/', (req, res, next) => {
        const dadosEntrega = req.body;

        req.assert('nCdServico', 'Código é obrigatório e deve ser um decimal').notEmpty().isFloat();
        req.assert('sCepOrigem', 'CEP de origem é obrigatório e deve ser um decimal').notEmpty().isFloat();
        req.assert('sCepDestino', 'CEP de destino é obrigatório e deve ser um decimal').notEmpty().isFloat();
        const errors = req.validationErrors();

        if (errors) {
            res.status(400).json({ errors, dadosEntrega })
            return next(errors);
        }

        const correiosService = new app.services.correiosSOAPClient();
        correiosService.calculaPrazo(dadosEntrega, function (error, response) {
            if (error) {
                console.log('erro ao calcular prazo.');
                res.status(500).send(erro);
                return;
            }

            console.log('prazo calculado com sucesso!');
            res.json(response);
        });
    });
};
