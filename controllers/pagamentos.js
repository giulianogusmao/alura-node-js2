module.exports = (app) => {
    var route = '/pagamentos';

    app.get(route, (req, res, next) => {
        const connection = app.models.pagamentoFactory();
        const pagamentoDAO = new app.models.pagamentoDAO(connection);

        pagamentoDAO.lista((error, result) => {
            if (error) {
                return next(error);
            }

            res.json(result);
        });

        connection.end();
    });

    app.post(`${route}/pagamento`, (req, res, next) => {
        const pagamento = req.body;

        // validando pagamento
        req.assert("forma_de_pagamento", "Forma de pagamento é obrigatória.").notEmpty();
        req.assert("valor", "Valor é obrigatório e deve ser um decimal.").notEmpty().isFloat();
        req.assert("moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3, 3);
        const errors = req.validationErrors();
        
        if (errors) {
            res.status(400).json({ errors, pagamento });
            return;
        }
        
        res.json({ 'pagamento': 'recebido' });
    });
}