const pagamentoStatus = {
    criado: 'CRIADO',
    confirmado: 'CONFIRMADO',
    cancelado: 'CANCELADO'
};

function PagamentoController(app) {
    this._pagamentoService = new app.services.pagamentosService(app);
    const logger = app.services.loggerService;

    // Lista todos os pagamentos
    this.lista = (req, res) => {
        this._pagamentoService.lista((error, result) => {
            if (error) {
                res.status(500).json({ error });
                logger.error(error);
                return;
            }

            res.json(result);
        });
    };

    // Detalhe do pagamento :id
    this.detalhe = (req, res, next) => {
        const id = req.params.id;
        logger.info(`consultando pagamento id: ${id}`);

        req.assert('id', 'ID não é válido').isFloat();
        const errors = req.validationErrors();

        if (errors) {
            res.status(400).json(errors);
            return next(errors);
        }

        /**
         * Antes de realizar a busca no banco de dados, verifica se a informação está no cache;
         * instancia memcachedClient e verifica se o ID já está no cache
         */
        const memcachedClient = app.services.memcachedClient();
        memcachedClient.get('pagamento-' + id, (erro, retorno) => {
            if (erro || !retorno) {
                console.log('MISS - chave nao encontrada');

                this._pagamentoService.buscaById(id, (error, result) => {
                    if (error) {
                        console.log(`Erro ao consultar no banco: ${error}`);
                        res.status(500).json(error);
                    } else {
                        const pagamento = (result || [{}]).pop();

                        // adiciona pagamento ao cache para que o próximo pagamento venha diretamento do cache
                        memcachedClient.set('pagamento-' + pagamento.id, pagamento, 1000, function (err) {
                            console.log('nova chave: pagamento-' + pagamento.id)
                        });

                        res.status(200).json(pagamento);
                    }
                    return;
                });

            } else {
                console.log('HIT - chave encontrada ' + JSON.stringify(retorno));
                res.json(retorno);
                return;
            }
        });
    };

    // Confirmar pagamento -> alterar status para confirmado
    this.confirma = (req, res, next) => {
        const id = req.params.id;

        req.assert('id', 'ID não é válido').isFloat();
        const errors = req.validationErrors();

        if (errors) {
            res.status(400).json(errors);
            return next(errors);
        }

        const pagamento = {
            id,
            status: pagamentoStatus.confirmado,
            data: new Date
        };

        this._pagamentoService.atualiza(pagamento, (error) => {
            if (error) {
                console.log(`Erro ao consultar id:${id} no banco: ${error}`);
                res.status(500).json(error);
            } else {
                res.location(`pagamentos/pagamento/${pagamento.id}`);
                res.status(200).json(pagamento);
            }
        });
    };

    // Cancelar pagamento -> alterar status para cancelado
    this.cancela = (req, res, next) => {
        const id = req.params.id;

        req.assert('id', 'ID não é válido').isFloat();
        const errors = req.validationErrors();

        if (errors) {
            res.status(400).json(errors);
            return next(errors);
        }

        const pagamento = {
            id,
            status: pagamentoStatus.cancelado,
            data: new Date
        };

        this._pagamentoService.atualiza(pagamento, (error) => {
            if (error) {
                console.log(`Erro ao cancelar id:${id} no banco: ${error}`);
                res.status(500).json(error);
            } else {
                res.status(204).json(pagamento);
            }
        });
    };

    this.cadastra = (req, res, next) => {
        const pagamento = req.body;
        const gravaPagamento = (pagamento) => {
            console.log('gravando pagamento...');
            this._pagamentoService.salva(pagamento, (error, result) => {
                if (error) {
                    console.log(`Erro ao inserir no banco: ${error}`);
                    res.status(500).json(error);
                } else {
                    pagamento.id = result.insertId; // atualiza o pagamento com o id gravado no banco
                    console.log(`pagamento id:${pagamento.id} gravado com sucesso!`);

                    // ISERINDO NO CACHE
                    app.services.memcachedClient().set('pagamento-' + pagamento.id, pagamento, 1000, function (err) {
                        console.log('nova chave: pagamento-' + pagamento.id)
                    });

                    res.status(201).json(pagamento);
                }
            });
        };

        // validando pagamento
        req.assert('forma_de_pagamento', 'Forma de pagamento é obrigatória.').notEmpty();
        req.assert('valor', 'Valor é obrigatório e deve ser um decimal.').notEmpty().isFloat();
        req.assert('moeda', 'Moeda é obrigatória e deve ter 3 caracteres').notEmpty().len(3, 3);
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
        pagamentoNovo = {
            id: pagamento.id,
            forma_de_pagamento: pagamento.forma_de_pagamento,
            valor: pagamento.valor,
            moeda: pagamento.moeda,
            status: pagamentoStatus.criado,
            data: new Date,
            descricao: pagamento.descricao,
        };

        switch (pagamento.forma_de_pagamento) {
            case 'cartao':
                console.log('Processando pagamento cartao...');
                this._validaPagamentoCartao(pagamento.cartao, (error, response) => {
                    if (error) {
                        console.log('Pagamento cartao inválido.');
                        res.status(error.statusCode || 500).json(error.msgError);
                        return next(error.msgError);
                    }

                    console.log('Pagamento cartao aprovado!');
                    gravaPagamento(pagamentoNovo);
                    return;
                });
                break;

            default:
                gravaPagamento(pagamentoNovo);
        }
    };

    this._validaPagamentoCartao = (cartao, callback) => {
        const cartaoService = new app.services.cartoesService();
        cartaoService.autoriza(cartao, callback);
    };

    return this;
}

module.exports = () => {
    return PagamentoController;
}
