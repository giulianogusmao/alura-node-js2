function PagamentosService(app) {
    this._creteConnection = function () {
        const connection = app.models.pagamentoFactory();
        const pagamentoDAO = new app.models.pagamentoDAO(connection);
        return { connection, pagamentoDAO };
    };
}

PagamentosService.prototype.lista = function (callback) {
    const { connection, pagamentoDAO } = this._creteConnection();
    pagamentoDAO.lista(callback);
    connection.end();
};

PagamentosService.prototype.buscaById = function (id, callback) {
    const { connection, pagamentoDAO } = this._creteConnection();
    pagamentoDAO.buscaPorId(id, callback);
    connection.end();
};

PagamentosService.prototype.atualiza = function (pagamento, callback) {
    const { connection, pagamentoDAO } = this._creteConnection();
    pagamentoDAO.atualiza(pagamento, callback);
    connection.end();
};

PagamentosService.prototype.salva = function (pagamento, callback) {
    const { connection, pagamentoDAO } = this._creteConnection();
    pagamentoDAO.salva(pagamento, callback);
    connection.end();
};

module.exports = () => {
    return PagamentosService;
}
