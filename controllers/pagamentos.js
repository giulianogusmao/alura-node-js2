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
}