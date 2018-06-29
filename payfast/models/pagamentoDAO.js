function PagamentoDAO(connection) {
    this._connection = connection;
}

PagamentoDAO.prototype.salva = function (cartao, callback) {
    this._connection.query('INSERT INTO pagamentos SET ?', cartao, callback);
}

PagamentoDAO.prototype.lista = function (callback) {
    this._connection.query('SELECT * FROM pagamentos', callback);
}

PagamentoDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query("SELECT * FROM pagamentos WHERE id = ?", [id], callback);
}

PagamentoDAO.prototype.atualiza = function (cartao, callback) {
    this._connection.query(
        `UPDATE pagamentos 
        SET status = ?, data = ? 
        WHERE id = ?`,
        [cartao.status, cartao.data, cartao.id], callback);
}

module.exports = () => {
    return PagamentoDAO;
}
