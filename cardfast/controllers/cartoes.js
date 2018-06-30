module.exports = (app) => {
    var route = '/cartoes';

    app.get(route, (req, res, next) => {
        // const connection = app.models.cartaoFactory();
        // const cartaoDAO = new app.models.cartaoDAO(connection);

        // cartaoDAO.lista((error, result) => {
        //     if (error) {
        //         res.status(500).json({ error });
        //         return next(error);
        //     }

        //     res.json(result);
        // });

        // connection.end();
        res.json([]);
    });

    app.post(`${route}/autoriza`, (req, res, next) => {
        const cartao = req.body;

        console.log('---------------');
        console.log(`cartão recebido: ${cartao.numero}`);

        // validando cartao
        req.assert("numero", "Número do cartão é obrigatório.").notEmpty();
        req.assert("numero", "Número do cartão deve ser um decimal.").isFloat();
        req.assert("numero", "Número do cartão deve ter 16 caracteres.").len(16, 16);
        req.assert("bandeira", "Bandeira do cartão é obrigatório.").notEmpty();
        req.assert("ano_de_expiracao", "Ano de expiração é obrigatório.").notEmpty();
        req.assert("ano_de_expiracao", "Ano de expiração deve ser um decimal.").isFloat();
        req.assert("mes_de_expiracao", "Mês de expiração é obrigatório.").notEmpty();
        req.assert("mes_de_expiracao", "Mês de expiração deve ser um decimal.").isFloat();
        req.assert("cvv", "Código de segurança é obrigatório.").notEmpty();
        req.assert("cvv", "Código de segurança deve ter 3 caracteres.").len(3, 3);
        const errors = req.validationErrors();

        console.log('validando...');
        if (errors) {
            res.status(400).json({ errors, cartao });
            return next(errors);
        }

        console.log('processando...');

        /**
         * Após realizar todas as validações
         * altera o status do cartao para criado, atualiza data do cartao
         * e realiza o cadastro;
         */
        let response = {
            cartao,
            status: 'AUTORIZADO',
            data: new Date,
        };

        // const connection = app.models.cartaoFactory();
        // const cartaoDAO = new app.models.cartaoDAO(connection);

        // cartaoDAO.salva(cartao, (error, result) => {
        //     if (error) {
        //         console.log(`Erro ao inserir no banco: ${error}`);
        //         res.status(500).json(error);
        //     } else {
        //         res.location(`${route + action}/${result.insertId}`);
        //         cartao.id = result.insertId; // atualiza o cartao com o id gravado no banco
        //         res.status(201).json(cartao);
        //     }
        // });

        // connection.end();

        setTimeout(() => {
            console.log(JSON.stringify(response));
            console.log('Autorizado!\n');
            res.json(response);
        }, 2000);
    });
}
