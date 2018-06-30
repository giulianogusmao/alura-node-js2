module.exports = (app) => {
    var route = '/pagamentos',
        action = '/pagamento';

    // Lista todos os pagamentos
    app.get(route, (req, res, next) => {
        const connection = app.models.pagamentoFactory();
        const pagamentoDAO = new app.models.pagamentoDAO(connection);

        pagamentoDAO.lista((error, result) => {
            if (error) {
                res.status(500).json({ error });
                return next(error);
            }

            res.json(result);
        });

        connection.end();
    });

    // Detalhe do pagamento :id
    app.get(`${route + action}/:id`, (req, res, next) => {
        const connection = app.models.pagamentoFactory();
        const pagamentoDAO = new app.models.pagamentoDAO(connection);
        const id = req.params.id;

        req.assert('id', 'ID não é válido').isFloat();
        const errors = req.validationErrors();

        if (errors) {
            res.status(400).json(errors);
            return next(errors);
        }

        pagamentoDAO.buscaPorId(id, (error, result) => {
            if (error) {
                console.log(`Erro ao consultar no banco: ${error}`);
                res.status(500).json(error);
            } else {
                res.status(200).json((result || [{}]).pop());
            }
        });

        connection.end();
    });

    // Confirmar pagamento -> alterar status para confirmado
    app.put(`${route + action}/:id`, (req, res, next) => {
        const id = req.params.id;

        req.assert('id', 'ID não é válido').isFloat();
        const errors = req.validationErrors();

        if (errors) {
            res.status(400).json(errors);
            return next(errors);
        }

        const pagamento = {
            id,
            status: 'CONFIRMADO',
            data: new Date
        };

        const connection = app.models.pagamentoFactory();
        const pagamentoDAO = new app.models.pagamentoDAO(connection);
        pagamentoDAO.atualiza(pagamento, (error) => {
            if (error) {
                console.log(`Erro ao consultar id:${id} no banco: ${error}`);
                res.status(500).json(error);
            } else {
                res.location(`${route + action}/${pagamento.id}`);
                res.status(200).json(pagamento);
            }
        });

        connection.end();
    });

    // Cancelar pagamento -> alterar status para cancelado
    app.delete(`${route + action}/:id`, (req, res, next) => {
        const id = req.params.id;

        req.assert('id', 'ID não é válido').isFloat();
        const errors = req.validationErrors();

        if (errors) {
            res.status(400).json(errors);
            return next(errors);
        }

        const pagamento = {
            id,
            status: 'CANCELADO',
            data: new Date
        };

        const connection = app.models.pagamentoFactory();
        const pagamentoDAO = new app.models.pagamentoDAO(connection);
        pagamentoDAO.atualiza(pagamento, (error) => {
            if (error) {
                console.log(`Erro ao cancelar id:${id} no banco: ${error}`);
                res.status(500).json(error);
            } else {
                res.status(204).json(pagamento);
            }
        });

        connection.end();
    });

    // Cadastrar novo pagamento -> cadastra um pagamento com status criado
    app.post(`${route + action}`, (req, res, next) => {
        const pagamento = req.body;

        // validando pagamento
        req.assert("forma_de_pagamento", "Forma de pagamento é obrigatória.").notEmpty();
        req.assert("valor", "Valor é obrigatório e deve ser um decimal.").notEmpty().isFloat();
        req.assert("moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3, 3);
        const errors = req.validationErrors();

        if (errors) {
            res.status(400).json({ errors, pagamento });
            return next(errors);
        }

        /**
         * Após realizar todas as validações
         * altera o status do pagamento para criado, atualiza data do pagamento
         * e realiza o cadastro;
         */
        pagamento.status = "CRIADO";
        pagamento.data = new Date;

        switch (pagamento.forma_de_pagamento) {
            case "cartao":
                console.log('Processando pagamento cartao...');
                const cartaoService = new app.services.cartoesService();
                cartaoService.autoriza(pagamento.cartao, (error, response) => {
                    if (error) {
                        res.status(error.statusCode).json(error.msgError);
                        return next(error);
                    }

                    res.json(response);
                    return;
                });
                break;
            default:
                res.json(pagamento);
        }


        // const connection = app.models.pagamentoFactory();
        // const pagamentoDAO = new app.models.pagamentoDAO(connection);

        // pagamentoDAO.salva(pagamento, (error, result) => {
        //     if (error) {
        //         console.log(`Erro ao inserir no banco: ${error}`);
        //         res.status(500).json(error);
        //     } else {
        //         res.location(`${route + action}/${result.insertId}`);
        //         pagamento.id = result.insertId; // atualiza o pagamento com o id gravado no banco
        //         res.status(201).json(pagamento);
        //     }
        // });

        // connection.end();
        // res.json(pagamento);
    });
}
