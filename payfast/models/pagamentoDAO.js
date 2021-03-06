function PagamentoDAO(connection) {
    this._connection = connection;
}

PagamentoDAO.prototype.salva = function (pagamento, callback) {
    this._connection.query(`
        INSERT INTO pagamentos
            (forma_de_pagamento, valor, moeda, status, data, descricao)
        values
            (?, ?, ?, ?, ?, ?)
        `, [
            pagamento.forma_de_pagamento,
            pagamento.valor,
            pagamento.moeda,
            pagamento.status,
            pagamento.data,
            pagamento.descricao
        ], callback);
}

PagamentoDAO.prototype.lista = function (callback) {
    this._connection.query('SELECT * FROM pagamentos', callback);
}

PagamentoDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query("SELECT * FROM pagamentos WHERE id = ?", [id], callback);
}

PagamentoDAO.prototype.atualiza = function (pagamento, callback) {
    this._connection.query(
        `UPDATE pagamentos
        SET status = ?, data = ?
        WHERE id = ?`,
        [pagamento.status, pagamento.data, pagamento.id], callback);
}

module.exports = () => {
    return PagamentoDAO;
}
